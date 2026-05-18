import type { Prisma } from '@/generated/prisma/client'
import prisma from '@/lib/prisma'

export const findAllConcerts = (profileId: string) => {
  return prisma.concert.findMany({
    where: { profileId },
  })
}


export const createConcert = (data: Prisma.ConcertUncheckedCreateInput) => {
  return prisma.concert.create({ data })
}

export const updateConcert = (
  id: string,
  data: Prisma.ConcertUncheckedUpdateInput,
) => {
  return prisma.concert.update({ where: { id }, data })
}

export const removeConcert = (id: string) => {
  return prisma.concert.delete({ where: { id } })
}
