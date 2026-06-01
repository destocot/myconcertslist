'use server'

import { getSession } from '@/lib/server-utils'
import prisma from '@/lib/prisma'

const VALID_THEMES = new Set(['blue', 'green', 'purple'])

export const updateThemeAction = async (theme: string) => {
  if (!VALID_THEMES.has(theme)) return
  const session = await getSession()
  if (!session) return
  await prisma.profile.update({
    where: { userId: session.user.id },
    data: { theme },
  })
}
