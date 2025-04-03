'use client'

import { useLanguageStore } from '@/store/languageStore'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguageStore()

  const toggleLanguage = () => {
    setLanguage(language === 'fr' ? 'en' : 'fr')
  }

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center gap-1 text-sm font-medium rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 p-2 transition-colors"
      aria-label={t('language.switchTo')}
    >
      <Globe size={18} />
      <span className="uppercase">{t('language.current')}</span>
    </button>
  )
} 