import { create } from 'zustand'
import { collection, getDocs } from 'firebase/firestore'
import { db, storage } from '@/utils/firebase'
import { getDownloadURL, ref } from "firebase/storage";
import { ArtWork } from '@/types/types';
import { transformArtworksPhotos } from '@/utils/functions';



interface ArtworksState {
    artworks: ArtWork[]
    isLoading: boolean
    hasError: boolean
    errorMessage: string | null
    fetchArtworks: () => Promise<void>
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
            console.log("data : ", data)

            const artworks_ = data[0]["artworks"]
              .sort((a: ArtWork, b: ArtWork) => a.order - b.order)
              .filter((artwork: ArtWork) => !artwork.desactivate) as ArtWork[];
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

})) 