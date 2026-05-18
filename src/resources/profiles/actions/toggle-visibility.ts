'use server'

import { revalidatePath } from 'next/cache'
import { requireSession } from '@/lib/server-utils'
import prisma from '@/lib/prisma'

export const toggleVisibilityAction = async () => {
  const session = await requireSession()

  const profile = await prisma.profile.findUniqueOrThrow({
    where: { userId: session.user.id },
  })

  revalidatePath('/')
  return prisma.profile.update({
    where: { id: profile.id },
    data: { isPublic: !profile.isPublic },
  })
}
