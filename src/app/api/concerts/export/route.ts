import { getSession } from '@/lib/server-utils'
import { findAllConcerts } from '@/resources/concerts/queries'
import prisma from '@/lib/prisma'

const cell = (val: string) => `"${val.replaceAll('"', '""')}"`

export const GET = async () => {
  const session = await getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const profile = await prisma.profile.findUniqueOrThrow({
    where: { userId: session.user.id },
  })

  const concerts = await findAllConcerts(profile.id)

  const date = new Date().toISOString().slice(0, 10)
  const filename = `concerts-${session.user.username}-${date}.csv`

  const rows = concerts
    .sort((a, b) => +new Date(a.performedAt) - +new Date(b.performedAt))
    .map((c) =>
      [
        cell(c.artist),
        cell(c.venue ?? ''),
        cell(new Date(c.performedAt).toISOString().slice(0, 10)),
        cell(c.status),
        cell(new Date(c.createdAt).toISOString().slice(0, 10)),
      ].join(','),
    )

  const csv = ['artist,venue,date,status,added_on', ...rows].join('\r\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
