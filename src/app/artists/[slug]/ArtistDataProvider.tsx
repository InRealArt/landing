'use client'

import { useEffect, useMemo } from 'react'
import { useArtistStore, ArtistData } from '@/store/useArtistStore'
import { useArtworksStore } from '@/store/useArtworksStore'
import { useShallow } from 'zustand/react/shallow'
import { ArtWork } from '@/types/types'
import { useState } from 'react'

interface Props {
  slug: string
  children: (data: {
    artist: ArtistData | null
    artworks: ArtWork[]
    isLoading: boolean
    hasError: boolean
  }) => React.ReactNode
}

export default function ArtistDataProvider({ slug, children }: Props) {
  // Utilisation optimisée de useShallow pour éviter les re-renders inutiles
  const { 
    artists, 
    isLoading: isArtistsLoading, 
    hasError: hasArtistsError,
    fetchArtists 
  } = useArtistStore(
    useShallow((state) => ({
      artists: state.artists,
      isLoading: state.isLoading,
      hasError: state.hasError,
      fetchArtists: state.fetchArtists
    }))
  )

  const { getArtworksByArtistId } = useArtworksStore(
    useShallow((state) => ({
      getArtworksByArtistId: state.getArtworksByArtistId
    }))
  )

  // Récupération de l'artiste avec gestion optimisée
  const artist = useMemo(() => {
    return artists.find(a => a.slug === slug)
  }, [artists, slug])

  // Fetch des artistes une seule fois au montage
  useEffect(() => {
    if (artists.length === 0) {
      fetchArtists()
    }
  }, [fetchArtists, artists.length])

  // Gestion des artworks avec état local optimisé
  const [artworksState, setArtworksState] = useState<{
    artworks: ArtWork[]
    isLoading: boolean
    hasError: boolean
  }>({
    artworks: [],
    isLoading: false,
    hasError: false
  })

  useEffect(() => {
    if (artist?.artistId) {
      const loadArtworks = async () => {
        setArtworksState(prev => ({ ...prev, isLoading: true }))
        try {
          const artworks = await getArtworksByArtistId(Number(artist.artistId))
          setArtworksState({
            artworks,
            isLoading: false,
            hasError: false
          })
        } catch (error) {
          console.error('Erreur lors du chargement des artworks:', error)
          setArtworksState({
            artworks: [],
            isLoading: false,
            hasError: true
          })
        }
      }
      
      loadArtworks()
    }
  }, [artist?.artistId, getArtworksByArtistId])

  // État global du composant
  const globalState = useMemo(() => ({
    artist: artist || null,
    artworks: artworksState.artworks,
    isLoading: isArtistsLoading || artworksState.isLoading,
    hasError: hasArtistsError || artworksState.hasError
  }), [artist, artworksState, isArtistsLoading, hasArtistsError])

  // Rendu des enfants avec les données (même pendant le chargement)
  return <>{children(globalState)}</>
}
