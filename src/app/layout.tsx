import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/common/Header'
import Footer from '@/components/common/Footer'
import LanguageProvider from '@/components/providers/LanguageProvider'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Toaster from '@/components/common/Toaster'
import GoogleTag from '@/components/common/GoogleTag'
import { RecaptchaProvider } from '@/contexts/RecaptchaContext'
import CookieConsentBanner from '@/components/common/CookieConsent'
import NewsletterManager from '@/components/common/NewsletterManager'
import StickyFooterManager from '@/components/common/StickyFooterManager'
import UmamiAnalytics from '@/components/common/UmamiAnalytics'
import ogImage from './opengraph-image.png'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Suspense } from 'react'
// Import pour exposer debugGTM globalement (dev uniquement)
if (process.env.NODE_ENV === 'development') {
  import('@/utils/analyticsDebug')
}
// Import des fonts optimisées
import { unbounded, bricolageGrotesque } from '@/config/fonts'


export const metadata: Metadata = {
  metadataBase: new URL("https://inrealart.com/"),
  title: {
    default: "InRealArt — Catalyseur d'Art, de la Culture et du Patrimoine",
    template: "%s | InRealArt",
  },
  description: "La plateforme curatoriale qui rend l'art, la culture et le patrimoine accessible, humain et éthique. Pour artistes, collectionneurs et mécènes.",
  icons: {
    icon: '/icons/favicon-32x32.png',
    shortcut: '/icons/favicon-16x16.png',
    apple: '/icons/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://inrealart.com/',
    languages: {
      'x-default': 'https://inrealart.com/',
      'fr': 'https://inrealart.com/',
    },
  },
  openGraph: {
    title: "InRealArt — Catalyseur d'Art, de la Culture et du Patrimoine",
    description: "La plateforme curatoriale qui rend l'art, la culture et le patrimoine accessible, humain et éthique.",
    url: 'https://inrealart.com/',
    siteName: 'InRealArt',
    locale: 'fr_FR',
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height,
        alt: "InRealArt — Catalyseur d'Art",
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@inrealart',
    title: "InRealArt — Catalyseur d'Art, de la Culture et du Patrimoine",
    description: "La plateforme curatoriale qui rend l'art, la culture et le patrimoine accessible, humain et éthique.",
    images: [
      {
        url: ogImage.src,
        width: ogImage.width,
        height: ogImage.height,
        alt: "InRealArt — Catalyseur d'Art",
      },
    ],
  },
};

export default function RootLayout ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${unbounded.variable} ${bricolageGrotesque.variable}`} suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/home/hero/bg.webp"
          type="image/webp"
        />
        {/* LLM & Agent indexing */}
        <link rel="llms" href="/llms.txt" type="text/plain" />
        <link rel="llms-full" href="/llms-full.txt" type="text/plain" />
        <meta name="capabilities" content="/capabilities.txt" />
        <meta name="agents" content="/agents.txt" />
        {/* ✅ OPTIMISÉ: Script inline au lieu de fichier externe
            Évite une requête HTTP et s'exécute immédiatement (bloquant mais nécessaire pour éviter FOUC) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const theme = savedTheme === 'dark' ? 'dark' : 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                  const savedLang = localStorage.getItem('language') || 'fr';
                  document.documentElement.setAttribute('lang', savedLang);
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`antialiased ${bricolageGrotesque.className}`}
      >
        <GoogleTag GTM_ID={process.env.NEXT_PUBLIC_GTM_ID || "GTM-NBR8FBBP"} />
        <UmamiAnalytics websiteId="d103585b-b4cd-4953-b780-30a3c4dec14f" />

        <Suspense>
          <NuqsAdapter>
            <ThemeProvider>
              <LanguageProvider>
                <RecaptchaProvider>
                    <Header />
                    {children}
                    {/* <FAQ /> */}
                    <Footer />
                    <Toaster />
                    <CookieConsentBanner />
                    <NewsletterManager delayInSeconds={5} />
                    {/* <StickyFooterDebug /> */}
                    <StickyFooterManager />
                    {/* Uncomment this when we have a way to test the global navigation (previouspage visited)*/}
                    {/* <GlobalNavigationTest /> */}
                </RecaptchaProvider>
              </LanguageProvider>
            </ThemeProvider>
          </NuqsAdapter>
        </Suspense>
      </body> 
    </html>
  );
}
