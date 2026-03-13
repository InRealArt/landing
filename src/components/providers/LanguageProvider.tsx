'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useLanguageStore } from '@/store/languageStore'

interface LanguageProviderProps {
  children: ReactNode
}

export default function LanguageProvider({ children }: LanguageProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Use Zustand's built-in rehydration instead of manual localStorage parsing.
    // The store uses skipHydration: true, so this is the correct trigger point.
    // Calling rehydrate() here (post-commit, inside useEffect) means React has
    // already finished its initial render pass — no hydration mismatch.
    useLanguageStore.persist.rehydrate()

    // After rehydration, the persisted language may be 'en' but the en translations
    // may not have been loaded yet (e.g. first visit, cleared localStorage, or old
    // persisted state). Calling setLanguage ensures en.json is loaded if needed.
    const { language, translations } = useLanguageStore.getState()
    if (language === 'en' && (!translations.en || Object.keys(translations.en).length === 0)) {
      useLanguageStore.getState().setLanguage('en')
    }

    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return

    // Read language directly without subscribing the provider component to the
    // store — this avoids unnecessary re-renders of LanguageProvider itself.
    document.documentElement.lang = useLanguageStore.getState().language

    // Keep the attribute in sync with future language changes.
    const unsub = useLanguageStore.subscribe((state) => {
      document.documentElement.lang = state.language
    })
    return unsub
  }, [isHydrated])

  return <>{children}</>
} 