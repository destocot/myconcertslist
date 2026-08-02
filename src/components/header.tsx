import { getSession } from '@/lib/server-utils'
import { SignOutButton } from '@/components/sign-out-button'
import { TicketIcon, UserIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const Header = async () => {
  const session = await getSession()

  return (
    <header className='bg-primary text-primary-foreground'>
      <div className='mx-auto flex h-14 max-w-4xl items-center justify-between px-4'>
        <Link
          href='/'
          className='hover:text-primary-foreground/80 flex items-center gap-2 transition-colors'
        >
          <TicketIcon className='h-5 w-5' />
          <span className='text-lg font-bold tracking-tight'>MyConcertList</span>
        </Link>
        {session?.user.username ? (
          <div className='flex items-center gap-4'>
            <Link
              href={`/profile/${session.user.username}`}
              className='text-primary-foreground/70 hover:text-primary-foreground flex items-center gap-1.5 text-sm transition-colors'
            >
              <UserIcon className='h-4 w-4' />
              {session.user.displayUsername}
            </Link>
            <SignOutButton />
          </div>
        ) : (
          <div className='flex items-center gap-4'>
            <Button
              asChild
              variant='outline'
              size='sm'
              className='border-transparent text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground hover:border-transparent'
            >
              <Link href='/sign-in'>Sign in</Link>
            </Button>
            <Button
              asChild
              variant='outline'
              size='sm'
              className='border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground hover:border-primary-foreground/50'
            >
              <Link href='/sign-up'>Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
