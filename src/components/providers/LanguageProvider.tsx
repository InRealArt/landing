'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useLanguageStore } from '@/store/languageStore'

interface LanguageProviderProps {
  children: ReactNode
}

export default function LanguageProvider({ children }: LanguageProviderProps) {
  const { language, setLanguage } = useLanguageStore()
  const [isHydrated, setIsHydrated] = useState(false)

  // Gérer l'hydration côté client
  useEffect(() => {
    // Récupérer la langue depuis localStorage si disponible
    const storedLanguage = localStorage.getItem('language-storage')
    if (storedLanguage) {
      try {
        const parsedState = JSON.parse(storedLanguage)
        if (parsedState.state && parsedState.state.language) {
          setLanguage(parsedState.state.language)
        }
      } catch (e) {
        console.error('Erreur lors de la récupération de la langue:', e)
      }
    }
    
    setIsHydrated(true)
  }, [setLanguage])

  // Mettre à jour l'attribut lang de la balise html quand la langue change
  useEffect(() => {
    if (document && isHydrated) {
      document.documentElement.lang = language
    }
  }, [language, isHydrated])

  return <>{children}</>
} 