import type { Metadata } from 'next'
import { getSession, requireProfile, assertAccess } from '@/lib/server-utils'
import { ConcertList } from '@/components/concerts/concert-list'

interface PageProps {
  readonly params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  return { title: `${username}'s Concert List` }
}

export default async function Page({ params }: PageProps) {
  const { username } = await params
  const [session, profile] = await Promise.all([
    getSession(),
    requireProfile(username),
  ])
  const isOwner = assertAccess(profile, session)

  return <ConcertList isOwner={isOwner} username={username} />
}
