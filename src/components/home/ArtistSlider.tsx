'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Slider from './Slider'
import { useArtistStore } from '@/store/useArtistStore'
import { useRouter } from 'next/navigation'

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
    return <div className="flex justify-center items-center p-8">Chargement des artistes...</div>
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