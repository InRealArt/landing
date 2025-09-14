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

  // Initialize theme on mount
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      // Default to light mode and set it
      setTheme('light')
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }, [])

  // Update theme when it changes
  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    handleSetTheme(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
