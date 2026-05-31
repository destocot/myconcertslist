'use client'

import type { ConcertWithOpeners } from '@/resources/concerts/queries'
import { Button } from '@/components/ui/button'
import { ConcertFormDialog } from '@/components/concerts/concert-form-dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import type { ConcertInput } from '@/resources/concerts/validators'
import { MapPinIcon, CalendarIcon, PencilIcon, Trash2Icon, CheckCheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConcertItemProps {
  concert: ConcertWithOpeners
  isPast?: boolean
  showConfirm?: boolean
  onUpdate?: (id: string, data: ConcertInput) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onConfirm?: (id: string) => Promise<void>
}

export const ConcertItem = ({
  concert,
  isPast,
  showConfirm,
  onUpdate,
  onDelete,
  onConfirm,
}: ConcertItemProps) => {
  const date = new Date(concert.performedAt)
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  })
  const hasTime = date.getUTCHours() !== 0 || date.getUTCMinutes() !== 0
  const formattedTime = hasTime
    ? date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' })
    : null

  return (
    <div
      className={cn(
        'bg-card group flex items-center gap-4 border-b px-4 py-3.5 transition-colors last:border-b-0 hover:bg-muted/20',
      )}
    >
      <div
        className={cn(
          'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold',
          isPast
            ? 'bg-muted text-muted-foreground/60'
            : 'bg-primary/10 text-primary',
        )}
      >
        {concert.headliner.replace(/[^\p{L}\p{N}\s]/gu, '').trim().slice(0, 2).toUpperCase()}
      </div>

      <div className='min-w-0 flex-1'>
        <div className='flex items-start justify-between gap-2'>
          <p
            className={cn(
              'truncate font-semibold leading-snug',
              isPast ? 'text-foreground/50' : 'text-foreground',
            )}
          >
            {concert.headliner}
          </p>
          {concert.status === 'maybe' && (
            <span className='bg-muted text-muted-foreground shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium'>
              maybe
            </span>
          )}
        </div>
        {concert.tourName && (
          <p className='text-muted-foreground mt-0.5 truncate text-xs italic'>
            {concert.tourName}
          </p>
        )}
        {concert.openers.length > 0 && (
          <p className='text-muted-foreground mt-0.5 truncate text-xs'>
            w/ {concert.openers.map((o) => o.name).join(', ')}
          </p>
        )}
        <div className='text-muted-foreground mt-1 flex items-center gap-3 text-xs'>
          {concert.venue && (
            <span className='flex items-center gap-1 truncate'>
              <MapPinIcon className='h-3 w-3 shrink-0' />
              {concert.venue}
            </span>
          )}
          <span className='flex shrink-0 items-center gap-1'>
            <CalendarIcon className='h-3 w-3' />
            {formattedDate}
            {formattedTime && (
              <span className='text-muted-foreground/70'>· {formattedTime}</span>
            )}
          </span>
        </div>
      </div>

      {(showConfirm || onUpdate || onDelete) && (
        <div className='flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
          {showConfirm && onConfirm && (
            <Button
              variant='ghost'
              size='icon'
              onClick={() => onConfirm(concert.id)}
              title='Confirm attendance'
            >
              <CheckCheckIcon className='text-primary' />
            </Button>
          )}

          {onUpdate && (
            <ConcertFormDialog
              concert={concert}
              onSubmit={(data) => onUpdate(concert.id, data)}
              trigger={
                <Button variant='ghost' size='icon'>
                  <PencilIcon />
                </Button>
              }
            />
          )}

          {onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='text-destructive hover:text-destructive'
                >
                  <Trash2Icon />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete concert?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Remove{' '}
                    <span className='text-foreground font-medium'>
                      {concert.headliner}
                    </span>{' '}
                    from your list. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(concert.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      )}
    </div>
  )
}
