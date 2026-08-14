'use client'

import { useLanguageStore } from '@/store/languageStore'
import { useLanguageSwitch } from '@/contexts/LanguageSwitchContext'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { language, t } = useLanguageStore()
  // Comportement natif par défaut, surchargeable par la page courante
  // (ex. article de blog : redirection vers le slug de la traduction).
  const switchLanguage = useLanguageSwitch()

  const toggleLanguage = () => {
    switchLanguage(language === 'fr' ? 'en' : 'fr')
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