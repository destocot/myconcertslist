import { getSession } from '@/lib/server-utils'
import { findAllConcerts } from '@/resources/concerts/queries'
import prisma from '@/lib/prisma'
import { toUtcDateString, toUtcTimeString } from '@/lib/date-utils'

const cell = (val: string) => `"${val.replaceAll('"', '""')}"`

export const GET = async () => {
  const session = await getSession()
  if (!session) return new Response('Unauthorized', { status: 401 })

  const profile = await prisma.profile.findUniqueOrThrow({
    where: { userId: session.user.id },
  })

  const concerts = await findAllConcerts(profile.id)

  const filename = `concerts-${session.user.username}-${toUtcDateString(new Date())}.csv`

  const rows = concerts
    .sort((a, b) => +new Date(a.performedAt) - +new Date(b.performedAt))
    .map((c) => {
      const d = new Date(c.performedAt)
      return [
        cell(c.headliner),
        cell(c.tourName ?? ''),
        cell(c.openers.map((o) => o.name).join(', ')),
        cell(c.venue ?? ''),
        cell(toUtcDateString(d)),
        cell(toUtcTimeString(d)),
        cell(c.status),
        cell(toUtcDateString(new Date(c.createdAt))),
      ].join(',')
    })

  const csv = ['headliner,tour_name,openers,venue,date,time,status,added_on', ...rows].join('\r\n')

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
