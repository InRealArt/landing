import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Rejoignez-nous en tant que Galerie - InRealArt',
  description: 'Galeries d\'art, partenaires avec InRealArt pour moderniser votre offre. Tokenisation, vente en ligne et nouveaux marchés vous attendent.',
  keywords: ['galerie InRealArt', 'partenaire galerie', 'art tokenisé', 'vente en ligne', 'modernisation galerie', 'nouveaux marchés'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/joinInRealArt/galleries`,
  alternateLanguages: {
    'fr': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/fr/joinInRealArt/galleries`,
    'en': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/en/joinInRealArt/galleries`
  }
})

export default function JoinInRealArtGalleriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 