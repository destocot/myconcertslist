import { getSession, requireProfile, assertAccess } from '@/lib/server-utils'
import { findAllConcerts } from '@/resources/concerts/queries'
import { ProfileVisibilityToggle } from '@/components/profile/profile-visibility-toggle'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CalendarDays, Music2, ListMusic, Bookmark, Download } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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

  const concerts = await findAllConcerts(profile.id)

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const upcoming = concerts.filter(
    (c) => c.status === 'confirmed' && new Date(c.performedAt) >= now,
  ).length
  const past = concerts.filter(
    (c) => c.status === 'confirmed' && new Date(c.performedAt) < now,
  ).length
  const maybe = concerts.filter((c) => c.status === 'maybe').length

  const initials = profile.user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const memberSince = profile.createdAt.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className='mx-auto w-full max-w-4xl px-4 py-6'>
      <Card className='overflow-hidden'>
        <div className='bg-primary h-24' />
        <CardContent className='relative pb-6 pt-0'>
          <div className='flex items-end justify-between'>
            <div className='bg-primary text-primary-foreground -mt-10 flex h-20 w-20 items-center justify-center rounded-full border-4 border-card text-2xl font-bold'>
              {initials}
            </div>
            <div className='mb-1 flex items-center gap-3'>
              {isOwner && <ProfileVisibilityToggle isPublic={profile.isPublic} />}
              {isOwner && (
                <Button asChild variant='outline' size='sm'>
                  <a href='/api/concerts/export' download>
                    <Download className='h-3.5 w-3.5' />
                    Export CSV
                  </a>
                </Button>
              )}
              <Button asChild variant='outline' size='sm'>
                <Link href={`/concertlist/${profile.user.username}`}>View list</Link>
              </Button>
            </div>
          </div>
          <div className='mt-3'>
            <h1 className='text-xl font-bold'>{profile.user.name}</h1>
            <p className='text-muted-foreground flex items-center gap-1.5 text-sm'>
              <CalendarDays className='h-3.5 w-3.5' />
              Member since {memberSince}
            </p>
          </div>

          <Separator className='my-5' />

          <div className='grid grid-cols-3 gap-4 text-center'>
            <StatCard
              icon={<Music2 className='mx-auto mb-1 h-5 w-5' />}
              label='Upcoming'
              value={upcoming}
            />
            <StatCard
              icon={<ListMusic className='mx-auto mb-1 h-5 w-5' />}
              label='Past'
              value={past}
            />
            <StatCard
              icon={<Bookmark className='mx-auto mb-1 h-5 w-5' />}
              label='Maybe'
              value={maybe}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const StatCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) => (
  <div className='bg-muted/40 rounded-md p-4'>
    <div className='text-muted-foreground'>{icon}</div>
    <p className='text-2xl font-bold'>{value}</p>
    <p className='text-muted-foreground text-xs'>{label}</p>
  </div>
)
