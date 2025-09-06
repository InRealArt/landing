'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light')
  const [isHydrated, setIsHydrated] = useState(false)

  // Handle hydration on client side
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme-storage')
    if (storedTheme) {
      try {
        const parsedState = JSON.parse(storedTheme)
        if (parsedState.state && parsedState.state.theme) {
          setTheme(parsedState.state.theme)
        }
      } catch (e) {
        // If parsing fails, check for simple string value
        if (storedTheme === 'light' || storedTheme === 'dark') {
          setTheme(storedTheme as Theme)
        }
      }
    }
    setIsHydrated(true)
  }, [])

  // Update data-theme attribute when theme changes
  useEffect(() => {
    if (!isHydrated) return

    const root = document.documentElement
    root.setAttribute('data-theme', theme)

    // Store theme preference
    localStorage.setItem('theme-storage', JSON.stringify({
      state: { theme },
      version: 0
    }))
  }, [theme, isHydrated])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
