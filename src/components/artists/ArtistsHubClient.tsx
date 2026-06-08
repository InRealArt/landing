'use client'

import { ArtistData } from '@/actions/artistActions'
import { ArtistArtworkPreview } from '@/actions/presaleArtworkActions'
import ArtistsHero from './ArtistsHero'
import ArtistsGrid from './ArtistsGrid'
import ArtistsCEOWord from './ArtistsCEOWord'

interface Props {
  initialArtists: ArtistData[]
  artworkPreviews: ArtistArtworkPreview[]
}

export default function ArtistsHubClient({ initialArtists, artworkPreviews }: Props) {
  return (
    <>
      <ArtistsHero />
      <ArtistsGrid initialArtists={initialArtists} artworkPreviews={artworkPreviews} />
      <ArtistsCEOWord />
    </>
  )
}
