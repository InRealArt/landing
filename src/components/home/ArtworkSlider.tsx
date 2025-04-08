'use client'

import { useEffect } from 'react'
import Slider from './Slider'
import { useArtworksStore } from '@/store/useArtworksStore'

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

  console.log("formattedArtworkImages : ", formattedArtworkImages)

  if (isLoading) {
    return <div className="flex justify-center items-center p-8">Chargement des œuvres...</div>
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