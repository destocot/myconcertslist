import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import { ConcertList } from '@/components/concerts/concert-list'

interface PageProps {
  readonly params: Promise<{ username: string }>
}

export default async function Page({ params }: PageProps) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/sign-in')

  const { username } = await params

  const profile = await prisma.profile.findFirst({
    where: { user: { username } },
  })

  if (!profile || profile.userId !== session.user.id) notFound()

  return <ConcertList />
}
