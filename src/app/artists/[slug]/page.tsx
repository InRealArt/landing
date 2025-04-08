'use client'
import { useEffect, useState } from 'react'
import ArtistProfile from '@/components/artists/ArtistProfile'
import ArtistArtworks from '@/components/artists/ArtistArtworks'
import ExpertSection from '@/components/artists/ExpertSection'
import { useArtistStore } from '@/store/useArtistStore'
import { useParams } from 'next/navigation'
import { useLanguageStore } from '@/store/languageStore'

export default function ArtistPage() {
  const params = useParams()
  const slug = params.slug as string
  const { fetchArtists, isLoading, hasError, artists, getArtistBySlug } = useArtistStore()
  const [artist, setArtist] = useState<any>(null)
  const { t, language } = useLanguageStore()

  useEffect(() => {
    const loadArtist = async () => {
      await fetchArtists()
      const foundArtist = getArtistBySlug(slug)
      setArtist(foundArtist)
    }
    
    loadArtist()
  }, [fetchArtists, getArtistBySlug, slug])

  // Watch for language changes to update the artist
  useEffect(() => {
    if (artists.length > 0) {
      const foundArtist = getArtistBySlug(slug)
      setArtist(foundArtist)
    }
  }, [language, artists, getArtistBySlug, slug])

  // Ensure artworkImages is an array before using map
  const processedArtworks = (() => {
    if (!artist || !artist.artworkImages) return []
    
    // Handle the case where artworkImages is a JSON string
    let artworkImagesArray = artist.artworkImages
    
    if (typeof artworkImagesArray === 'string') {
      try {
        artworkImagesArray = JSON.parse(artworkImagesArray)
      } catch (e) {
        console.error('Error parsing artworkImages:', e)
        return []
      }
    }
    
    // Check if it's an array now
    if (!Array.isArray(artworkImagesArray)) {
      // If it's still not an array, try to convert it to an array
      artworkImagesArray = artworkImagesArray ? [artworkImagesArray] : []
    }
    
    // Now we can safely use map
    return artworkImagesArray.map((artwork: any) => ({
      id: artwork.id,
      name: artwork.name || 'Untitled',
      price: artwork.price || 0,
      image: { src: artwork.image || artwork.url || '' }
    }))
  })()

  if (isLoading) {
    return <div className="mt-headerSize text-center">{t('common.loading')}</div>
  }

  if (hasError || !artist) {
    return <div className="mt-headerSize text-center">{t('artistPage.notFound')}</div>
  }
  
  console.log(processedArtworks);
  
  return (
    <>
      <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-headerSize">
        <ArtistProfile artist={artist} />
        <ArtistArtworks artistName={artist.name} artworks={processedArtworks} />
        <ExpertSection />
      </section>
    </>
  )
} 