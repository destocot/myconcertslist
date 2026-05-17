'use client'

import type { Concert } from '@/generated/prisma/client'
import { ConcertItem } from '@/components/concerts/concert-item'
import { ConcertFormDialog } from '@/components/concerts/concert-form-dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { concertKeys } from '@/resources/concerts/keys'
import { fetchConcertsAction } from '@/resources/concerts/actions/fetch-concerts'
import { createConcertAction } from '@/resources/concerts/actions/create-concert'
import { updateConcertAction } from '@/resources/concerts/actions/update-concert'
import { removeConcertAction } from '@/resources/concerts/actions/remove-concert'
import type { ConcertInput } from '@/resources/concerts/validators'
import { toast } from 'sonner'
import { Plus, Music2 } from 'lucide-react'
import { Fragment, useState } from 'react'

const getToday = (): Date => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

const splitConcerts = (concerts: Concert[], today: Date) => ({
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

export const ConcertList = () => {
  const queryClient = useQueryClient()
  const [today, setToday] = useState<Date>(getToday)

  const { data: concerts = [], isLoading } = useQuery({
    queryKey: concertKeys.lists(),
    queryFn: fetchConcertsAction,
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: concertKeys.lists() })

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

  const handleCreate = async (data: ConcertInput) => {
    await createMutation.mutateAsync(data)
  }

  const handleUpdate = async (id: string, data: ConcertInput) => {
    await updateMutation.mutateAsync({ id, data })
  }

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
  }

  const handleConfirm = async (id: string) => {
    const concert = concerts.find((c) => c.id === id)
    if (!concert) return
    await updateMutation.mutateAsync({
      id,
      data: {
        artist: concert.artist,
        venue: concert.venue ?? '',
        performedAt: concert.performedAt.toISOString().slice(0, 10),
        status: 'confirmed',
      },
    })
  }

  const handleTabChange = () => setToday(getToday())

  const { upcoming, past, maybe } = splitConcerts(concerts, today)

  return (
    <div className='mx-auto w-full max-w-4xl px-4 py-6'>
      <div className='mb-5 flex items-center justify-between'>
        <h1 className='text-xl font-bold'>Concert List</h1>
        <ConcertFormDialog
          onSubmit={handleCreate}
          trigger={
            <Button size='sm' className='gap-1.5'>
              <Plus className='h-4 w-4' />
              Add concert
            </Button>
          }
        />
      </div>

      <Tabs defaultValue='upcoming' onValueChange={handleTabChange}>
        <TabsList className='mb-4'>
          <TabsTrigger value='upcoming'>
            Upcoming
            {upcoming.length > 0 && (
              <TabCount count={upcoming.length} />
            )}
          </TabsTrigger>
          <TabsTrigger value='past'>
            Past
            {past.length > 0 && <TabCount count={past.length} />}
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
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </TabsContent>
            <TabsContent value='past'>
              <ConcertTabPanel
                concerts={past}
                emptyLabel='No past concerts'
                forceIsPast
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            </TabsContent>
            <TabsContent value='maybe'>
              <ConcertTabPanel
                concerts={maybe}
                emptyLabel='No maybe concerts'
                isMaybeTab
                today={today}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                onConfirm={handleConfirm}
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}

const TabCount = ({ count }: { count: number }) => (
  <span className='bg-primary/10 text-primary ml-1.5 rounded px-1.5 py-0.5 text-xs font-medium'>
    {count}
  </span>
)

interface ConcertTabPanelProps {
  concerts: Concert[]
  emptyLabel: string
  forceIsPast?: boolean
  isMaybeTab?: boolean
  today?: Date
  onUpdate: (id: string, data: ConcertInput) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onConfirm?: (id: string) => Promise<void>
}

const ConcertTabPanel = ({
  concerts,
  emptyLabel,
  forceIsPast,
  isMaybeTab,
  today,
  onUpdate,
  onDelete,
  onConfirm,
}: ConcertTabPanelProps) => {
  if (concerts.length === 0) {
    return (
      <div className='bg-card rounded py-16 text-center'>
        <Music2 className='text-muted-foreground/40 mx-auto mb-3 h-10 w-10' />
        <p className='text-muted-foreground text-sm'>{emptyLabel}</p>
      </div>
    )
  }

  const getMonthLabel = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className='bg-card overflow-hidden rounded'>
      {concerts.map((concert, i) => {
        const isPast =
          forceIsPast ||
          (isMaybeTab && today
            ? new Date(concert.performedAt) < today
            : false)

        const currentMonth = getMonthLabel(new Date(concert.performedAt))
        const prevMonth =
          i > 0
            ? getMonthLabel(new Date(concerts[i - 1].performedAt))
            : null
        const showMonthDivider = currentMonth !== prevMonth

        return (
          <Fragment key={concert.id}>
            {showMonthDivider && (
              <div className='bg-muted/40 px-4 py-1.5'>
                <span className='text-muted-foreground text-xs font-semibold uppercase tracking-wide'>
                  {currentMonth}
                </span>
              </div>
            )}
            <ConcertItem
              concert={concert}
              isPast={isPast}
              showConfirm={isMaybeTab}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onConfirm={onConfirm}
            />
          </Fragment>
        )
      })}
    </div>
  )
}
