'use client'

import { ReactNode, useEffect } from 'react'
import { useLanguageStore } from '@/store/languageStore'

interface LanguageProviderProps {
  children: ReactNode
}

export default function LanguageProvider({ children }: LanguageProviderProps) {
  const { language } = useLanguageStore()

  // Mettre à jour l'attribut lang de la balise html quand la langue change
  useEffect(() => {
    if (document) {
      document.documentElement.lang = language
    }
  }, [language])

  return <>{children}</>
} 