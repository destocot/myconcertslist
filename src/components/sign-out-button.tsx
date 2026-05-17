'use client'

import { signOut } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export const SignOutButton = () => {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <Button variant='outline' size='sm' onClick={handleSignOut}>
      Sign out
    </Button>
  )
}
