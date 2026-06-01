'use client'

import { useEffect, useRef } from 'react'
import { useThemeStore, isValidTheme } from '@/stores/theme-store'

export const ThemeSync = ({ theme }: { theme: string }) => {
  const { setTheme, onMount } = useThemeStore()
  const lastDbTheme = useRef<string | null>(null)

  useEffect(() => {
    onMount()
    if (isValidTheme(theme) && lastDbTheme.current !== theme) {
      lastDbTheme.current = theme
      setTheme(theme)
    }
  }, [theme, setTheme, onMount])

  return null
}
