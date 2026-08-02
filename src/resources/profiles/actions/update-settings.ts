'use server'

import { getSession } from '@/lib/server-utils'
import prisma from '@/lib/prisma'
import * as v from 'valibot'
import { ProfileSettingsSchema } from '@/resources/profiles/validators'

export const updateSettingsAction = async (input: unknown) => {
  const session = await getSession()
  if (!session) return { error: 'Not authenticated' }

  const result = v.safeParse(ProfileSettingsSchema, input)
  if (!result.success) return { error: result.issues[0].message }

  const { gender, birthday, location, bio } = result.output

  await prisma.profile.update({
    where: { userId: session.user.id },
    data: {
      gender,
      birthday: birthday ? new Date(birthday) : null,
      location: location || null,
      bio: bio || null,
    },
  })

  return { success: true }
}
