'use client'

import { useEffect } from 'react'
import Slider from './Slider'
import { useArtworksStore } from '@/store/useArtworksStore'

// Composant Skeleton pour l'état de chargement
function ArtworkSkeleton() {
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

function ArtworkSlider() {
  const { artworks, isLoading, hasError, fetchArtworks } = useArtworksStore()

  useEffect(() => {
    fetchArtworks()
  }, [fetchArtworks])

  // Sélectionner aléatoirement 20 artworks maximum
  const randomArtworks = artworks.length > 20 
    ? [...artworks].sort(() => 0.5 - Math.random()).slice(0, 20)
    : artworks

  // Adapter les données pour les rendre compatibles avec le composant Slider
  const formattedArtworkImages = randomArtworks.map(artwork => ({
    id: artwork.id,
    name: typeof artwork.name === 'string' 
      ? artwork.name 
      : (artwork.name && artwork.name.FR) || (artwork.name && Object.values(artwork.name)[0]) || 'Sans titre',
    image: {
      src: artwork.url
    }
  }))

  if (isLoading) {
    return <ArtworkSkeleton />
  }

  if (hasError) {
    return <div className="flex justify-center items-center p-8">Erreur lors du chargement des œuvres</div>
  }

  // Utiliser une image par défaut si aucune image n'est disponible
  if (formattedArtworkImages.length === 0) {
    return <div className="flex justify-center items-center p-8">Aucune œuvre disponible</div>
  }

  return <Slider context="artwork" items={formattedArtworkImages} isReverse />
}

export default ArtworkSlider 