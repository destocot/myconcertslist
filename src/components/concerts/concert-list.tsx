'use client'

import type { ConcertWithOpeners } from '@/resources/concerts/queries'
import { ConcertItem } from '@/components/concerts/concert-item'
import { ConcertFormDialog } from '@/components/concerts/concert-form-dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { concertKeys } from '@/resources/concerts/keys'
import { createConcertAction } from '@/resources/concerts/actions/create-concert'
import { updateConcertAction } from '@/resources/concerts/actions/update-concert'
import { removeConcertAction } from '@/resources/concerts/actions/remove-concert'
import { toggleFavoriteAction } from '@/resources/concerts/actions/toggle-favorite'
import type { ConcertInput } from '@/resources/concerts/validators'
import { toast } from 'sonner'
import { PlusIcon, Music2Icon, ChevronDownIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useQueryState, parseAsStringLiteral, parseAsString } from 'nuqs'
import { Input } from '@/components/ui/input'
import { SearchIcon, XIcon } from 'lucide-react'
import { Fragment, useState } from 'react'
import Link from 'next/link'

const TABS = ['upcoming', 'past', 'maybe'] as const

const filterConcerts = (concerts: ConcertWithOpeners[], query: string) => {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (terms.length === 0) return concerts

  return concerts.filter((concert) => {
    const haystack = [
      concert.headliner,
      concert.tourName,
      concert.venue,
      ...concert.openers.map((o) => o.name),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return terms.every((term) => haystack.includes(term))
  })
}

const getToday = (): Date => {
  const d = new Date()
  d.setUTCHours(0, 0, 0, 0)
  return d
}

const splitConcerts = (concerts: ConcertWithOpeners[], today: Date) => ({
  upcoming: concerts
    .filter((c) => c.status === 'confirmed' && new Date(c.performedAt) >= today)
    .sort((a, b) => +new Date(a.performedAt) - +new Date(b.performedAt)),
  past: concerts
    .filter((c) => c.status === 'confirmed' && new Date(c.performedAt) < today)
    .sort((a, b) => +new Date(b.performedAt) - +new Date(a.performedAt)),
  maybe: concerts
    .filter((c) => c.status === 'maybe')
    .sort((a, b) => +new Date(a.performedAt) - +new Date(b.performedAt)),
})

interface ConcertListProps {
  isOwner: boolean
  username: string
  displayUsername: string
}

export const ConcertList = ({ isOwner, username, displayUsername }: ConcertListProps) => {
  const queryClient = useQueryClient()
  const [today, setToday] = useState<Date>(getToday)
  const [tab, setTab] = useQueryState(
    'tab',
    parseAsStringLiteral(TABS).withDefault('upcoming'),
  )
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''))

  const queryKey = isOwner ? concertKeys.lists() : concertKeys.public(username)
  const queryFn = isOwner
    ? () => fetch('/api/concerts').then((r) => r.json() as Promise<ConcertWithOpeners[]>)
    : () =>
        fetch(`/api/concerts/${username}`).then(
          (r) => r.json() as Promise<ConcertWithOpeners[]>,
        )

  const { data: concerts = [], isLoading } = useQuery({ queryKey, queryFn })

  const invalidate = () => queryClient.invalidateQueries({ queryKey })

  const createMutation = useMutation({
    mutationFn: (data: ConcertInput) => createConcertAction(data),
    onSuccess: () => {
      toast.success('Concert added')
      invalidate()
    },
    onError: () => toast.error('Failed to add concert'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ConcertInput }) =>
      updateConcertAction(id, data),
    onSuccess: () => {
      toast.success('Concert updated')
      invalidate()
    },
    onError: () => toast.error('Failed to update concert'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => removeConcertAction(id),
    onSuccess: () => {
      toast.success('Concert removed')
      invalidate()
    },
    onError: () => toast.error('Failed to remove concert'),
  })

  const favoriteMutation = useMutation({
    mutationFn: (id: string) => toggleFavoriteAction(id),
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(
        result.favorited ? 'Added to favorites' : 'Removed from favorites',
      )
      invalidate()
    },
    onError: () => toast.error('Failed to update favorite'),
  })

  const handleCreate = async (data: ConcertInput) => {
    await createMutation.mutateAsync(data)
  }

  const handleUpdate = async (id: string, data: ConcertInput) => {
    await updateMutation.mutateAsync({ id, data })
  }

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
  }

  const handleToggleFavorite = async (id: string) => {
    await favoriteMutation.mutateAsync(id)
  }

  const handleConfirm = async (id: string) => {
    const concert = concerts.find((c) => c.id === id)
    if (!concert) return
    await updateMutation.mutateAsync({
      id,
      data: {
        headliner: concert.headliner,
        venue: concert.venue ?? '',
        performedAt: new Date(concert.performedAt).toISOString().slice(0, 10),
        status: 'confirmed',
      },
    })
  }

  const handleTabChange = (value: string) => {
    setToday(getToday())
    setTab(value as (typeof TABS)[number])
    // search only applies to the past tab — don't leave a stale param behind
    if (value !== 'past') setQuery(null)
  }

  const { upcoming, past, maybe } = splitConcerts(concerts, today)
  const matchedPast = filterConcerts(past, query)

  return (
    <div className='mx-auto w-full max-w-4xl px-4 py-6'>
      <div className='mb-5 flex items-center justify-between'>
        <h1 className='text-xl font-bold'>Concert List</h1>
        {isOwner ? (
          <ConcertFormDialog
            onSubmit={handleCreate}
            trigger={
              <Button size='sm' className='gap-1.5'>
                <PlusIcon className='h-4 w-4' />
                Add concert
              </Button>
            }
          />
        ) : (
          <p className='text-muted-foreground hidden text-sm sm:block'>
            Viewing{' '}
            <Link
              href={`/profile/${username}`}
              className='text-foreground font-medium hover:underline'
            >
              {displayUsername}
            </Link>
            &apos;s Concert List
          </p>
        )}
      </div>

      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className='mb-4'>
          <TabsTrigger value='upcoming'>
            Upcoming
            {upcoming.length > 0 && <TabCount count={upcoming.length} />}
          </TabsTrigger>
          <TabsTrigger value='past'>
            Past
            {matchedPast.length > 0 && <TabCount count={matchedPast.length} />}
          </TabsTrigger>
          <TabsTrigger value='maybe'>
            Maybe
            {maybe.length > 0 && <TabCount count={maybe.length} />}
          </TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className='text-muted-foreground py-12 text-center text-sm'>
            Loading…
          </div>
        ) : (
          <>
            <TabsContent value='upcoming'>
              <ConcertTabPanel
                concerts={upcoming}
                emptyLabel='No upcoming concerts'
                onUpdate={isOwner ? handleUpdate : undefined}
                onDelete={isOwner ? handleDelete : undefined}
              />
            </TabsContent>
            <TabsContent value='past'>
              {past.length > 0 && (
                <ConcertSearchInput
                  value={query}
                  onChange={(next) => setQuery(next || null)}
                />
              )}
              <ConcertTabPanel
                concerts={matchedPast}
                emptyLabel={
                  query.trim()
                    ? `No past concerts match “${query.trim()}”`
                    : 'No past concerts'
                }
                groupByYear
                expandAll={!!query.trim()}
                onUpdate={isOwner ? handleUpdate : undefined}
                onDelete={isOwner ? handleDelete : undefined}
                onToggleFavorite={isOwner ? handleToggleFavorite : undefined}
              />
            </TabsContent>
            <TabsContent value='maybe'>
              <ConcertTabPanel
                concerts={maybe}
                emptyLabel='No maybe concerts'
                isMaybeTab
                onUpdate={isOwner ? handleUpdate : undefined}
                onDelete={isOwner ? handleDelete : undefined}
                onConfirm={isOwner ? handleConfirm : undefined}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}

