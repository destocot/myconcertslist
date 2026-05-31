'use server'

import { getSession } from '@/lib/server-utils'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { removeConcert } from '@/resources/concerts/queries'

export const removeConcertAction = async (id: string) => {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  await prisma.concert.findFirstOrThrow({
    where: { id, profile: { userId: session.user.id } },
  })

  revalidatePath('/')
  return removeConcert(id)
}
