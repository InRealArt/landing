import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Rejoignez InRealArt - Partenaires et Collaborateurs',
  description: 'Rejoignez l\'écosystème InRealArt en tant qu\'artiste, galerie ou partenaire. Découvrez les opportunités de collaboration et de croissance.',
  keywords: ['rejoindre InRealArt', 'partenaires', 'collaboration', 'artistes', 'galeries', 'opportunités'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/joinInRealArt`,
  alternateLanguages: {
    'fr': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/fr/joinInRealArt`,
    'en': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/en/joinInRealArt`
  }
})

export default function JoinInRealArtLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 