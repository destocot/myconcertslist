import { getSession } from '@/lib/server-utils'
import { findAllConcerts } from '@/resources/concerts/queries'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const GET = async () => {
  const session = await getSession()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const profile = await prisma.profile.findUniqueOrThrow({
    where: { userId: session.user.id },
  })

  const concerts = await findAllConcerts(profile.id)
  return NextResponse.json(concerts)
}
