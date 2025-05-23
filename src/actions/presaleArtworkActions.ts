'use server'

import { prisma } from '@/lib/prisma'
import { organizeTranslations } from '@/utils/translations'

export interface PresaleArtworkData {
    id: number
    name: string
    description: string | null
    order: number | null
    price: number | null
    imageUrl: string
    mockupUrls: any
    artistId: number
    artist: {
        name: string
        surname: string
    }
    translations?: {
        name?: Record<string, string>
        description?: Record<string, string>
    }
}

export async function getPresaleArtworks(): Promise<PresaleArtworkData[]> {
    try {
        const presaleArtworks = await prisma.presaleArtwork.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                order: true,
                imageUrl: true,
                mockupUrls: true,
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

        if (presaleArtworks.length === 0) {
            return []
        }

        // Récupérer les ID des oeuvres pour les requêtes de traduction
        const artworkIds = presaleArtworks.map(artwork => artwork.id)

        // Récupérer toutes les traductions en une seule requête
        const allTranslations = await prisma.translation.findMany({
            where: {
                entityType: 'PresaleArtwork',
                entityId: { in: artworkIds }
            },
            include: {
                language: true
            }
        })

        // Organisation des traductions par entité et par champ
        const translationsByEntity = organizeTranslations(allTranslations)

        // Ajouter les traductions aux oeuvres
        const artworksWithTranslations = presaleArtworks.map(artwork => {
            const artworkKey = `PresaleArtwork-${artwork.id}`

            // Organiser les traductions
            const translations = {
                name: translationsByEntity[artworkKey]?.name || {},
                description: translationsByEntity[artworkKey]?.description || {}
            }

            // Parser les mockupUrls si c'est une chaîne JSON
            let mockupUrls = artwork.mockupUrls
            if (mockupUrls) {
                try {
                    if (typeof mockupUrls === 'string') {
                        mockupUrls = JSON.parse(mockupUrls)
                    }
                } catch (error) {
                    console.error('Erreur lors du parsing des mockupUrls:', error)
                    mockupUrls = []
                }
            }

            return {
                ...artwork,
                mockupUrls,
                translations
            }
        })

        return artworksWithTranslations
    } catch (error) {
        console.error('Erreur lors de la récupération des presale artworks:', error)
        throw new Error('Impossible de récupérer les presale artworks')
    }
}

export async function getPresaleArtworksByArtistId(artistId: number): Promise<PresaleArtworkData[]> {
    try {
        const presaleArtworks = await prisma.presaleArtwork.findMany({
            where: {
                artistId: artistId
            },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                order: true,
                imageUrl: true,
                mockupUrls: true,
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

        if (presaleArtworks.length === 0) {
            return []
        }

        // Récupérer les ID des oeuvres pour les requêtes de traduction
        const artworkIds = presaleArtworks.map(artwork => artwork.id)

        // Récupérer toutes les traductions en une seule requête
        const allTranslations = await prisma.translation.findMany({
            where: {
                entityType: 'PresaleArtwork',
                entityId: { in: artworkIds }
            },
            include: {
                language: true
            }
        })

        // Organisation des traductions par entité et par champ
        const translationsByEntity = organizeTranslations(allTranslations)

        // Ajouter les traductions aux oeuvres
        const artworksWithTranslations = presaleArtworks.map(artwork => {
            const artworkKey = `PresaleArtwork-${artwork.id}`

            // Organiser les traductions
            const translations = {
                name: translationsByEntity[artworkKey]?.name || {},
                description: translationsByEntity[artworkKey]?.description || {}
            }

            // Parser les mockupUrls si c'est une chaîne JSON
            let mockupUrls = artwork.mockupUrls
            if (mockupUrls) {
                try {
                    if (typeof mockupUrls === 'string') {
                        mockupUrls = JSON.parse(mockupUrls)
                    }
                } catch (error) {
                    console.error('Erreur lors du parsing des mockupUrls:', error)
                    mockupUrls = []
                }
            }

            return {
                ...artwork,
                mockupUrls,
                translations
            }
        })

        return artworksWithTranslations
    } catch (error) {
        console.error(`Erreur lors de la récupération des presale artworks pour l'artiste ${artistId}:`, error)
        throw new Error(`Impossible de récupérer les presale artworks pour l'artiste ${artistId}`)
    }
}