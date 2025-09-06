'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { useLanguageStore } from '@/store/languageStore'
import { Sun, Moon } from 'lucide-react'

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguageStore()

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-textColor/10 transition-colors cursor-pointer"
      aria-label={theme === 'dark' ? t('theme.switchToLight') : t('theme.switchToDark')}
    >
      {theme === 'dark' ? (
        <Sun size={18} className="text-textColor" />
      ) : (
        <Moon size={18} className="text-textColor" />
      )}
    </button>
  )
}
