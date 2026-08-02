import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { username } from 'better-auth/plugins'
import prisma from './prisma'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'sqlite',
  }),
  advanced: {
    database: {
      generateId: false,
    },
  },
  session: {
    // serve session data from a signed cookie for 5 minutes instead of hitting the DB every request
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  plugins: [
    username({
      usernameValidator: (value) => /^\w+$/.test(value),
    }),
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    minPasswordLength: 6,
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await prisma.profile.create({
            data: { userId: user.id },
          })
        },
      },
    },
  },
})
