import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import type { Profile } from '@/generated/prisma/client'

export const getSession = async () => {
  return auth.api.getSession({ headers: await headers() })
}

export const requireSession = async () => {
  const session = await getSession()
  if (!session) redirect('/sign-in')
  return session
}

export const requireProfile = async (username: string) => {
  const profile = await prisma.profile.findFirst({
    where: { user: { username } },
    include: { user: true },
  })
  if (!profile) notFound()
  return profile
}

export const assertAccess = (
  profile: Pick<Profile, 'userId' | 'isPublic'>,
  session: Awaited<ReturnType<typeof getSession>>,
): boolean => {
  const isOwner = session?.user.id === profile.userId
  if (!profile.isPublic && !isOwner) {
    if (!session) redirect('/sign-in')
    notFound()
  }
  return isOwner
}
