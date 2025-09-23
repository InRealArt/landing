import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import LanguageProvider from '@/components/providers/LanguageProvider'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Toaster from '@/components/common/Toaster'
import { GoogleTagManager } from '@next/third-parties/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import GoogleCaptchaWrapper from '@/components/captcha/googleCaptchaWrapper'
import CookieConsentBanner from '@/components/common/CookieConsent'
import NewsletterManager from '@/components/common/NewsletterManager'
import ogImage from './opengraph-image.png'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Suspense } from 'react'


export const metadata: Metadata = {
  title: "In Real Art",
  description: "Landing page In Real Art, RWA: Elevating Art, Empowering Change",
  icons: {
    icon: '/icons/favicon-32x32.png',
    shortcut: '/icons/favicon-16x16.png',
    apple: '/icons/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://inrealart.com/"),
  openGraph: {
    title: 'In Real Art',
    description: 'RWA: Elevating Art, Empowering Change',
    url: 'https://inrealart.com/',
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height
      },
    ],
    type: 'website',
  },
  twitter: {
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height
      },
    ]
  },
};

export default function RootLayout ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <head>
        <script src="/theme-init.js" async />
      </head>
      <body
        className={'antialiased'}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize Google Consent Mode v2 - Default denied state
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              
              // Set default consent to 'denied' (GDPR compliant)
              gtag('consent', 'default', {
                'ad_storage': 'denied',
                'ad_user_data': 'denied',
                'ad_personalization': 'denied',
                'analytics_storage': 'denied',
                'functionality_storage': 'denied',
                'personalization_storage': 'denied',
                'security_storage': 'granted'
              });
            `
          }}
        />
        <noscript>
          <iframe src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID || "GTM-NBR8FBBP"}`}
            height="0" width="0" style={{display: "none", visibility: "hidden"}}>
          </iframe>
        </noscript>

        <Suspense>
          <NuqsAdapter>
            <ThemeProvider>
              <LanguageProvider>
                <GoogleCaptchaWrapper>
                    <Header />
                    {children}
                    {/* <FAQ /> */}
                    <Footer />
                    <Toaster />
                    <CookieConsentBanner />
                    <NewsletterManager delayInSeconds={5} />
                    {/* Uncomment this when we have a way to test the global navigation (previouspage visited)*/}
                    {/* <GlobalNavigationTest /> */}
                </GoogleCaptchaWrapper>
              </LanguageProvider>
            </ThemeProvider>
          </NuqsAdapter>
        </Suspense>
      </body> 
    </html>
  );
}
