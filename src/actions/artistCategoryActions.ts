'use server'

import { prisma } from '@/lib/prisma'

export interface ArtistCategory {
    id: number
    name: string
    imageUrl: string | null
    description: string | null
    translations?: {
        name?: Record<string, string>
        description?: Record<string, string>
    }
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

        // Récupérer et agréger les traductions par catégorie
        const categoriesWithTranslations = await Promise.all(categories.map(async (category) => {
            const translations = await prisma.translation.findMany({
                where: {
                    entityType: 'ArtistCategory',
                    entityId: category.id
                },
                include: {
                    language: true
                }
            })

            const formattedTranslations: { name: Record<string, string>, description: Record<string, string> } = {
                name: {},
                description: {}
            }

            translations.forEach(t => {
                if (t.field === 'name' || t.field === 'description') {
                    const field = t.field as 'name' | 'description'
                    formattedTranslations[field][t.language.code] = t.value
                }
            })

            return {
                ...category,
                translations: formattedTranslations
            }
        }))

        return categoriesWithTranslations
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories d\'artistes:', error)
        return []
    }
}
