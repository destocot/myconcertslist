import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'My Concert List',
  description: 'Track your concerts',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' className={cn('h-full antialiased', inter.variable)}>
      <body className='flex min-h-full flex-col'>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