interface ConcertSearchInputProps {
  value: string
  onChange: (value: string) => void
}

const ConcertSearchInput = ({ value, onChange }: ConcertSearchInputProps) => (
  <div className='relative mb-3'>
    <SearchIcon className='text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2' />
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder='Search headliner, tour, venue, openers…'
      aria-label='Search past concerts'
      className='pl-9'
    />
    {value && (
      <button
        type='button'
        onClick={() => onChange('')}
        aria-label='Clear search'
        className='text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2'
      >
        <XIcon className='h-4 w-4' />
      </button>
    )}
  </div>
)

const TabCount = ({ count }: { count: number }) => (
  <span className='bg-primary/10 text-primary ml-1.5 rounded px-1.5 py-0.5 text-xs font-medium'>
    {count}
  </span>
)

interface ConcertHandlers {
  isMaybeTab?: boolean
  onUpdate?: (id: string, data: ConcertInput) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onConfirm?: (id: string) => Promise<void>
  onToggleFavorite?: (id: string) => Promise<void>
}

interface ConcertTabPanelProps extends ConcertHandlers {
  concerts: ConcertWithOpeners[]
  emptyLabel: string
  groupByYear?: boolean
  expandAll?: boolean
}

const ConcertTabPanel = ({
  concerts,
  emptyLabel,
  groupByYear,
  expandAll,
  ...handlers
}: ConcertTabPanelProps) => {
  if (concerts.length === 0) {
    return (
      <div className='bg-card rounded py-16 text-center'>
        <Music2Icon className='text-muted-foreground/40 mx-auto mb-3 h-10 w-10' />
        <p className='text-muted-foreground text-sm'>{emptyLabel}</p>
      </div>
    )
  }

  if (!groupByYear) {
    return (
      <div className='bg-card overflow-hidden rounded'>
        <ConcertRows concerts={concerts} showYearInMonth {...handlers} />
      </div>
    )
  }

  const years = groupConcertsByYear(concerts)
  const currentYear = String(new Date().getUTCFullYear())
  // fall back to the most recent year so the panel is never fully collapsed
  const openYear = years.some((y) => y.year === currentYear)
    ? currentYear
    : years[0].year

  return (
    <div className='bg-card overflow-hidden rounded'>
      {years.map(({ year, concerts: yearConcerts }) => (
        <YearSection
          key={year}
          year={year}
          count={yearConcerts.length}
          defaultOpen={year === openYear}
          forceOpen={expandAll}
        >
          <ConcertRows concerts={yearConcerts} {...handlers} />
        </YearSection>
      ))}
    </div>
  )
}

