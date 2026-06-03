'use server'

import { getSession } from '@/lib/server-utils'
import prisma from '@/lib/prisma'

const VALID_GENDERS = new Set(['not_specified', 'male', 'female', 'non_binary'])

export type UpdateSettingsInput = {
  gender: string
  birthday: string
  location: string
  bio: string
}

export const updateSettingsAction = async (input: UpdateSettingsInput) => {
  const session = await getSession()
  if (!session) return { error: 'Not authenticated' }

  const gender = VALID_GENDERS.has(input.gender) ? input.gender : 'not_specified'
  const birthday = input.birthday ? new Date(input.birthday) : null
  const location = input.location.trim() || null
  const bio = input.bio.trim() || null

  await prisma.profile.update({
    where: { userId: session.user.id },
    data: { gender, birthday, location, bio },
  })

  return { success: true }
}
