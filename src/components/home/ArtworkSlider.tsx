import { Suspense } from 'react'
import { getPresaleArtworks } from '@/actions/presaleArtworkActions'
import ArtworkSliderSkeleton from './ArtworkSliderSkeleton'
import ArtworkSliderClientWrapper from './ArtworkSliderClientWrapper'

async function ArtworkSliderContent() {
  const artworks = await getPresaleArtworks()

  // Sélectionner aléatoirement 20 artworks maximum côté serveur
  const randomArtworks = artworks.length > 20
    ? [...artworks].sort(() => 0.5 - Math.random()).slice(0, 20)
    : artworks

  const formattedArtworks = randomArtworks.map(artwork => ({
    id: artwork.id,
    // name is always a string from the DB; translations.name holds other-language overrides
    name: artwork.name || 'Sans titre',
    image: {
      src: artwork.imageUrl
    }
  }))

  return <ArtworkSliderClientWrapper artworks={formattedArtworks} />
}

export default function ArtworkSlider() {
  return (
    <Suspense fallback={<ArtworkSliderSkeleton />}>
      <ArtworkSliderContent />
    </Suspense>
  )
}
