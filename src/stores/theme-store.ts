import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'blue' | 'green' | 'purple'

const VALID_THEMES: Theme[] = ['blue', 'green', 'purple']

const applyTheme = (theme: Theme) => {
  document.documentElement.setAttribute('data-theme', theme)
}

interface ThemeStore {
  theme: Theme
  mounted: boolean
  setTheme: (theme: Theme) => void
  _setMounted: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'blue',
      mounted: false,
      setTheme: (theme) => {
        set({ theme })
        applyTheme(theme)
      },
      _setMounted: () => set({ mounted: true }),
    }),
    {
      name: 'mcl-theme',
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const theme = VALID_THEMES.includes(state.theme) ? state.theme : 'blue'
          state.theme = theme
          if (typeof window !== 'undefined') applyTheme(theme)
        }
      },
    },
  ),
)

export const isValidTheme = (t: string): t is Theme =>
  (VALID_THEMES as string[]).includes(t)
