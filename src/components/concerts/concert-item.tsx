'use client'

import type { Concert } from '@/generated/prisma/client'
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
import { MapPin, Calendar, Pencil, Trash2, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConcertItemProps {
  concert: Concert
  isPast?: boolean
  showConfirm?: boolean
  onUpdate: (id: string, data: ConcertInput) => Promise<void>
  onDelete: (id: string) => Promise<void>
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
  const formattedDate = new Date(concert.performedAt).toLocaleDateString(
    'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  )

  return (
    <div
      className={cn(
        'bg-card group flex items-center gap-4 border-b px-4 py-3 last:border-b-0',
        isPast && 'opacity-50',
      )}
    >
      <div className='bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded text-sm font-bold'>
        {concert.artist.slice(0, 2).toUpperCase()}
      </div>

      <div className='min-w-0 flex-1'>
        <p className='text-foreground truncate font-semibold leading-tight'>
          {concert.artist}
        </p>
        <div className='text-muted-foreground mt-0.5 flex items-center gap-3 text-xs'>
          {concert.venue && (
            <span className='flex items-center gap-1 truncate'>
              <MapPin className='h-3 w-3 shrink-0' />
              {concert.venue}
            </span>
          )}
          <span className='flex shrink-0 items-center gap-1'>
            <Calendar className='h-3 w-3' />
            {formattedDate}
          </span>
        </div>
      </div>

      <div className='flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
        {showConfirm && onConfirm && (
          <Button
            variant='ghost'
            size='icon'
            onClick={() => onConfirm(concert.id)}
            title='Confirm attendance'
          >
            <CheckCheck className='text-primary' />
          </Button>
        )}

        <ConcertFormDialog
          concert={concert}
          onSubmit={(data) => onUpdate(concert.id, data)}
          trigger={
            <Button variant='ghost' size='icon'>
              <Pencil />
            </Button>
          }
        />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='text-destructive hover:text-destructive'
            >
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete concert?</AlertDialogTitle>
              <AlertDialogDescription>
                Remove{' '}
                <span className='text-foreground font-medium'>
                  {concert.artist}
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
      </div>
    </div>
  )
}
