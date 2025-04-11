import { create } from 'zustand'
import { getPresaleArtworks, PresaleArtworkData as PrismaPresaleArtworkData } from '@/actions/presaleArtworkActions'

export interface PresaleArtworkData {
    id: number
    name: string
    price: number | null
    url: string
    artistName: string
    order: number | null
}

interface PresaleArtworkState {
    artworks: PresaleArtworkData[]
    rawArtworks: PrismaPresaleArtworkData[]
    isLoading: boolean
    hasError: boolean
    errorMessage: string | null
    fetchPresaleArtworks: () => Promise<void>
}

export const usePresaleArtworkStore = create<PresaleArtworkState>((set) => ({
    artworks: [],
    rawArtworks: [],
    isLoading: false,
    hasError: false,
    errorMessage: null,

    fetchPresaleArtworks: async () => {
        set({ isLoading: true, hasError: false, errorMessage: null })

        try {
            // Récupérer les presale artworks via le server action
            const presaleArtworksData = await getPresaleArtworks()
            
            // Stocker les données brutes
            set({ rawArtworks: presaleArtworksData })

            // Transformer les données au format attendu par l'application
            const formattedArtworks: PresaleArtworkData[] = presaleArtworksData.map((artwork) => {
                return {
                    id: artwork.id,
                    name: artwork.name,
                    price: artwork.price,
                    url: artwork.imageUrl,
                    artistName: `${artwork.artist.name} ${artwork.artist.surname}`,
                    order: artwork.order
                }
            })

            set({ artworks: formattedArtworks.sort((a, b) => typeof a.order === 'number' && typeof b.order === 'number' ? a.order - b.order : 0), isLoading: false })
        } catch (error) {
            console.error('Erreur lors de la récupération des presale artworks:', error)
            set({
                hasError: true,
                errorMessage: error instanceof Error ? error.message : 'Erreur inconnue',
                isLoading: false
            })
        }
    }
})) 