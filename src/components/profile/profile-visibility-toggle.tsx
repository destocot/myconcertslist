'use client'

import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useMutation } from '@tanstack/react-query'
import { toggleVisibilityAction } from '@/resources/profiles/actions/toggle-visibility'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface ProfileVisibilityToggleProps {
  isPublic: boolean
}

export const ProfileVisibilityToggle = ({
  isPublic,
}: ProfileVisibilityToggleProps) => {
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: toggleVisibilityAction,
    onSuccess: (profile) => {
      toast.success(profile.isPublic ? 'Profile set to public' : 'Profile set to private')
      router.refresh()
    },
    onError: () => toast.error('Failed to update visibility'),
  })

  return (
    <div className='flex items-center gap-2'>
      <Switch
        id='visibility'
        checked={isPublic}
        onCheckedChange={() => mutation.mutate()}
        disabled={mutation.isPending}
      />
      <Label htmlFor='visibility' className='cursor-pointer font-normal'>
        Public profile
      </Label>
    </div>
  )
}
