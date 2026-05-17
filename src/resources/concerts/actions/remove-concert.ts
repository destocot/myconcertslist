'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { removeConcert } from '@/resources/concerts/queries'

export const removeConcertAction = async (id: string) => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Unauthorized')

  await prisma.concert.findFirstOrThrow({
    where: { id, profile: { userId: session.user.id } },
  })

  revalidatePath('/')
  return removeConcert(id)
}
