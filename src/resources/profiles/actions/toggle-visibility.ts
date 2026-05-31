'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/server-utils'
import prisma from '@/lib/prisma'

export const toggleVisibilityAction = async () => {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const profile = await prisma.profile.findUniqueOrThrow({
    where: { userId: session.user.id },
  })

  revalidatePath('/')
  return prisma.profile.update({
    where: { id: profile.id },
    data: { isPublic: !profile.isPublic },
  })
}
