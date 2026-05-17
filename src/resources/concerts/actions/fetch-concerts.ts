'use server'

import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { findAllConcerts } from '@/resources/concerts/queries'
import { headers } from 'next/headers'

export const fetchConcertsAction = async () => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new Error('Unauthorized')

  const profile = await prisma.profile.findUniqueOrThrow({
    where: { userId: session.user.id },
  })

  return findAllConcerts(profile.id)
}
