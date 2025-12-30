'use client'

import { useRouter } from 'next/navigation'
import Slider from './Slider'
import { ArtistData } from '@/actions/artistActions'

interface ArtistSliderClientProps {
  artists: ArtistData[]
}

export default function ArtistSliderClient({ artists }: ArtistSliderClientProps) {
  const router = useRouter()

  // Adapter les données pour les rendre compatibles avec le composant Slider
  const formattedArtistImages = artists.map(artist => ({
    id: artist.id,
    name: `${artist.name} ${artist.surname}`.trim(),
    description: artist.description || '',
    slug: artist.slug,
    image: {
      src: artist.imageUrl
    }
  }))

  const handleArtistClick = (slug: string) => {
    router.push(`/artists/${slug}`)
  }

  // Si aucun artiste n'est disponible
  if (formattedArtistImages.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        Aucun artiste disponible
      </div>
    )
  }

  return (
    <Slider 
      context="artist" 
      items={formattedArtistImages} 
      onItemClick={handleArtistClick} 
    />
  )
}

