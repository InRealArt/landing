import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'
import ArtistsStudioPage from '@/components/artists-studio/ArtistsStudioPage'

export const metadata: Metadata = generateStaticMetadata({
  title: "Index des Ateliers — Artistes InRealArt",
  description: "Explorez la carte interactive des ateliers d'artistes InRealArt. Rencontrez nos créateurs résidents, découvrez leurs espaces de création à travers la France.",
  keywords: ['ateliers artistes', 'art contemporain', 'carte artistes france', 'réseau art', 'InRealArt'],
  canonical: 'https://inrealart.com/artists-studio',
})

export default function Page() {
  return <ArtistsStudioPage />
}
