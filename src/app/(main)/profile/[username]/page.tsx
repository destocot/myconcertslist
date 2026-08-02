import type { Metadata } from 'next'
import { getSession, requireProfile, assertAccess } from '@/lib/server-utils'
import { findAllConcerts } from '@/resources/concerts/queries'
import { ProfileVisibilityToggle } from '@/components/profile/profile-visibility-toggle'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  Music2Icon,
  ListMusicIcon,
  BookmarkIcon,
  DownloadIcon,
  Settings2Icon,
} from 'lucide-react'
import { MAX_FAVORITES } from '@/resources/concerts/constants'
import { FavoritesSection } from '@/components/profile/favorites-section'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface PageProps {
  readonly params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params
  const profile = await requireProfile(username)
  return { title: `${profile.user.displayUsername!}'s Profile` }
}

const GENDER_LABELS: Record<string, string> = {
  male: 'Male',
  female: 'Female',
  non_binary: 'Non-Binary',
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
  now.setUTCHours(0, 0, 0, 0)

  const upcoming = concerts.filter(
    (c) => c.status === 'confirmed' && new Date(c.performedAt) >= now,
  ).length
  const past = concerts.filter(
    (c) => c.status === 'confirmed' && new Date(c.performedAt) < now,
  ).length
  const maybe = concerts.filter((c) => c.status === 'maybe').length

  const initials = profile.user.displayUsername!.slice(0, 2).toUpperCase()

  const memberSince = profile.createdAt.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const birthdayDisplay = profile.birthday
    ? profile.birthday.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
    : null

  const genderDisplay = profile.gender ? (GENDER_LABELS[profile.gender] ?? null) : null

  const favorites = concerts
    .filter((c) => c.favoritedAt)
    .sort((a, b) => +new Date(a.favoritedAt!) - +new Date(b.favoritedAt!))
    .slice(0, MAX_FAVORITES)

  const lastConcert = concerts
    .filter((c) => c.status === 'confirmed' && new Date(c.performedAt) < now)
    .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())[0] ?? null

  const nextConcert = concerts
    .filter((c) => c.status === 'confirmed' && new Date(c.performedAt) >= now)
    .sort((a, b) => new Date(a.performedAt).getTime() - new Date(b.performedAt).getTime())[0] ?? null

  return (
    <div className='mx-auto w-full max-w-4xl px-4 py-6'>
      <Card className='gap-0 overflow-hidden pt-0'>
        <div className='bg-primary h-28' />
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
                    <DownloadIcon className='h-3.5 w-3.5' />
                    Export CSV
                  </a>
                </Button>
              )}
              {isOwner && (
                <Button asChild variant='outline' size='sm'>
                  <Link href='/editprofile'>
                    <Settings2Icon className='h-3.5 w-3.5' />
                    Edit Profile
                  </Link>
                </Button>
              )}
              <Button asChild variant='outline' size='sm'>
                <Link href={`/concertlist/${profile.user.username}`}>View list</Link>
              </Button>
            </div>
          </div>

          <div className='mt-3'>
            <h1 className='text-xl font-bold'>{profile.user.displayUsername!}&apos;s Profile</h1>
            {profile.bio && (
              <p className='text-muted-foreground mt-2 text-sm leading-relaxed'>{profile.bio}</p>
            )}
            <div className='mt-3 grid grid-cols-[auto_1fr] items-center gap-x-6 gap-y-1 text-sm'>
              {genderDisplay && (
                <>
                  <span className='text-muted-foreground'>Gender</span>
                  <span>{genderDisplay}</span>
                </>
              )}
              {birthdayDisplay && (
                <>
                  <span className='text-muted-foreground'>Birthday</span>
                  <span>{birthdayDisplay}</span>
                </>
              )}
              {profile.location && (
                <>
                  <span className='text-muted-foreground'>Location</span>
                  <span>{profile.location}</span>
                </>
              )}
              <span className='text-muted-foreground'>Joined</span>
              <span>{memberSince}</span>
            </div>
          </div>

          <Separator className='my-5' />

          <div className='grid grid-cols-3 gap-4 text-center'>
            <StatCard
              icon={<Music2Icon className='mx-auto mb-1 h-5 w-5' />}
              label='Upcoming'
              value={upcoming}
            />
            <StatCard
              icon={<ListMusicIcon className='mx-auto mb-1 h-5 w-5' />}
              label='Past'
              value={past}
            />
            <StatCard
              icon={<BookmarkIcon className='mx-auto mb-1 h-5 w-5' />}
              label='Maybe'
              value={maybe}
            />
          </div>

          {(favorites.length > 0 || isOwner) && (
            <>
              <Separator className='my-5' />
              <FavoritesSection favorites={favorites} isOwner={isOwner} />
            </>
          )}

          {lastConcert && (
            <>
              <Separator className='my-5' />
              <div className='grid grid-cols-2 gap-3'>
                <div className='bg-muted/40 border-border relative overflow-hidden rounded-lg border p-4'>
                  <div className='bg-primary absolute top-0 left-0 h-full w-1' />
                  <p className='text-muted-foreground mb-2 text-xs font-medium uppercase tracking-widest'>Last Show</p>
                  <p className='truncate text-base font-bold leading-tight'>{lastConcert.headliner}</p>
                  {lastConcert.tourName && (
                    <p className='text-primary mt-0.5 truncate text-xs'>{lastConcert.tourName}</p>
                  )}
                  <p className='text-muted-foreground mt-2 truncate text-xs'>
                    {new Date(lastConcert.performedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    {lastConcert.venue && ` · ${lastConcert.venue}`}
                  </p>
                </div>
                {nextConcert ? (
                  <div className='border-primary/30 bg-primary/5 relative overflow-hidden rounded-lg border p-4'>
                    <div className='bg-primary absolute top-0 left-0 h-full w-1' />
                    <p className='text-primary mb-2 text-xs font-medium uppercase tracking-widest'>Next Show</p>
                    <p className='truncate text-base font-bold leading-tight'>{nextConcert.headliner}</p>
                    {nextConcert.tourName && (
                      <p className='text-primary mt-0.5 truncate text-xs'>{nextConcert.tourName}</p>
                    )}
                    <p className='text-muted-foreground mt-2 truncate text-xs'>
                      {new Date(nextConcert.performedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      {nextConcert.venue && ` · ${nextConcert.venue}`}
                    </p>
                  </div>
                ) : (
                  <div className='border-border relative overflow-hidden rounded-lg border border-dashed p-4 flex flex-col items-center justify-center text-center'>
                    <p className='text-2xl mb-1'>🎟️</p>
                    <p className='text-muted-foreground text-xs font-medium'>No upcoming shows</p>
                    <p className='text-muted-foreground/60 text-xs mt-0.5'>Time to find your next concert</p>
                  </div>
                )}
              </div>
            </>
          )}
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
