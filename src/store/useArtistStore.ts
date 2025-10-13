import { create } from 'zustand'
import { Lang } from '@/types/types'
import { getArtists, ArtistData as PrismaArtistData } from '@/actions/artistActions'
import { useLanguageStore } from './languageStore'

export interface ArtistData {
    id: number
    name: string
    role: string
    photo: string
    intro: string
    description: string
    secondaryImageUrl: string
    slug: string
    artistId?: number // ID de l'artiste dans la table Artist (clé étrangère)
    countryCode?: string | null
    countryName?: string | null
    mediumTags?: string[]
    birthYear?: number | null
    quoteFromInRealArt?: string | null
    biographyHeader1?: string | null
    biographyText1?: string | null
    biographyHeader2?: string | null
    biographyText2?: string | null
    biographyHeader3?: string | null
    biographyText3?: string | null
    biographyHeader4?: string | null
    biographyText4?: string | null
    imageArtistStudio?: string | null
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
    // Cache pour éviter les re-fetchs inutiles
    lastFetchTime: number | null
    fetchArtists: (isGallery?: boolean) => Promise<void>
    setCurrentArtistIndex: (index: number) => void
    getCurrentArtist: () => ArtistData | undefined
    getCurrentArtistArtworks: () => { image: string, name: string, price: number, url: string, id: string }[] | []
    // Méthode de l'ancien useArtistsStore
    getArtistByName: (name: string) => PrismaArtistData | undefined
    // Nouvelle méthode pour récupérer un artiste par son slug
    getArtistBySlug: (slug: string) => ArtistData | undefined
    // Récupérer le texte traduit pour un champ donné
    getTranslatedField: (artistId: number, field: string, defaultValue: string) => string
    // Sélecteurs optimisés pour éviter les re-renders
    getArtistsSelector: () => ArtistData[]
    getLoadingSelector: () => boolean
    getErrorSelector: () => { hasError: boolean; errorMessage: string | null }
}

export const useArtistStore = create<ArtistState>((set, get) => ({
    artists: [],
    rawArtists: [],
    currentArtistIndex: 0,
    isLoading: false,
    hasError: false,
    errorMessage: null,
    lastFetchTime: null,

    fetchArtists: async (isGallery?: boolean) => {
        const state = get()

        // Forcer la récupération des données depuis la base de données
        // en supprimant la logique de cache qui cause des problèmes
        // avec le filtrage isGallery

        set({ isLoading: true, hasError: false, errorMessage: null })

        try {
            // Récupérer les artistes via le server action
            const artistsData = await getArtists(isGallery)
            // Stocker les données brutes
            set({ rawArtists: artistsData })

            // Transformer les données au format attendu par l'application
            const formattedArtists: ArtistData[] = artistsData.map((artist: PrismaArtistData) => {
                // Récupérer la langue actuelle
                const { language } = useLanguageStore.getState()

                // Utiliser les traductions si disponibles, sinon utiliser les valeurs par défaut
                const intro = artist.translations?.intro?.[language] || artist.intro || ''
                const description = artist.translations?.description?.[language] || artist.description || ''
                const artworkStyle = artist.translations?.artworkStyle?.[language] || artist.artworkStyle || ''

                return {
                    id: artist.id,
                    artistId: artist.artistId,
                    name: `${artist.name} ${artist.surname}`,
                    photo: artist.imageUrl || '',
                    role: artworkStyle || 'Artiste',
                    intro,
                    description,
                    secondaryImageUrl: artist.secondaryImageUrl || '',
                    slug: artist.slug,
                    countryCode: artist.countryCode ?? null,
                    countryName: artist.countryName ?? null,
                    mediumTags: artist.mediumTags ?? [],
                    birthYear: artist.birthYear ?? null,
                    quoteFromInRealArt: artist.quoteFromInRealArt ?? null,
                    biographyHeader1: artist.biographyHeader1 ?? null,
                    biographyText1: artist.biographyText1 ?? null,
                    biographyHeader2: artist.biographyHeader2 ?? null,
                    biographyText2: artist.biographyText2 ?? null,
                    biographyHeader3: artist.biographyHeader3 ?? null,
                    biographyText3: artist.biographyText3 ?? null,
                    biographyHeader4: artist.biographyHeader4 ?? null,
                    biographyText4: artist.biographyText4 ?? null,
                    imageArtistStudio: artist.imageArtistStudio ?? null,
                    artworkImages: artist.artworkImages ? JSON.parse(JSON.stringify(artist.artworkImages)) : []
                };
            });

            set({
                artists: formattedArtists,
                isLoading: false,
                lastFetchTime: Date.now()
            })

            console.log(`Store mis à jour avec ${formattedArtists.length} artistes (isGallery: ${isGallery})`)
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
        return artworkImagesArray.map((artwork: any, index: number) => ({
            id: artwork.id || `artwork-${currentArtist.id}-${index}`, // Generate an id if it doesn't exist
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
        const { artists, rawArtists } = get()
        const { language } = useLanguageStore.getState()

        const artist = artists.find(artist => artist.slug === slug)
        if (!artist) return undefined

        // Trouver les données brutes correspondantes pour accéder aux traductions
        const rawArtist = rawArtists.find(raw => raw.id === artist.id)
        if (!rawArtist || !rawArtist.translations) return artist

        // Appliquer les traductions selon la langue actuelle
        return {
            ...artist,
            artistId: rawArtist.artistId,
            intro: rawArtist.translations.intro?.[language] || rawArtist.intro || artist.intro,
            description: rawArtist.translations.description?.[language] || rawArtist.description || artist.description,
            role: rawArtist.translations.artworkStyle?.[language] || rawArtist.artworkStyle || artist.role,
            birthYear: rawArtist.birthYear ?? null,
            biographyHeader1: rawArtist.biographyHeader1 ?? null,
            biographyText1: rawArtist.biographyText1 ?? null,
            biographyHeader2: rawArtist.biographyHeader2 ?? null,
            biographyText2: rawArtist.biographyText2 ?? null,
            biographyHeader3: rawArtist.biographyHeader3 ?? null,
            biographyText3: rawArtist.biographyText3 ?? null,
            biographyHeader4: rawArtist.biographyHeader4 ?? null,
            biographyText4: rawArtist.biographyText4 ?? null,
            imageArtistStudio: rawArtist.imageArtistStudio ?? null
        }
    },

    // Méthode utilitaire pour récupérer un champ traduit
    getTranslatedField: (artistId: number, field: string, defaultValue: string) => {
        const { rawArtists } = get()
        const { language } = useLanguageStore.getState()

        const artist = rawArtists.find(a => a.id === artistId)
        if (!artist || !artist.translations) return defaultValue

        const fieldTranslations = artist.translations[field as keyof typeof artist.translations]
        if (!fieldTranslations) return defaultValue

        return fieldTranslations[language.toLowerCase()] || defaultValue
    },

    // Sélecteurs optimisés pour éviter les re-renders
    getArtistsSelector: () => get().artists,
    getLoadingSelector: () => get().isLoading,
    getErrorSelector: () => ({
        hasError: get().hasError,
        errorMessage: get().errorMessage
    })
})) 