interface YearGroup {
  year: string
  concerts: ConcertWithOpeners[]
}

const groupConcertsByYear = (concerts: ConcertWithOpeners[]): YearGroup[] =>
  concerts.reduce<YearGroup[]>((groups, concert) => {
    const year = String(new Date(concert.performedAt).getUTCFullYear())
    const last = groups.at(-1)
    if (last?.year === year) last.concerts.push(concert)
    else groups.push({ year, concerts: [concert] })
    return groups
  }, [])

interface YearSectionProps {
  year: string
  count: number
  defaultOpen: boolean
  forceOpen?: boolean
  children: React.ReactNode
}

const YearSection = ({
  year,
  count,
  defaultOpen,
  forceOpen,
  children,
}: YearSectionProps) => {
  const [expanded, setExpanded] = useState(defaultOpen)
  // while searching every year stays open, otherwise matches would hide behind a collapsed header
  const open = forceOpen || expanded

  return (
    <div className='border-b last:border-b-0'>
      <button
        type='button'
        onClick={() => setExpanded(!open)}
        aria-expanded={open}
        disabled={forceOpen}
        className='bg-muted/40 hover:bg-muted/60 flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors'
      >
        <ChevronDownIcon
          className={cn(
            'text-muted-foreground h-4 w-4 transition-transform',
            !open && '-rotate-90',
          )}
        />
        <span className='text-sm font-semibold'>{year}</span>
        <span className='text-muted-foreground ml-auto text-xs'>
          {count} {count === 1 ? 'show' : 'shows'}
        </span>
      </button>
      {open && children}
    </div>
  )
}

interface ConcertRowsProps extends ConcertHandlers {
  concerts: ConcertWithOpeners[]
  showYearInMonth?: boolean
}

const ConcertRows = ({
  concerts,
  showYearInMonth,
  isMaybeTab,
  onUpdate,
  onDelete,
  onConfirm,
  onToggleFavorite,
}: ConcertRowsProps) => {
  const getMonthLabel = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'long',
      ...(showYearInMonth && { year: 'numeric' }),
      timeZone: 'UTC',
    })

  return concerts.map((concert, i) => {
    const currentMonth = getMonthLabel(new Date(concert.performedAt))
    const prevMonth =
      i > 0 ? getMonthLabel(new Date(concerts[i - 1].performedAt)) : null
    const showMonthDivider = currentMonth !== prevMonth

    return (
      <Fragment key={concert.id}>
        {showMonthDivider && (
          <div className='bg-muted/20 px-4 py-1.5'>
            <span className='text-muted-foreground text-xs font-semibold uppercase tracking-wide'>
              {currentMonth}
            </span>
          </div>
        )}
        <ConcertItem
          concert={concert}
          showConfirm={isMaybeTab && !!onConfirm}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onConfirm={onConfirm}
          onToggleFavorite={onToggleFavorite}
        />
      </Fragment>
    )
  })
}
