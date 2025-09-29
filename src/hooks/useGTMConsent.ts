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

        // Vérifier que GTM est chargé et que nous avons des préférences
        if (typeof window !== 'undefined' && window.gtag && preferences) {
            console.log('🔄 Mise à jour du consentement GTM:', preferences)

            // Mettre à jour le consentement selon l'article Medium
            window.gtag('consent', 'update', {
                ad_storage: preferences.marketing ? 'granted' : 'denied',
                ad_user_data: preferences.marketing ? 'granted' : 'denied',
                ad_personalization: preferences.marketing ? 'granted' : 'denied',
                analytics_storage: preferences.analytics ? 'granted' : 'denied',
                functionality_storage: preferences.functionality ? 'granted' : 'denied',
                personalization_storage: preferences.functionality ? 'granted' : 'denied'
            })

            // Envoyer un événement de confirmation si analytics est activé
            if (preferences.analytics) {
                window.gtag('event', 'consent_update', {
                    event_category: 'engagement',
                    event_label: 'consent_granted'
                })
            }
        }
    }, [preferences])
}

export default useGTMConsent
