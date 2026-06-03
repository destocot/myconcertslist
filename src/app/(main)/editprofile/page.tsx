import type { Metadata } from 'next'
import { requireSession } from '@/lib/server-utils'
import { findProfileSettings } from '@/resources/profiles/queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EditProfileForm } from './form'

export const metadata: Metadata = { title: 'Edit Profile' }

export default async function Page() {
  const session = await requireSession()

  const profile = await findProfileSettings(session.user.id)

  const birthday = profile?.birthday
    ? profile.birthday.toISOString().split('T')[0]
    : ''

  return (
    <div className='mx-auto w-full max-w-4xl px-4 py-6'>
      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='max-w-sm'>
            <EditProfileForm
              gender={profile?.gender ?? 'not_specified'}
              birthday={birthday}
              location={profile?.location ?? ''}
              bio={profile?.bio ?? ''}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
