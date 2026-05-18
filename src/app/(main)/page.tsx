import { requireSession } from '@/lib/server-utils'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await requireSession()
  redirect(`/concertlist/${session.user.username}`)
}
