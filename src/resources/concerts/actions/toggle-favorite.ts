'use server'

import { getSession } from '@/lib/server-utils'
import prisma from '@/lib/prisma'
import { MAX_FAVORITES } from '@/resources/concerts/constants'

interface ToggleFavoriteResult {
  favorited?: boolean
  error?: string
}

export const toggleFavoriteAction = async (
  id: string,
): Promise<ToggleFavoriteResult> => {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')

  return prisma.$transaction(async (tx) => {
    const concert = await tx.concert.findFirstOrThrow({
      where: { id, profile: { userId: session.user.id } },
      select: {
        id: true,
        favoritedAt: true,
        profileId: true,
        performedAt: true,
        status: true,
      },
    })

    if (concert.favoritedAt) {
      await tx.concert.update({ where: { id }, data: { favoritedAt: null } })
      return { favorited: false }
    }

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)

    if (concert.status !== 'confirmed' || concert.performedAt >= today) {
      return { error: 'Only past concerts can be favorited.' }
    }

    const count = await tx.concert.count({
      where: { profileId: concert.profileId, favoritedAt: { not: null } },
    })

    if (count >= MAX_FAVORITES) {
      return {
        error: `You can only favorite ${MAX_FAVORITES} concerts. Unfavorite one first.`,
      }
    }

    await tx.concert.update({ where: { id }, data: { favoritedAt: new Date() } })
    return { favorited: true }
  })
}