'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

interface GoogleTagProps {
  GTM_ID: string
}

export default function GoogleTag({ GTM_ID }: GoogleTagProps) {
  const [consent, setConsent] = useState<string | null>(null)

  // Définir la valeur du consentement depuis localStorage après le chargement du client
  // En supposant que la réponse est stockée dans localStorage sous 'InRealArtCookieConsent'
  useEffect(() => {
    const cookieConsent = localStorage.getItem('InRealArtCookieConsent')
    const cookiePreferences = localStorage.getItem('InRealArtCookiePreferences')
    
    if (cookieConsent === 'true' && cookiePreferences) {
      try {
        const preferences = JSON.parse(cookiePreferences)
        // Si les cookies analytics sont acceptés, on accorde le consentement
        setConsent(preferences.analytics ? 'granted' : 'denied')
      } catch (error) {
        console.error('Erreur parsing cookiePreferences:', error)
        setConsent('denied')
      }
    } else {
      setConsent('denied')
    }
  }, [GTM_ID])

  // Ne pas rendre le composant tant que le consentement n'est pas défini
  if (consent === null) return null

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`}
      />
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Configuration globale des cookies pour GTM
            const isLocalhost = window.location.hostname === 'localhost';
            gtag('set', {
              'cookie_domain': isLocalhost ? 'none' : 'auto',
              'cookie_flags': isLocalhost ? '' : 'SameSite=Lax;Secure',
              'cookie_path': '/',
              'cookie_update': true
            });
            
            // Définir le consentement par défaut selon l'article Medium
            gtag('consent', 'default', {
              'ad_storage': '${consent}',
              'ad_user_data': '${consent}',
              'ad_personalization': '${consent}',
              'analytics_storage': '${consent}',
              'functionality_storage': '${consent}',
              'personalization_storage': '${consent}',
              'security_storage': 'granted'
            });
            
            // Configuration GTM
            gtag('config', '${GTM_ID}', {
              page_path: window.location.pathname,
            });
            
            console.log('🏷️ GTM initialisé avec consentement:', '${consent}');
          `,
        }}
      />
    </>
  )
}
