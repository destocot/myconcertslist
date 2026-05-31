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
    .map((c) => {
      const d = new Date(c.performedAt)
      const hasTime = d.getUTCHours() !== 0 || d.getUTCMinutes() !== 0
      const time = hasTime
        ? `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
        : ''
      return [
        cell(c.headliner),
        cell(c.tourName ?? ''),
        cell(c.openers.map((o) => o.name).join(', ')),
        cell(c.venue ?? ''),
        cell(d.toISOString().slice(0, 10)),
        cell(time),
        cell(c.status),
        cell(new Date(c.createdAt).toISOString().slice(0, 10)),
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
