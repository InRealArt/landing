import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import LanguageProvider from '@/components/providers/LanguageProvider'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Toaster from '@/components/common/Toaster'
import GoogleTag from '@/components/common/GoogleTag'
import GoogleCaptchaWrapper from '@/components/captcha/googleCaptchaWrapper'
import CookieConsentBanner from '@/components/common/CookieConsent'
import NewsletterManager from '@/components/common/NewsletterManager'
import UmamiAnalytics from '@/components/common/UmamiAnalytics'
import ogImage from './opengraph-image.png'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Suspense } from 'react'
// Import pour exposer debugGTM globalement
import '@/utils/analyticsDebug'


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
        <GoogleTag GTM_ID={process.env.NEXT_PUBLIC_GTM_ID || "GTM-NBR8FBBP"} />
        <UmamiAnalytics websiteId="d103585b-b4cd-4953-b780-30a3c4dec14f" />

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
