'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Slider from './Slider'
import { useArtistStore } from '@/store/useArtistStore'
import { useRouter } from 'next/navigation'

// Composant Skeleton pour l'état de chargement
function ArtistSkeleton() {
  return (
    <section className="mt-12">
      <div className="flex gap-4 overflow-hidden justify-center">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="p-2 border rounded-lg bg-cardBackground min-w-[280px] md:min-w-[320px] flex-shrink-0">
            <div className="bg-gray-300 animate-pulse h-52 md:h-80 w-full rounded-lg mb-4"></div>
            <div className="h-5 bg-gray-300 animate-pulse rounded-md w-3/4 mb-2"></div>
          </div>
        ))}
      </div>
    </section>
  )
}

function ArtistSlider() {
  const { artists, isLoading, hasError, fetchArtists } = useArtistStore()
  const router = useRouter()

  useEffect(() => {
    fetchArtists()
  }, [fetchArtists])

  // Adapter les données pour les rendre compatibles avec le composant Slider
  const formattedArtistImages = artists.map(artist => ({
    id: artist.id,
    name: artist.name,
    description: artist.description,
    slug: artist.slug,
    image: {
      src: artist.photo
    }
  }))

  const handleArtistClick = (slug: string) => {
    router.push(`/artists/${slug}`)
  }

  if (isLoading) {
    return <ArtistSkeleton />
  }

  if (hasError) {
    return <div className="flex justify-center items-center p-8">Erreur lors du chargement des artistes</div>
  }

  // Utiliser une image par défaut si aucune image n'est disponible
  if (formattedArtistImages.length === 0) {
    return <div className="flex justify-center items-center p-8">Aucun artiste disponible</div>
  }

  return <Slider context="artist" items={formattedArtistImages} onItemClick={handleArtistClick} />
}

export default ArtistSlider 