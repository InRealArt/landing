import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rejoignez-nous en tant que Galerie',
  description: 'Galeries d\'art, partenaires avec InRealArt pour moderniser votre offre. Conseil en défiscalisation, Conseil en gestion de patrimoinevente en ligne et nouveaux marchés vous attendent.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inrealart.com'}/joinInRealArt/galleries`
  },
  openGraph: {
    title: 'Rejoignez-nous en tant que Galerie - InRealArt',
    description: 'Galeries d\'art, partenaires avec InRealArt pour moderniser votre offre. Conseil en défiscalisation, Conseil en gestion de patrimoine, vente en ligne et nouveaux marchés vous attendent.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inrealart.com'}/joinInRealArt/galleries`,
    siteName: 'InRealArt',
    images: [
      {
        url: '/opengraph-image',
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
    description: 'Galeries d\'art, partenaires avec InRealArt pour moderniser votre offre. Conseil en défiscalisation, Conseil en gestion de patrimoine, vente en ligne et nouveaux marchés vous attendent.',
    images: ['/opengraph-image']
  }
}

export default function JoinInRealArtGalleriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 