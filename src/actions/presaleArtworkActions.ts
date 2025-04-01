'use server'

import { prisma } from '@/lib/prisma'

export interface PresaleArtworkData {
    id: number
    name: string
    order: number | null
    price: number
    imageUrl: string
    artistId: number
    artist: {
        name: string
        surname: string
    }
}

export async function getPresaleArtworks(): Promise<PresaleArtworkData[]> {
    try {
        const presaleArtworks = await prisma.presaleArtwork.findMany({
            select: {
                id: true,
                name: true,
                price: true,
                order: true,
                imageUrl: true,
                artistId: true,
                artist: {
                    select: {
                        name: true,
                        surname: true
                    }
                }
            },
            orderBy: {
                order: 'asc'
            }
        })

        return presaleArtworks
    } catch (error) {
        console.error('Erreur lors de la récupération des presale artworks:', error)
        throw new Error('Impossible de récupérer les presale artworks')
    }
} 