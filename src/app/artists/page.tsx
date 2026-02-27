import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'
import ArtistsPageClient from './ArtistsPageClient'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Artistes InRealArt — Créateurs sélectionnés, histoires singulières',
  description: "Rencontrez les artistes représentés par In Real Art : peintres, sculpteurs, graveurs. Découvrez leurs univers à travers notre accompagnement éditorial.",
  keywords: ['artistes contemporains', 'peinture', 'sculpture', 'art francophone', 'portrait d\'artiste'],
  canonical: 'https://inrealart.com/artists',
})

export default function ArtistsPage() {
  return <ArtistsPageClient />
}
