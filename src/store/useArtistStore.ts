import { create } from 'zustand'
import { Lang } from '@/types/types'
import { getArtists, ArtistData as PrismaArtistData } from '@/actions/artistActions'

export interface ArtistData {
    id: number
    name: string
    role: string
    photo: string
    intro: string
    description: string
    artworkImages: {
        image: string
        name: string
        price: number
    }[]
}

interface ArtistState {
    artists: ArtistData[]
    currentArtistIndex: number
    isLoading: boolean
    hasError: boolean
    errorMessage: string | null
    fetchArtists: () => Promise<void>
    setCurrentArtistIndex: (index: number) => void
    getCurrentArtist: () => ArtistData | undefined
    getCurrentArtistArtworks: () => { image: string, name: string, price: number }[] | []
}

export const useArtistStore = create<ArtistState>((set, get) => ({
    artists: [],
    currentArtistIndex: 0,
    isLoading: false,
    hasError: false,
    errorMessage: null,

    fetchArtists: async () => {
        set({ isLoading: true, hasError: false, errorMessage: null })

        try {
            // Récupérer les artistes via le server action
            const artistsData = await getArtists()

            // Transformer les données au format attendu par l'application
            const formattedArtists: ArtistData[] = artistsData.map((artist: PrismaArtistData) => {
                // Création d'une introduction et description à partir des données disponibles
                const styleText = artist.artworkStyle || '';

                return {
                    id: artist.id,
                    name: `${artist.name} ${artist.surname}`,
                    photo: artist.imageUrl || '',
                    role: styleText || 'Artiste',
                    intro: styleText.substring(0, 150),
                    description: styleText,
                    artworkImages: artist.artworkImages ? JSON.parse(JSON.stringify(artist.artworkImages)) : []
                };
            });

            set({ artists: formattedArtists, isLoading: false })
        } catch (error) {
            console.error('Erreur lors de la récupération des artistes:', error)
            set({
                hasError: true,
                errorMessage: error instanceof Error ? error.message : 'Erreur inconnue',
                isLoading: false
            })
        }
    },

    setCurrentArtistIndex: (index: number) => {
        set({ currentArtistIndex: index })
    },

    getCurrentArtist: () => {
        const { artists, currentArtistIndex } = get()
        return artists[currentArtistIndex]
    },

    getCurrentArtistArtworks: () => {
        const { artists, currentArtistIndex } = get()
        return currentArtistIndex >= 0 && currentArtistIndex < artists.length
            ? artists[currentArtistIndex].artworkImages || []
            : []
    }
})) 