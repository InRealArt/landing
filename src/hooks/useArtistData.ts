import { useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useArtistStore } from '@/store/useArtistStore'
import { useArtworksStore } from '@/store/useArtworksStore'
import { ArtWork } from '@/types/types'

// Type local pour ArtistData si pas exporté depuis types
interface ArtistData {
    id: number
    name: string
    role: string
    photo: string
    intro: string
    description: string
    slug: string
    artistId?: number
    countryCode?: string | null
    countryName?: string | null
    mediumTags?: string[]
    birthYear?: number | null
    quoteHeader?: string | null
    quoteText?: string | null
    biographyHeader1?: string | null
    biographyText1?: string | null
    biographyHeader2?: string | null
    biographyText2?: string | null
    biographyHeader3?: string | null
    biographyText3?: string | null
    artworkImages: {
        image: string
        name: string
        price?: number
        url: string
    }[]
}

export function useArtistData(slug: string) {
    // Sélecteurs optimisés avec useShallow pour éviter les re-renders
    const artistData = useArtistStore(
        useShallow((state) => ({
            artists: state.artists,
            isLoading: state.isLoading,
            hasError: state.hasError,
            errorMessage: state.errorMessage,
            fetchArtists: state.fetchArtists
        }))
    )

    const artworksData = useArtworksStore(
        useShallow((state) => ({
            getArtworksByArtistId: state.getArtworksByArtistId
        }))
    )

    // Trouver l'artiste par slug
    const artist = useMemo(() => {
        return artistData.artists.find(a => a.slug === slug)
    }, [artistData.artists, slug])

    // État global optimisé
    const state = useMemo(() => ({
        artist,
        isLoading: artistData.isLoading,
        hasError: artistData.hasError,
        errorMessage: artistData.errorMessage,
        fetchArtists: artistData.fetchArtists,
        getArtworksByArtistId: artworksData.getArtworksByArtistId
    }), [artist, artistData, artworksData])

    return state
}
