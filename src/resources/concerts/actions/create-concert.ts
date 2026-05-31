'use server'

import { getSession } from '@/lib/server-utils'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import * as v from 'valibot'
import { createConcert } from '@/resources/concerts/queries'
import { ConcertSchema } from '@/resources/concerts/validators'

export const createConcertAction = async (input: unknown) => {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const data = v.parse(ConcertSchema, input)

  const profile = await prisma.profile.findUniqueOrThrow({
    where: { userId: session.user.id },
  })

  const concert = await createConcert({
    headliner: data.headliner,
    tourName: data.tourName || null,
    venue: data.venue || null,
    performedAt: new Date(`${data.performedAt}T${data.time || '00:00'}:00.000Z`),
    status: data.status,
    profileId: profile.id,
  })

  if (data.openers?.length) {
    await prisma.opener.createMany({
      data: data.openers.map((name) => ({ name, concertId: concert.id })),
    })
  }

  revalidatePath('/')
  return concert
}
