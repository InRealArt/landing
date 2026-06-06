import { Metadata } from 'next'
import { Suspense } from 'react'
import { generateStaticMetadata } from '@/utils/metadata'
import { getArtists } from '@/actions/artistActions'
import { getArtworkPreviewsByArtistIds } from '@/actions/presaleArtworkActions'
import ArtistsHubClient from '@/components/artists/ArtistsHubClient'
import { ArtistsGridSkeleton } from '@/components/artists/ArtistsGrid'
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
  const artistIds = artists.map(a => a.artistId)
  const artworkPreviews = await getArtworkPreviewsByArtistIds(artistIds)

  return (
    <>
      <ArtistsAnimations />
      <Suspense fallback={<ArtistsGridSkeleton />}>
        <ArtistsHubClient initialArtists={artists} artworkPreviews={artworkPreviews} />
      </Suspense>
    </>
  )
}
