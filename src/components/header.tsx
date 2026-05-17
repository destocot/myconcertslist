import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { SignOutButton } from '@/components/sign-out-button'
import { Music2, User } from 'lucide-react'
import prisma from '@/lib/prisma'
import Link from 'next/link'

export const Header = async () => {
  const session = await auth.api.getSession({ headers: await headers() })

  const profile = session
    ? await prisma.profile.findUnique({ where: { userId: session.user.id } })
    : null

  return (
    <header className='bg-primary text-primary-foreground'>
      <div className='mx-auto flex h-14 max-w-4xl items-center justify-between px-4'>
        <Link href='/' className='flex items-center gap-2'>
          <Music2 className='h-5 w-5' />
          <span className='text-lg font-bold tracking-tight'>
            MyConcertList
          </span>
        </Link>
        {session && profile && (
          <div className='flex items-center gap-3'>
            <Link
              href={`/profile/${profile.id}`}
              className='text-primary-foreground/70 hover:text-primary-foreground flex items-center gap-1.5 text-sm transition-colors'
            >
              <User className='h-4 w-4' />
              {session.user.name}
            </Link>
            <SignOutButton />
          </div>
        )}
      </div>
    </header>
  )
}
