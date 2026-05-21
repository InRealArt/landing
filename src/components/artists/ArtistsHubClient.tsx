'use client'

import { ArtistData } from '@/actions/artistActions'
import ArtistsHero from './ArtistsHero'
import ArtistsGrid from './ArtistsGrid'

interface Props {
  initialArtists: ArtistData[]
}

export default function ArtistsHubClient({ initialArtists }: Props) {
  return (
    <>
      <ArtistsHero />
      <ArtistsGrid initialArtists={initialArtists} />
    </>
  )
}
