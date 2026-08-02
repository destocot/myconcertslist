'use client'

import type { ConcertWithOpeners } from '@/resources/concerts/queries'
import { MAX_FAVORITES } from '@/resources/concerts/constants'
import { toggleFavoriteAction } from '@/resources/concerts/actions/toggle-favorite'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { StarIcon } from 'lucide-react'
import { toast } from 'sonner'

interface FavoritesSectionProps {
  favorites: ConcertWithOpeners[]
  isOwner: boolean
}

export const FavoritesSection = ({
  favorites,
  isOwner,
}: FavoritesSectionProps) => {
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: (id: string) => toggleFavoriteAction(id),
    onSuccess: (result) => {
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success('Removed from favorites')
      router.refresh()
    },
    onError: () => toast.error('Failed to update favorite'),
  })

  return (
    <div>
      <div className='mb-3 flex items-center gap-1.5'>
        <StarIcon className='text-primary h-4 w-4 fill-current' />
        <h2 className='text-sm font-semibold uppercase tracking-widest'>
          Top {MAX_FAVORITES} Shows
        </h2>
      </div>

      {favorites.length === 0 ? (
        <div className='border-border rounded-lg border border-dashed p-6 text-center'>
          <p className='text-muted-foreground text-sm'>No favorites yet</p>
          <p className='text-muted-foreground/60 mt-0.5 text-xs'>
            {isOwner
              ? 'Star a show in your Past tab to feature it here'
              : 'Nothing featured yet'}
          </p>
        </div>
      ) : (
        <ol className='border-border divide-border divide-y overflow-hidden rounded-lg border'>
          {favorites.map((concert, i) => (
            <li
              key={concert.id}
              className='bg-muted/30 group flex items-center gap-3 px-4 py-3'
            >
              <span className='bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold'>
                {i + 1}
              </span>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-bold leading-tight'>
                  {concert.headliner}
                </p>
                {concert.tourName && (
                  <p className='text-primary mt-0.5 truncate text-xs italic'>
                    {concert.tourName}
                  </p>
                )}
                <p className='text-muted-foreground mt-0.5 truncate text-xs'>
                  {new Date(concert.performedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    timeZone: 'UTC',
                  })}
                  {concert.venue && ` · ${concert.venue}`}
                </p>
              </div>
              {isOwner && (
                <Button
                  variant='ghost'
                  size='icon'
                  title='Remove from favorites'
                  disabled={mutation.isPending}
                  onClick={() => mutation.mutate(concert.id)}
                  className='shrink-0 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100'
                >
                  <StarIcon className='text-primary fill-current' />
                </Button>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
