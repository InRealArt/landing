import { create } from 'zustand'
import { collection, getDocs } from 'firebase/firestore'
import { db, storage } from '@/utils/firebase'
import { getDownloadURL, ref } from "firebase/storage";
import { ArtWork, Lang } from '@/types/types';
import { transformArtworksPhotos, stringToSlug } from '@/utils/functions';
import { useLanguageStore } from './languageStore';

interface ArtworksState {
    artworks: ArtWork[]
    isLoading: boolean
    hasError: boolean
    errorMessage: string | null
    fetchArtworks: () => Promise<void>
    getArtworkBySlug: (slug: string) => ArtWork | undefined
}

export const useArtworksStore = create<ArtworksState>((set, get) => ({
    artworks: [],
    isLoading: false,
    hasError: false,
    errorMessage: null,

    fetchArtworks: async () => {
        set({ isLoading: true, hasError: false, errorMessage: null })

        try {
            const artworksCollection = collection(db, 'Presale_DropPanel')
            const artworksSnapshot = await getDocs(artworksCollection)
            console.log("artworksSnapshot : ", artworksSnapshot.docs)

            const data = artworksSnapshot.docs.map(
                (doc) => doc.data()
              );
              
            const artworks_ = data[0]["artworks"]
              .sort((a: ArtWork, b: ArtWork) => a.order - b.order)
              .filter((artwork: ArtWork) => !artwork.desactivate) as ArtWork[];
              console.log("data : ", data)

            const artworks_tmp = await transformArtworksPhotos(artworks_);
            // console.log("artworks_tmp : ", artworks_tmp)
        
            set({ artworks: artworks_tmp, isLoading: false })
        } catch (error) {
            console.error('Erreur lors de la récupération des images des artworks:', error)
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
    }
})) 