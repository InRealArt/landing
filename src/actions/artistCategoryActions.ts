'use server'

import { prisma } from '@/lib/prisma'

export interface ArtistCategory {
    id: number
    name: string
    imageUrl: string | null
    description: string | null
}

export async function getArtistCategories(): Promise<ArtistCategory[]> {
    try {
        const categories = await prisma.artistCategory.findMany({
            select: {
                id: true,
                name: true,
                imageUrl: true,
                description: true
            },
            orderBy: {
                order: 'asc'
            }
        })

        return categories
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories d\'artistes:', error)
        return []
    }
}
