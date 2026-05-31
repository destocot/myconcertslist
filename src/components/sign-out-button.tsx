'use client'

import { signOut } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export const SignOutButton = () => {
  const router = useRouter()
  const [isPending, setIsPending] = useState(false)

  const handleSignOut = async () => {
    setIsPending(true)
    const result = await signOut()
    if (result?.error) {
      toast.error('Sign out failed')
      setIsPending(false)
      return
    }
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <Button
      variant='outline'
      size='sm'
      onClick={handleSignOut}
      disabled={isPending}
      className='border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground hover:border-primary-foreground/50'
    >
      {isPending ? <Loader2 className='animate-spin' /> : 'Sign out'}
    </Button>
  )
}
