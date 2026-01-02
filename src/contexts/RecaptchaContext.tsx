'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

// Types pour grecaptcha (déjà déclarés dans src/lib/recaptcha.ts)

interface RecaptchaContextType {
  isLoaded: boolean
  loadRecaptcha: () => Promise<void>
  executeRecaptcha: (action: string) => Promise<string | null>
}

const RecaptchaContext = createContext<RecaptchaContextType | undefined>(undefined)

const RECAPTCHA_SITE_KEY = '6LeX-vgpAAAAAP6do9qsGjgEOVefIAmRq1HMDUGl'

export function RecaptchaProvider({ children }: { children: ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [providerKey, setProviderKey] = useState(0)

  const loadRecaptcha = useCallback(async () => {
    // Si déjà chargé, ne rien faire
    if (isLoaded || isLoading) return

    // Si le script est déjà présent dans le DOM, on considère qu'il est chargé
    if (typeof window !== 'undefined' && window.grecaptcha) {
      setIsLoaded(true)
      return
    }

    setIsLoading(true)

    try {
      // Vérifier si le script est déjà présent
      if (document.querySelector('script[src*="recaptcha/api.js"]')) {
        // Attendre que grecaptcha soit disponible
        await new Promise<void>((resolve) => {
          const checkInterval = setInterval(() => {
            if (typeof window !== 'undefined' && window.grecaptcha) {
              clearInterval(checkInterval)
              setIsLoaded(true)
              setIsLoading(false)
              resolve()
            }
          }, 100)

          // Timeout après 5 secondes
          setTimeout(() => {
            clearInterval(checkInterval)
            setIsLoading(false)
          }, 5000)
        })
        return
      }

      // Charger le script dynamiquement
      const script = document.createElement('script')
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`
      script.async = true
      script.defer = true

      await new Promise<void>((resolve, reject) => {
        script.onload = () => {
          // Attendre que grecaptcha soit disponible
          if (typeof window !== 'undefined' && window.grecaptcha) {
            window.grecaptcha.ready(() => {
              setIsLoaded(true)
              setIsLoading(false)
              setProviderKey(prev => prev + 1) // Force le re-render du provider
              resolve()
            })
          } else {
            setIsLoading(false)
            reject(new Error('reCAPTCHA script loaded but grecaptcha not available'))
          }
        }
        script.onerror = () => {
          setIsLoading(false)
          reject(new Error('Failed to load reCAPTCHA script'))
        }
        document.head.appendChild(script)
      })
    } catch (error) {
      console.error('Erreur lors du chargement de reCAPTCHA:', error)
      setIsLoading(false)
    }
  }, [isLoaded, isLoading])

  const executeRecaptcha = useCallback(async (action: string): Promise<string | null> => {
    // Charger reCAPTCHA si pas encore chargé
    if (!isLoaded) {
      await loadRecaptcha()
    }

    // Attendre que grecaptcha soit disponible
    if (typeof window === 'undefined' || !window.grecaptcha) {
      console.error('reCAPTCHA non disponible')
      return null
    }

    try {
      return await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action })
    } catch (error) {
      console.error('Erreur lors de l\'exécution de reCAPTCHA:', error)
      return null
    }
  }, [isLoaded, loadRecaptcha])

  return (
    <RecaptchaContext.Provider value={{ isLoaded, loadRecaptcha, executeRecaptcha }}>
      {isLoaded ? (
        <GoogleReCaptchaProvider
          key={providerKey}
          reCaptchaKey={RECAPTCHA_SITE_KEY}
          scriptProps={{
            async: true,
            defer: true,
            appendTo: 'head',
          }}
          container={{
            parameters: {
              badge: 'bottomright',
            }
          }}
          language="fr"
          useRecaptchaNet={false}
          useEnterprise={false}
        >
          {children}
        </GoogleReCaptchaProvider>
      ) : (
        children
      )}
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

