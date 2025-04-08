import { create } from 'zustand'
import { ArtWork, Lang } from '@/types/types'
import { stringToSlug } from '@/utils/functions'
import { useLanguageStore } from './languageStore'
import { getPresaleArtworks, PresaleArtworkData } from '@/actions/presaleArtworkActions'

interface ArtworksState {
    artworks: ArtWork[]
    rawArtworks: PresaleArtworkData[]
    isLoading: boolean
    hasError: boolean
    errorMessage: string | null
    fetchArtworks: () => Promise<void>
    getArtworkBySlug: (slug: string) => ArtWork | undefined
    getTranslatedField: (artworkId: number, field: string, defaultValue: string) => string
}

export const useArtworksStore = create<ArtworksState>((set, get) => ({
    artworks: [],
    rawArtworks: [],
    isLoading: false,
    hasError: false,
    errorMessage: null,

    fetchArtworks: async () => {
        set({ isLoading: true, hasError: false, errorMessage: null })

        try {
            // Récupérer les œuvres via le server action
            const presaleArtworks = await getPresaleArtworks()

            // Stocker les données brutes
            set({ rawArtworks: presaleArtworks })

            // Transformer les données au format attendu par l'application
            const formattedArtworks: ArtWork[] = presaleArtworks.map((artwork) => {
                const { language } = useLanguageStore.getState()
                const lang = language as Lang

                // Création d'un objet avec les traductions pour chaque langue disponible
                const createMultiLangObject = (value: string, translations?: Record<string, string>): Record<Lang, string> => {
                    const result: Record<Lang, string> = {
                        FR: value,
                        EN: value,
                        CN: value
                    }

                    // Ajouter les traductions si disponibles
                    if (translations) {
                        if (translations['fr']) result.FR = translations['fr']
                        if (translations['en']) result.EN = translations['en']
                        if (translations['cn']) result.CN = translations['cn']
                    }

                    return result
                }

                // Récupérer les mockups
                let mockups: string[] = []
                if (artwork.mockupUrls) {
                    if (Array.isArray(artwork.mockupUrls)) {
                        mockups = artwork.mockupUrls
                    }
                }

                return {
                    id: artwork.id.toString(),
                    artistName: `${artwork.artist.name} ${artwork.artist.surname}`,
                    name: createMultiLangObject(artwork.name, artwork.translations?.name),
                    description: createMultiLangObject(artwork.description || '', artwork.translations?.description),
                    image: artwork.imageUrl,
                    image2: artwork.imageUrl,
                    url: artwork.imageUrl,
                    url2: artwork.imageUrl,
                    price: artwork.price,
                    size: createMultiLangObject(''),
                    order: artwork.order || 0,
                    mockups: mockups,
                    noBorder: false,
                    desactivate: false
                }
            })

            set({ artworks: formattedArtworks, isLoading: false })
        } catch (error) {
            console.error('Erreur lors de la récupération des artworks:', error)
            set({
                hasError: true,
                errorMessage: error instanceof Error ? error.message : 'Erreur inconnue',
                isLoading: false
            })
        }
    },

    getArtworkBySlug: (slug: string) => {
        const { artworks } = get();

        // Find the artwork with a name that matches the slug
        return artworks.find(artwork => {
            // Get the name in the current language or use the first available language
            let artworkName = '';

            if (typeof artwork.name === 'string') {
                artworkName = artwork.name;
            } else if (artwork.name) {
                // Try to get the name in the current language
                const { language } = useLanguageStore.getState();
                const lang = language as Lang;
                artworkName = (artwork.name[lang] as string) ||
                    (artwork.name.FR as string) ||
                    (Object.values(artwork.name)[0] as string) || '';
            }

            // Convert the name to a slug and compare
            return stringToSlug(artworkName) === slug;
        });
    },

    // Méthode utilitaire pour récupérer un champ traduit
    getTranslatedField: (artworkId: number, field: string, defaultValue: string) => {
        const { rawArtworks } = get()
        const { language } = useLanguageStore.getState()

        const artwork = rawArtworks.find(a => a.id === artworkId)
        if (!artwork || !artwork.translations) return defaultValue

        const fieldTranslations = artwork.translations[field as keyof typeof artwork.translations]
        if (!fieldTranslations) return defaultValue

        return fieldTranslations[language.toLowerCase()] || defaultValue
    }
})) 