'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/** Solid primary at the top of the page, translucent blurred glass once scrolled. */
export const HeaderShell = ({ children }: { children: React.ReactNode }) => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'text-primary-foreground border-primary-foreground/10 sticky inset-x-0 top-0 z-100 w-full border-b transition-all duration-200',
        scrolled ? 'bg-primary/75 backdrop-blur-lg' : 'bg-primary',
      )}
    >
      {children}
    </header>
  )
}
