'use server'

import { prisma } from '@/lib/prisma'

export interface ArtistData {
    id: number
    name: string
    surname: string
    artworkStyle: string | null
    artistsPage: boolean | null
    imageUrl: string
    backgroundImage: string | null
    isGallery: boolean
    artworkImages: any | null // Stocké comme JSON dans la base de données
}

export async function getArtists(): Promise<ArtistData[]> {
    try {
        const artists = await prisma.artist.findMany({
            where: {
                artistsPage: true
            },
            select: {
                id: true,
                name: true,
                surname: true,
                artworkStyle: true,
                artistsPage: true,
                imageUrl: true,
                backgroundImage: true,
                isGallery: true,
                artworkImages: true
            }
        })
        console.log('artists', artists)
        return artists
    } catch (error) {
        console.error('Erreur lors de la récupération des artistes:', error)
        throw new Error('Impossible de récupérer les artistes')
    }
} 