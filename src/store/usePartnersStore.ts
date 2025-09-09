import { create } from 'zustand'
import { Lang } from '@/types/types'
import { getArtists, ArtistData as PrismaArtistData } from '@/actions/artistActions'
import { useLanguageStore } from './languageStore'

export interface PartnerData {
    id: number
    name: string
    photo: string
    slug: string
    artistId?: number
    countryCode?: string | null
    countryName?: string | null
    description?: string
}

interface PartnersState {
    partners: PartnerData[]
    rawPartners: PrismaArtistData[]
    isLoading: boolean
    hasError: boolean
    errorMessage: string | null
    lastFetchTime: number | null
    fetchPartners: () => Promise<void>
    getPartnerBySlug: (slug: string) => PartnerData | undefined
    getPartnersSelector: () => PartnerData[]
    getLoadingSelector: () => boolean
    getErrorSelector: () => { hasError: boolean; errorMessage: string | null }
}

export const usePartnersStore = create<PartnersState>((set, get) => ({
    partners: [],
    rawPartners: [],
    isLoading: false,
    hasError: false,
    errorMessage: null,
    lastFetchTime: null,

    fetchPartners: async () => {
        set({ isLoading: true, hasError: false, errorMessage: null })

        try {
            // Récupérer les galeries partenaires (isGallery: true)
            const partnersData = await getArtists(true)
            set({ rawPartners: partnersData })

            // Transformer les données au format attendu par l'application
            const formattedPartners: PartnerData[] = partnersData.map((partner: PrismaArtistData) => {
                const { language } = useLanguageStore.getState()

                // Utiliser les traductions si disponibles, sinon utiliser les valeurs par défaut
                const description = partner.translations?.description?.[language] || partner.description || ''

                return {
                    id: partner.id,
                    artistId: partner.artistId,
                    name: `${partner.name} ${partner.surname}`,
                    photo: partner.imageUrl || '',
                    slug: partner.slug,
                    countryCode: partner.countryCode ?? null,
                    countryName: partner.countryName ?? null,
                    description
                }
            })

            set({
                partners: formattedPartners,
                isLoading: false,
                lastFetchTime: Date.now()
            })

            console.log(`Store mis à jour avec ${formattedPartners.length} galeries partenaires`)
        } catch (error) {
            console.error('Erreur lors de la récupération des galeries partenaires:', error)
            set({
                hasError: true,
                errorMessage: error instanceof Error ? error.message : 'Erreur inconnue',
                isLoading: false
            })
        }
    },

    getPartnerBySlug: (slug: string) => {
        const { partners, rawPartners } = get()
        const { language } = useLanguageStore.getState()

        const partner = partners.find(partner => partner.slug === slug)
        if (!partner) return undefined

        // Trouver les données brutes correspondantes pour accéder aux traductions
        const rawPartner = rawPartners.find(raw => raw.id === partner.id)
        if (!rawPartner || !rawPartner.translations) return partner

        // Appliquer les traductions selon la langue actuelle
        return {
            ...partner,
            artistId: rawPartner.artistId,
            description: rawPartner.translations.description?.[language] || rawPartner.description || partner.description
        }
    },

    // Sélecteurs optimisés pour éviter les re-renders
    getPartnersSelector: () => get().partners,
    getLoadingSelector: () => get().isLoading,
    getErrorSelector: () => ({
        hasError: get().hasError,
        errorMessage: get().errorMessage
    })
}))
