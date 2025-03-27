import { create } from 'zustand'
import { collection, getDocs } from 'firebase/firestore'
import { db, storage } from '@/utils/firebase'
import { ListResult, StorageReference, getDownloadURL, listAll, ref } from "firebase/storage";

export interface ArtistImage {
    image: string
    name: string
    // Ajoutez d'autres propriétés si nécessaires selon la structure de allArtists_
}

interface ArtistImagesState {
    artistImages: ArtistImage[]
    isLoading: boolean
    hasError: boolean
    errorMessage: string | null
    fetchArtists: () => Promise<void>
    getArtistByName: (name: string) => ArtistImage | undefined
}

const getUrl = async (image: string) => {
    const imageRef = ref(storage, `artists/${image}`)
    return await getDownloadURL(imageRef)
}


export const useArtistImagesStore = create<ArtistImagesState>((set, get) => ({
    artistImages: [],
    isLoading: false,
    hasError: false,
    errorMessage: null,

    fetchArtists: async () => {
        set({ isLoading: true, hasError: false, errorMessage: null })

        try {
            const artistsCollection = collection(db, 'Artists')
            const artistsSnapshot = await getDocs(artistsCollection)
            console.log("artistsSnapshot : ", artistsSnapshot.docs)

            let allArtists: ArtistImage[] = []

            // Traitement de chaque document
            for (const doc of artistsSnapshot.docs) {
                const data = doc.data()
                console.log("data : ", data)

                // Récupérer le tableau d'artistes
                const docArtists = data['artists'] || []
                console.log("allArtists_ : ", docArtists)

                // Traitement des images
                for (let i = 0; i < docArtists.length; i++) {
                    const imageName = docArtists[i].image
                    const urlImage = (imageName) ? await getUrl(imageName) : ''
                    docArtists[i].image = urlImage
                }

                // Ajouter les artistes de ce document au tableau global
                allArtists = [...allArtists, ...docArtists]
            }

            console.log("artists : ", allArtists)
            set({ artistImages: allArtists, isLoading: false })
        } catch (error) {
            console.error('Erreur lors de la récupération des images des artistes:', error)
            set({
                hasError: true,
                errorMessage: error instanceof Error ? error.message : 'Erreur inconnue',
                isLoading: false
            })
        }
    },

    getArtistByName: (name: string) => {
        const { artistImages } = get()
        return artistImages.find(artist =>
            artist.name.toLowerCase() === name.toLowerCase()
        )
    }
})) 