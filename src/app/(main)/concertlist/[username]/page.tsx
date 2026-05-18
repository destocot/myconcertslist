import { getSession, requireProfile, assertAccess } from '@/lib/server-utils'
import { ConcertList } from '@/components/concerts/concert-list'

interface PageProps {
  readonly params: Promise<{ username: string }>
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
