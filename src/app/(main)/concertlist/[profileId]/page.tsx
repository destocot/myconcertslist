import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ConcertList } from '@/components/concerts/concert-list'

interface PageProps {
  readonly params: Promise<{ profileId: string }>
}

export default async function Page({ params }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/sign-in')

  const { profileId } = await params

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
  })

  if (!profile || profile.userId !== session.user.id) notFound()

  return <ConcertList />
}
