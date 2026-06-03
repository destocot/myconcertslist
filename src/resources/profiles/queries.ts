import prisma from '@/lib/prisma'

export const findProfileSettings = async (userId: string) => {
  return prisma.profile.findUnique({
    where: { userId },
    select: { gender: true, birthday: true, location: true, bio: true, theme: true },
  })
}
