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
    slug: string
    artworkImages: {
        image: string
        name: string
        price?: number
        url: string
    }[]
}

interface ArtistState {
    // Données des artistes transformées pour l'application
    artists: ArtistData[]
    // Données brutes des artistes issues de Prisma
    rawArtists: PrismaArtistData[]
    currentArtistIndex: number
    isLoading: boolean
    hasError: boolean
    errorMessage: string | null
    fetchArtists: () => Promise<void>
    setCurrentArtistIndex: (index: number) => void
    getCurrentArtist: () => ArtistData | undefined
    getCurrentArtistArtworks: () => { image: string, name: string, price: number, url: string }[] | []
    // Méthode de l'ancien useArtistsStore
    getArtistByName: (name: string) => PrismaArtistData | undefined
    // Nouvelle méthode pour récupérer un artiste par son slug
    getArtistBySlug: (slug: string) => ArtistData | undefined
}

export const useArtistStore = create<ArtistState>((set, get) => ({
    artists: [],
    rawArtists: [],
    currentArtistIndex: 0,
    isLoading: false,
    hasError: false,
    errorMessage: null,

    fetchArtists: async () => {
        set({ isLoading: true, hasError: false, errorMessage: null })

        try {
            // Récupérer les artistes via le server action
            const artistsData = await getArtists()
            console.log('artistsData', artistsData)
            // Stocker les données brutes
            set({ rawArtists: artistsData })

            // Transformer les données au format attendu par l'application
            const formattedArtists: ArtistData[] = artistsData.map((artist: PrismaArtistData) => {
                // Création d'une introduction et description à partir des données disponibles
                const styleText = artist.artworkStyle || '';

                return {
                    id: artist.id,
                    name: `${artist.name} ${artist.surname}`,
                    photo: artist.imageUrl || '',
                    role: styleText || 'Artiste',
                    intro: (artist as any).intro,
                    description: (artist as any).description,
                    slug: artist.slug,
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
        const { artists, currentArtistIndex, rawArtists } = get()

        if (currentArtistIndex < 0 || currentArtistIndex >= artists.length) {
            return []
        }

        const currentArtist = artists[currentArtistIndex]
        const rawArtist = rawArtists.find(artist => artist.id === currentArtist.id)

        if (!rawArtist || !rawArtist.artworkImages) {
            return []
        }

        // Tenter de parser les artworkImages si c'est une chaîne JSON
        let artworkImagesArray = []
        try {
            if (typeof rawArtist.artworkImages === 'string') {
                artworkImagesArray = JSON.parse(rawArtist.artworkImages)
            } else {
                artworkImagesArray = Array.isArray(rawArtist.artworkImages)
                    ? rawArtist.artworkImages
                    : [rawArtist.artworkImages]
            }
        } catch (error) {
            console.error('Erreur lors du parsing des images d\'œuvres d\'art:', error)
            artworkImagesArray = []
        }

        // Normaliser les données pour correspondre au format attendu
        return artworkImagesArray.map((artwork: any) => ({
            image: artwork.image || '',
            name: artwork.name || 'Sans titre',
            price: artwork.price || 0,
            url: artwork.url || artwork.image || ''
        }))
    },

    // Méthode de l'ancien useArtistsStore
    getArtistByName: (name: string) => {
        const { rawArtists } = get()
        return rawArtists.find(artist =>
            artist.name.toLowerCase() === name.toLowerCase()
        )
    },

    // Nouvelle méthode pour récupérer un artiste par son slug
    getArtistBySlug: (slug: string) => {
        const { artists } = get()
        return artists.find(artist => artist.slug === slug)
    }
})) 