import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rejoignez-nous en tant que Galerie - InRealArt',
  description: 'Galeries d\'art, partenaires avec InRealArt pour moderniser votre offre. Tokenisation, vente en ligne et nouveaux marchés vous attendent.',
  keywords: 'galerie InRealArt, partenaire galerie, art tokenisé, vente en ligne, modernisation galerie, nouveaux marchés',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/joinInRealArt/galleries`
  },
  openGraph: {
    title: 'Rejoignez-nous en tant que Galerie - InRealArt',
    description: 'Galeries d\'art, partenaires avec InRealArt pour moderniser votre offre. Tokenisation, vente en ligne et nouveaux marchés vous attendent.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/joinInRealArt/galleries`,
    siteName: 'InRealArt',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'InRealArt - Rejoignez-nous en tant que Galerie'
      }
    ],
    locale: 'fr_FR',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rejoignez-nous en tant que Galerie - InRealArt',
    description: 'Galeries d\'art, partenaires avec InRealArt pour moderniser votre offre. Tokenisation, vente en ligne et nouveaux marchés vous attendent.',
    images: ['/opengraph-image.png']
  }
}

export default function JoinInRealArtGalleriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 