'use client'

import { ArtistData, CurrentlyExposedArtist } from '@/actions/artistActions'
import { ArtistArtworkPreview } from '@/actions/presaleArtworkActions'
import ArtistsHero from './ArtistsHero'
import ArtistsGrid from './ArtistsGrid'
import ArtistsCEOWord from './ArtistsCEOWord'
import ArtistsCurrentlyExposed from './ArtistsCurrentlyExposed'

interface Props {
  initialArtists: ArtistData[]
  artworkPreviews: ArtistArtworkPreview[]
  currentlyExposedArtists: CurrentlyExposedArtist[]
}

export default function ArtistsHubClient({ initialArtists, artworkPreviews, currentlyExposedArtists }: Props) {
  return (
    <>
      <ArtistsHero />
      <ArtistsGrid initialArtists={initialArtists} artworkPreviews={artworkPreviews} />
      <ArtistsCEOWord />
      <ArtistsCurrentlyExposed artists={currentlyExposedArtists} />
    </>
  )
}
