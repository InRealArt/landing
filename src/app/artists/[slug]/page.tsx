'use client'
import { useEffect, useState } from 'react'
import ArtistProfile from '@/components/artists/ArtistProfile'
import ArtistArtworks from '@/components/artists/ArtistArtworks'
import ExpertSection from '@/components/artists/ExpertSection'
import { useArtistStore, ArtistData } from '@/store/useArtistStore'
import { useParams } from 'next/navigation'
import { useLanguageStore } from '@/store/languageStore'
import { useArtworksStore } from '@/store/useArtworksStore'
import { ArtWork, Lang } from '@/types/types'

export default function ArtistPage() {
  const params = useParams()
  const slug = params.slug as string
  const { fetchArtists, isLoading, hasError, artists, getArtistBySlug } = useArtistStore()
  const { getArtworksByArtistId } = useArtworksStore()
  const [artist, setArtist] = useState<ArtistData | undefined>(undefined)
  const [artistArtworks, setArtistArtworks] = useState<ArtWork[]>([])
  const [isLoadingArtworks, setIsLoadingArtworks] = useState(true)
  const { t, language } = useLanguageStore()

  useEffect(() => {
    const loadArtist = async () => {
      await fetchArtists()
      const foundArtist = getArtistBySlug(slug)
      setArtist(foundArtist)
      
      if (foundArtist && foundArtist.artistId) {
        setIsLoadingArtworks(true)
        const artworksByArtistId = await getArtworksByArtistId(Number(foundArtist.artistId))
        setArtistArtworks(artworksByArtistId)
        setIsLoadingArtworks(false)
      }
    }
    
    loadArtist()
  }, [fetchArtists, getArtistBySlug, getArtworksByArtistId, slug])

  // Watch for language changes to update the artist and artworks
  useEffect(() => {
    if (artists.length > 0) {
      const foundArtist = getArtistBySlug(slug)
      setArtist(foundArtist)
      
      if (foundArtist && foundArtist.artistId) {
        const loadArtworks = async () => {
          setIsLoadingArtworks(true)
          const artworksByArtistId = await getArtworksByArtistId(Number(foundArtist.artistId))
          setArtistArtworks(artworksByArtistId)
          setIsLoadingArtworks(false)
        }
        
        loadArtworks()
      }
    }
  }, [language, artists, getArtistBySlug, slug, getArtworksByArtistId])

  // Transformer les artworks dans le format attendu par ArtistArtworks
  const formatArtworksForDisplay = (artworks: ArtWork[]) => {
    return artworks.map(artwork => ({
      id: artwork.id,
      name: typeof artwork.name === 'string' 
        ? artwork.name 
        : artwork.name[language as Lang] || artwork.name.FR || Object.values(artwork.name)[0] || 'Sans titre',
      price: artwork.price,
      image: { src: artwork.image || '' }
    }))
  }

  if (isLoading) {
    return <div className="mt-headerSize text-center">{t('common.loading')}</div>
  }

  if (hasError || !artist) {
    return <div className="mt-headerSize text-center">{t('artistPage.notFound')}</div>
  }
  
  if (isLoadingArtworks) {
    return <div className="mt-headerSize text-center">{t('common.loading')}</div>
  }
  
  const formattedArtworks = formatArtworksForDisplay(artistArtworks)
  
  return (
    <>
      <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-headerSize">
        <ArtistProfile artist={artist} />
        {formattedArtworks.length > 0 && (
          <ArtistArtworks artistName={artist.name} artworks={formattedArtworks} />
        )}
        <ExpertSection />
      </section>
    </>
  )
} 