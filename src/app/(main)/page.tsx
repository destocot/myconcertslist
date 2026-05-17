import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/sign-in')

  const profile = await prisma.profile.findUniqueOrThrow({
    where: { userId: session.user.id },
  })

  redirect(`/concertlist/${profile.id}`)
}
