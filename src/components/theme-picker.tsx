'use client'

import { useThemeStore } from '@/stores/theme-store'
import { updateThemeAction } from '@/resources/profiles/actions/update-theme'
import { CheckIcon } from 'lucide-react'

const THEMES = [
  { id: 'blue', label: 'Blue', swatch: 'oklch(0.42 0.155 265)' },
  { id: 'green', label: 'Green', swatch: 'oklch(0.42 0.13 155)' },
  { id: 'purple', label: 'Purple', swatch: 'oklch(0.42 0.17 305)' },
] as const

export const ThemePicker = () => {
  const { theme, setTheme, mounted } = useThemeStore()

  if (!mounted) return null

  return (
    <div className='flex items-center gap-2'>
      {THEMES.map(({ id, label, swatch }) => {
        const active = theme === id
        return (
          <button
            key={id}
            title={label}
            onClick={() => {
              setTheme(id)
              updateThemeAction(id)
            }}
            className='relative h-7 w-7 rounded-full transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2'
            style={{
              backgroundColor: swatch,
              outline: active ? `2px solid ${swatch}` : undefined,
              outlineOffset: active ? '3px' : undefined,
            }}
          >
            {active && (
              <CheckIcon
                className='absolute inset-0 m-auto h-3.5 w-3.5'
                style={{ color: 'oklch(0.98 0.005 0)' }}
              />
            )}
            <span className='sr-only'>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
