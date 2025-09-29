'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'

interface GoogleTagProps {
  GTM_ID: string
}

export default function GoogleTag({ GTM_ID }: GoogleTagProps) {
  const [consent, setConsent] = useState<string | null>(null)

  // Set the consent value from localStorage after the client loads
  // Avoiding potential errors caused by server-side rendering (selon l'article Medium)
  useEffect(() => {
    const cookieConsent = localStorage.getItem('InRealArtCookieConsent')
    const cookiePreferences = localStorage.getItem('InRealArtCookiePreferences')
    
    if (cookieConsent === 'true' && cookiePreferences) {
      try {
        const preferences = JSON.parse(cookiePreferences)
        setConsent(preferences.analytics ? 'granted' : 'denied')
      } catch (error) {
        console.error('Erreur parsing cookiePreferences:', error)
        setConsent('denied')
      }
    } else {
      setConsent('denied')
    }
  }, [GTM_ID])

  // The key principle from Medium article: don't render until client-side consent is determined
  if (consent === null) return null

  return (
    <>
      {/* Pattern de l'article Medium: un seul script afterInteractive avec consent intégré */}
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // GTM integration selon l'article Medium (adapté pour GTM au lieu de GA4)
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Consent Mode v2 setup (selon l'article Medium)
            gtag('consent', 'default', {
              'ad_storage': '${consent}',
              'ad_user_data': '${consent}',
              'ad_personalization': '${consent}',
              'analytics_storage': '${consent}',
              'functionality_storage': '${consent}',
              'personalization_storage': '${consent}',
              'security_storage': 'granted'
            });
            
            // GTM initialization (différent de GA4 dans l'article original)
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
            
            console.log('🏷️ GTM initialisé avec consentement:', '${consent}');
          `,
        }}
      />
      
      {/* GTM NoScript fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  )
}
