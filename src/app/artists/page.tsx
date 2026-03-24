import { Metadata } from 'next'
import { Suspense } from 'react'
import { generateStaticMetadata } from '@/utils/metadata'
import { getArtists } from '@/actions/artistActions'
import ArtistsHero from '@/components/artists/ArtistsHero'
import ArtistsGrid, { ArtistsGridSkeleton } from '@/components/artists/ArtistsGrid'
import ArtistsAnimations from '@/components/artists/ArtistsAnimations'

export const revalidate = 1800

export const metadata: Metadata = generateStaticMetadata({
  title: 'Artistes InRealArt — Créateurs sélectionnés, histoires singulières',
  description: "Rencontrez les artistes représentés par In Real Art : peintres, sculpteurs, graveurs. Découvrez leurs univers à travers notre accompagnement éditorial.",
  keywords: ['artistes contemporains', 'peinture', 'sculpture', 'art francophone', 'portrait d\'artiste'],
  canonical: 'https://inrealart.com/artists',
})

export default async function ArtistsPage() {
  const artists = await getArtists(false)

  return (
    <>
      <ArtistsAnimations />
      <ArtistsHero />
      <Suspense fallback={<ArtistsGridSkeleton />}>
        <ArtistsGrid initialArtists={artists} />
      </Suspense>
    </>
  )
}
