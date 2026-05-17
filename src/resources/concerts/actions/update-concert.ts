'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import * as v from 'valibot'
import { updateConcert } from '@/resources/concerts/queries'
import { ConcertSchema } from '@/resources/concerts/validators'

export const updateConcertAction = async (id: string, input: unknown) => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Unauthorized')

  const data = v.parse(ConcertSchema, input)

  await prisma.concert.findFirstOrThrow({
    where: { id, profile: { userId: session.user.id } },
  })

  revalidatePath('/')
  return updateConcert(id, {
    artist: data.artist,
    venue: data.venue || null,
    performedAt: new Date(data.performedAt),
    status: data.status,
  })
}
