import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Rejoignez-nous en tant qu\'Artiste - InRealArt',
  description: 'Artistes, rejoignez InRealArt pour tokeniser et vendre vos œuvres. Bénéficiez de notre plateforme innovante et de notre réseau mondial.',
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