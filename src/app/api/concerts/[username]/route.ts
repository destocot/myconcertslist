import { findAllConcerts } from '@/resources/concerts/queries'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ username: string }>
}

export const GET = async (_req: Request, { params }: RouteParams) => {
  const { username } = await params

  const profile = await prisma.profile.findFirst({
    where: { user: { username } },
  })

  if (!profile?.isPublic) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const concerts = await findAllConcerts(profile.id)
  return NextResponse.json(concerts)
}
