'use server'

import { getSession } from '@/lib/server-utils'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import * as v from 'valibot'
import { updateConcert } from '@/resources/concerts/queries'
import { ConcertSchema } from '@/resources/concerts/validators'

export const updateConcertAction = async (id: string, input: unknown) => {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  const data = v.parse(ConcertSchema, input)

  await prisma.concert.findFirstOrThrow({
    where: { id, profile: { userId: session.user.id } },
  })

  await prisma.opener.deleteMany({ where: { concertId: id } })

  if (data.openers?.length) {
    await prisma.opener.createMany({
      data: data.openers.map((name) => ({ name, concertId: id })),
    })
  }

  const performedAt = new Date(
    `${data.performedAt}T${data.time || '00:00'}:00.000Z`,
  )

  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  // favorites are past-concerts-only — drop it if this edit moves it out of the past
  const leavesPast = data.status !== 'confirmed' || performedAt >= today

  revalidatePath('/')
  return updateConcert(id, {
    headliner: data.headliner,
    tourName: data.tourName || null,
    venue: data.venue || null,
    performedAt,
    status: data.status,
    favoritedAt: leavesPast ? null : undefined,
  })
}
