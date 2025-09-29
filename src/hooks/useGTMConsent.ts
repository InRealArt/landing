'use client'

import { useEffect, useRef } from 'react'

interface CookiePreferences {
    necessary: boolean
    analytics: boolean
    marketing: boolean
    functionality: boolean
}

declare global {
    interface Window {
        gtag: (...args: any[]) => void
        dataLayer: any[]
    }
}

export function useGTMConsent(preferences: CookiePreferences | null) {
    const isFirstRender = useRef(true)

    useEffect(() => {
        // Ignorer le premier rendu pour éviter les mises à jour inutiles
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        // Vérifier que nous avons des préférences et que nous sommes côté client
        if (typeof window !== 'undefined' && preferences) {
            console.log('🔄 Mise à jour du consentement GTM:', preferences)

            // Utiliser dataLayer directement car gtag pourrait ne pas être immédiatement disponible
            window.dataLayer = window.dataLayer || []

            function gtag(...args: any[]) {
                window.dataLayer.push(args)
            }

            // Mettre à jour le consentement
            gtag('consent', 'update', {
                ad_storage: preferences.marketing ? 'granted' : 'denied',
                ad_user_data: preferences.marketing ? 'granted' : 'denied',
                ad_personalization: preferences.marketing ? 'granted' : 'denied',
                analytics_storage: preferences.analytics ? 'granted' : 'denied',
                functionality_storage: preferences.functionality ? 'granted' : 'denied',
                personalization_storage: preferences.functionality ? 'granted' : 'denied'
            })

            // Envoyer un événement de confirmation si analytics est activé
            if (preferences.analytics) {
                gtag('event', 'consent_update', {
                    event_category: 'engagement',
                    event_label: 'consent_granted'
                })
            }
        }
    }, [preferences])
}

export default useGTMConsent
