import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Rejoignez-nous en tant qu\'Artiste - InRealArt',
  description: 'Un Monde d’Opportunités pour Vous et Votre Art',
  keywords: ['artiste InRealArt', 'tokeniser œuvres', 'vendre art', 'plateforme artistes', 'art numérique', 'blockchain art'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/joinInRealArt/artists`
})

export default function JoinInRealArtArtistsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 