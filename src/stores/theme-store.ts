import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'blue' | 'green' | 'purple'

export const VALID_THEMES: Theme[] = ['blue', 'green', 'purple']

export const isValidTheme = (t: string): t is Theme => VALID_THEMES.includes(t as Theme)

const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme
}

interface ThemeStore {
  theme: Theme
  mounted: boolean
  setTheme: (theme: Theme) => void
  onMount: () => void
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
      onMount: () => set({ mounted: true }),
    }),
    {
      name: 'mcl-theme',
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        const theme = isValidTheme(state.theme) ? state.theme : 'blue'
        state.theme = theme
        applyTheme(theme)
      },
    },
  ),
)