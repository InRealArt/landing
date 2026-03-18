'use server'

import { prisma } from '@/lib/prisma'

export interface ArtistCategory {
    id: number
    name: string
    slug?: string
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

        // Récupérer toutes les traductions en une seule requête
        const categoryIds = categories.map(c => c.id)
        const allTranslations = await prisma.translation.findMany({
            where: {
                entityType: 'ArtistCategory',
                entityId: { in: categoryIds }
            },
            include: {
                language: true
            }
        })

        const categoriesWithTranslations = categories.map(category => {
            const translations = allTranslations.filter(t => t.entityId === category.id)
            const formattedTranslations: { name: Record<string, string>, description: Record<string, string> } = {
                name: {},
                description: {}
            }

            translations.forEach(t => {
                if ((t.field === 'name' || t.field === 'description') && t.value != null) {
                    const field = t.field as 'name' | 'description'
                    formattedTranslations[field][t.language.code] = t.value
                }
            })

            return {
                ...category,
                translations: formattedTranslations
            }
        })

        return categoriesWithTranslations
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories d\'artistes:', error)
        return []
    }
}

export async function getArtistCategoryBySlug(slug: string): Promise<ArtistCategory | null> {
    try {
        // Décoder l'URL et chercher par nom (en attendant la migration pour le slug)
        const decodedSlug = decodeURIComponent(slug)
        const category = await prisma.artistCategory.findFirst({
            where: {
                name: {
                    equals: decodedSlug,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true,
                name: true,
                imageUrl: true,
                description: true
            }
        })

        if (!category) {
            return null
        }

        // Récupérer les traductions pour cette catégorie
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
            if ((t.field === 'name' || t.field === 'description') && t.value != null) {
                const field = t.field as 'name' | 'description'
                formattedTranslations[field][t.language.code] = t.value
            }
        })

        return {
            ...category,
            translations: formattedTranslations
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la catégorie d\'artistes:', error)
        return null
    }
}
