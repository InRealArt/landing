'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'

// Types pour grecaptcha (déjà déclarés dans src/lib/recaptcha.ts)

interface RecaptchaContextType {
  isLoaded: boolean
  loadRecaptcha: () => Promise<void>
  executeRecaptcha: (action: string) => Promise<string | null>
}

const RecaptchaContext = createContext<RecaptchaContextType | undefined>(undefined)

const RECAPTCHA_SITE_KEY = '6LeX-vgpAAAAAP6do9qsGjgEOVefIAmRq1HMDUGl'

// Chargement unique du script, partagé par le préchargement (interaction) et l'exécution (soumission)
let scriptPromise: Promise<void> | null = null

function loadRecaptchaScript(): Promise<void> {
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise<void>((resolve, reject) => {
    const whenReady = () => window.grecaptcha.ready(() => resolve())

    if (window.grecaptcha) {
      whenReady()
      return
    }

    let script = document.querySelector<HTMLScriptElement>('script[src*="recaptcha/api.js"]')
    if (!script) {
      script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    script.addEventListener('load', () => {
      if (window.grecaptcha) whenReady()
      else reject(new Error('reCAPTCHA script loaded but grecaptcha not available'))
    })
    script.addEventListener('error', () => reject(new Error('Failed to load reCAPTCHA script')))
  }).catch((error) => {
    scriptPromise = null // nouvel essai possible à la prochaine interaction
    throw error
  })

  return scriptPromise
}

/*
 * Les enfants sont rendus tels quels, avant comme après le chargement : envelopper l'arbre
 * dans un provider une fois reCAPTCHA chargé remontait toute la page (saisies perdues au premier
 * focus d'un formulaire, écran de résultat réinitialisé à l'envoi).
 */
export function RecaptchaProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)

  const loadRecaptcha = useCallback(async () => {
    try {
      await loadRecaptchaScript()
      setIsLoaded(true)
    } catch (error) {
      console.error('Erreur lors du chargement de reCAPTCHA:', error)
    }
  }, [])

  const executeRecaptcha = useCallback(async (action: string): Promise<string | null> => {
    try {
      await loadRecaptchaScript()
      setIsLoaded(true)
      return await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action })
    } catch (error) {
      console.error('Erreur lors de l\'exécution de reCAPTCHA:', error)
      return null
    }
  }, [])

  return (
    <RecaptchaContext.Provider value={{ isLoaded, loadRecaptcha, executeRecaptcha }}>
      {children}
    </RecaptchaContext.Provider>
  )
}

export function useRecaptchaContext() {
  const context = useContext(RecaptchaContext)
  if (context === undefined) {
    throw new Error('useRecaptchaContext must be used within a RecaptchaProvider')
  }
  return context
}
