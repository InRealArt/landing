import { Suspense } from 'react'
import { getArtists } from '@/actions/artistActions'
import ArtistSliderSkeleton from './ArtistSliderSkeleton'
import ArtistSliderClientWrapper from './ArtistSliderClientWrapper'

interface ArtistSliderProps {
  isGallery?: boolean
}

async function ArtistSliderContent({ isGallery }: ArtistSliderProps) {
  // Fetch des données directement depuis la base de données côté serveur
  const artists = await getArtists(isGallery)

  return <ArtistSliderClientWrapper artists={artists} />
}

export default function ArtistSlider({ isGallery }: ArtistSliderProps) {
  return (
    <Suspense fallback={<ArtistSliderSkeleton />}>
      <ArtistSliderContent isGallery={isGallery} />
    </Suspense>
  )
}

