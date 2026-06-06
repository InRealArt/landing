'use server'

import { prisma } from '@/lib/prisma'
import { organizeTranslations } from '@/utils/translations'
const toSlug = (str: string) =>
    str
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')

export interface PresaleArtworkData {
    id: number
    name: string
    description: string | null
    order: number | null
    price: number | null
    imageUrl: string
    mockupUrls: any
    artistId: number
    width: number | null
    height: number | null
    isSold: boolean
    artist: {
        name: string
        surname: string
        slug: string | null
    }
    translations?: {
        name?: Record<string, string>
        description?: Record<string, string>
    }
}

export async function getPresaleArtworks(): Promise<PresaleArtworkData[]> {
    try {
        const presaleArtworks = await prisma.presaleArtwork.findMany({
            where: {
                artist: {
                    LandingArtist: {
                        some: {
                            artistsPage: true
                        }
                    }
                }
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
                width: true,
                height: true,
                isSold: true,
                artist: {
                    select: {
                        name: true,
                        surname: true,
                        slug: true,
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
                artist: {
                    name: artwork.artist.name ?? '',
                    surname: artwork.artist.surname ?? '',
                    slug: artwork.artist.slug ?? null,
                },
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

/**
 * Private helper — fetches key works from LandingArtistKeyWork, optionally
 * filtered to a specific artist, and resolves translations.
 */
async function fetchKeyWorks(artistId?: number): Promise<PresaleArtworkData[]> {
    const keyWorks = await prisma.landingArtistKeyWork.findMany({
        where: artistId !== undefined
            ? { presaleArtwork: { artistId } }
            : undefined,
        include: {
            presaleArtwork: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    order: true,
                    imageUrl: true,
                    mockupUrls: true,
                    artistId: true,
                    width: true,
                    height: true,
                    isSold: true,
                    artist: {
                        select: {
                            name: true,
                            surname: true,
                            slug: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            order: 'asc'
        }
    })

    if (keyWorks.length === 0) {
        return []
    }

    const presaleArtworks = keyWorks.map(kw => kw.presaleArtwork)
    const artworkIds = presaleArtworks.map(artwork => artwork.id)

    const allTranslations = await prisma.translation.findMany({
        where: {
            entityType: 'PresaleArtwork',
            entityId: { in: artworkIds }
        },
        include: {
            language: true
        }
    })

    const translationsByEntity = organizeTranslations(allTranslations)

    return presaleArtworks.map(artwork => {
        const artworkKey = `PresaleArtwork-${artwork.id}`
        const translations = {
            name: translationsByEntity[artworkKey]?.name || {},
            description: translationsByEntity[artworkKey]?.description || {}
        }

        let mockupUrls = artwork.mockupUrls
        if (mockupUrls) {
            try {
                if (typeof mockupUrls === 'string') mockupUrls = JSON.parse(mockupUrls)
            } catch {
                mockupUrls = []
            }
        }

        return {
            ...artwork,
            artist: {
                name: artwork.artist.name ?? '',
                surname: artwork.artist.surname ?? '',
                slug: artwork.artist.slug ?? null,
            },
            mockupUrls,
            translations
        }
    })
}

/**
 * Récupère les oeuvres phares (Key Works) sélectionnées pour la landing.
 * Ces oeuvres sont définies dans la table LandingArtistKeyWork.
 */
export async function getKeyWorksArtworks(): Promise<PresaleArtworkData[]> {
    try {
        return await fetchKeyWorks()
    } catch (error) {
        console.error('Erreur lors de la récupération des key works:', error)
        return []
    }
}

export async function getPresaleArtworkById(id: number): Promise<PresaleArtworkData | null> {
    try {
        const artwork = await prisma.presaleArtwork.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                order: true,
                imageUrl: true,
                mockupUrls: true,
                artistId: true,
                width: true,
                height: true,
                isSold: true,
                artist: {
                    select: {
                        name: true,
                        surname: true,
                        slug: true,
                    }
                }
            }
        })

        if (!artwork) return null

        let mockupUrls = artwork.mockupUrls
        if (mockupUrls) {
            try {
                if (typeof mockupUrls === 'string') mockupUrls = JSON.parse(mockupUrls)
            } catch {
                mockupUrls = []
            }
        }

        return { ...artwork, artist: { name: artwork.artist.name ?? '', surname: artwork.artist.surname ?? '', slug: artwork.artist.slug ?? null }, mockupUrls, translations: { name: {}, description: {} } }
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'artwork ${id}:`, error)
        return null
    }
}

export async function getPresaleArtworkBySlug(slug: string): Promise<PresaleArtworkData | null> {
    try {
        // Scan minimal : récupérer seulement id + name pour trouver la correspondance du slug
        const names = await prisma.presaleArtwork.findMany({ select: { id: true, name: true } })
        const match = names.find(a => toSlug(a.name) === slug)
        if (!match) return null

        const artwork = await prisma.presaleArtwork.findFirst({
            where: { id: match.id },
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                order: true,
                imageUrl: true,
                mockupUrls: true,
                artistId: true,
                width: true,
                height: true,
                isSold: true,
                artist: {
                    select: {
                        name: true,
                        surname: true,
                        slug: true,
                    }
                }
            }
        })

        if (!artwork) return null

        let mockupUrls = artwork.mockupUrls
        if (mockupUrls) {
            try {
                if (typeof mockupUrls === 'string') mockupUrls = JSON.parse(mockupUrls)
            } catch {
                mockupUrls = []
            }
        }

        const allTranslations = await prisma.translation.findMany({
            where: { entityType: 'PresaleArtwork', entityId: artwork.id },
            include: { language: true }
        })
        const translationsByEntity = organizeTranslations(allTranslations)
        const artworkKey = `PresaleArtwork-${artwork.id}`
        const translations = {
            name: translationsByEntity[artworkKey]?.name || {},
            description: translationsByEntity[artworkKey]?.description || {}
        }

        return { ...artwork, artist: { name: artwork.artist.name ?? '', surname: artwork.artist.surname ?? '', slug: artwork.artist.slug ?? null }, mockupUrls, translations }
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'artwork par slug "${slug}":`, error)
        return null
    }
}

export async function getTopArtworks(): Promise<PresaleArtworkData[]> {
    try {
        const artworks = await prisma.presaleArtwork.findMany({
            where: {
                isTopArtwork: true,
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
                width: true,
                height: true,
                isSold: true,
                artist: {
                    select: {
                        name: true,
                        surname: true,
                        slug: true,
                    },
                },
            },
            orderBy: {
                order: 'asc',
            },
        })

        return artworks.map(a => ({
            ...a,
            artist: {
                name: a.artist.name ?? '',
                surname: a.artist.surname ?? '',
                slug: a.artist.slug ?? null,
            },
            mockupUrls: null,
            translations: { name: {}, description: {} },
        }))
    } catch (error) {
        console.error('Erreur lors de la récupération des top artworks:', error)
        return []
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
                width: true,
                height: true,
                isSold: true,
                artist: {
                    select: {
                        name: true,
                        surname: true,
                        slug: true,
                    }
                }
            },
            orderBy: {
                displayOrder: 'asc'
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
                artist: {
                    name: artwork.artist.name ?? '',
                    surname: artwork.artist.surname ?? '',
                    slug: artwork.artist.slug ?? null,
                },
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

export async function getArtworksByLandingArtistSlug(
    slug: string,
    limit = 3
): Promise<Pick<PresaleArtworkData, 'id' | 'name' | 'imageUrl' | 'price' | 'isSold'>[]> {
    try {
        const artworks = await prisma.presaleArtwork.findMany({
            where: {
                artist: {
                    LandingArtist: {
                        some: { slug }
                    }
                }
            },
            select: {
                id: true,
                name: true,
                imageUrl: true,
                price: true,
                isSold: true,
            },
            orderBy: { order: 'asc' },
            take: limit,
        })
        return artworks
    } catch (error) {
        console.error(`[getArtworksByLandingArtistSlug] slug=${slug}:`, error)
        return []
    }
}

export async function getKeyWorksByArtistId(artistId: number): Promise<PresaleArtworkData[]> {
    try {
        return await fetchKeyWorks(artistId)
    } catch (error) {
        console.error(`Erreur lors de la récupération des key works pour l'artiste ${artistId}:`, error)
        return []
    }
}

export interface ArtistArtworkPreview {
    artistId: number
    imageUrl: string
}

export async function getArtworkPreviewsByArtistIds(artistIds: number[]): Promise<ArtistArtworkPreview[]> {
    try {
        const rows = await prisma.presaleArtwork.findMany({
            where: { artistId: { in: artistIds } },
            select: { artistId: true, imageUrl: true, order: true },
            orderBy: { order: 'asc' },
        })
        // Keep max 3 per artist
        const countPerArtist = new Map<number, number>()
        const result: ArtistArtworkPreview[] = []
        for (const r of rows) {
            const count = countPerArtist.get(r.artistId) ?? 0
            if (count < 3) {
                result.push({ artistId: r.artistId, imageUrl: r.imageUrl })
                countPerArtist.set(r.artistId, count + 1)
            }
        }
        return result
    } catch (error) {
        console.error('Erreur getArtworkPreviewsByArtistIds:', error)
        return []
    }
}