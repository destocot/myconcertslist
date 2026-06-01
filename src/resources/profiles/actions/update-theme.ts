'use server'

import { getSession } from '@/lib/server-utils'
import prisma from '@/lib/prisma'

const VALID_THEMES = ['blue', 'green', 'purple'] as const

export const updateThemeAction = async (theme: string) => {
  if (!(VALID_THEMES as readonly string[]).includes(theme)) return
  const session = await getSession()
  if (!session) return
  await prisma.profile.update({
    where: { userId: session.user.id },
    data: { theme },
  })
}
