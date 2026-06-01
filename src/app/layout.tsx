import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { ThemeSync } from '@/components/theme-sync'
import { Toaster } from '@/components/ui/sonner'
import { getSession } from '@/lib/server-utils'
import prisma from '@/lib/prisma'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: {
    default: 'MyConcertList',
    template: '%s - MyConcertList',
  },
  description: 'Track every concert you\'ve ever been to.',
  metadataBase: new URL(
    process.env.BASE_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'),
  ),
  openGraph: {
    siteName: 'MyConcertList',
    type: 'website',
    description: 'Track every concert you\'ve ever been to.',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await getSession()
  const profile = session
    ? await prisma.profile.findUnique({
        where: { userId: session.user.id },
        select: { theme: true },
      })
    : null
  const theme = profile?.theme ?? 'blue'

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`flex min-h-screen flex-col antialiased ${inter.variable}`}>
        <Providers>
          <ThemeSync theme={theme} />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
