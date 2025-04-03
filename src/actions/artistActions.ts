'use server'

import { prisma } from '@/lib/prisma'

export interface ArtistData {
    id: number
    slug: string
    name: string
    surname: string
    pseudo: string
    intro: string | null
    description: string | null
    artworkStyle: string | null
    artistsPage: boolean | null
    imageUrl: string
    backgroundImage: string | null
    artworkImages: any | null // Stocké comme JSON dans la base de données
    translations?: {
        intro?: Record<string, string>
        description?: Record<string, string>
        artworkStyle?: Record<string, string>
    }
}

export async function getArtists(): Promise<ArtistData[]> {
    try {
        const landingArtists = await prisma.landingArtist.findMany({
            where: {
                artistsPage: true
            },
            select: {
                id: true,
                slug: true,
                intro: true,
                artworkImages: true,
                artworkStyle: true,
                artistsPage: true,
                imageUrl: true,
                artistId: true,
                artist: {
                    select: {
                        name: true,
                        surname: true,
                        description: true,
                        pseudo: true,
                        backgroundImage: true,
                        isGallery: true
                    }
                }
            }
        })

        // Récupérer les langues disponibles
        const languages = await prisma.language.findMany()

        // Transformer les données pour correspondre à l'interface ArtistData
        const artists: ArtistData[] = []

        for (const la of landingArtists) {
            // Récupérer les traductions pour cet artiste
            const landingArtistTranslations = await prisma.translation.findMany({
                where: {
                    entityType: 'LandingArtist',
                    entityId: la.id
                },
                include: {
                    language: true
                }
            })

            const artistTranslations = await prisma.translation.findMany({
                where: {
                    entityType: 'Artist',
                    entityId: la.artistId
                },
                include: {
                    language: true
                }
            })

            // Organiser les traductions par champ et par langue
            const translations = {
                intro: {},
                description: {},
                artworkStyle: {}
            }

            // Ajouter les traductions de LandingArtist
            landingArtistTranslations.forEach(t => {
                translations[t.field as keyof typeof translations] = {
                    ...translations[t.field as keyof typeof translations],
                    [t.language.code]: t.value
                }
            })

            artists.push({
                id: la.id,
                slug: la.slug,
                name: la.artist.name,
                surname: la.artist.surname,
                pseudo: la.artist.pseudo,
                intro: la.intro,
                artworkStyle: la.artworkStyle,
                artistsPage: la.artistsPage,
                imageUrl: la.imageUrl,
                description: la.artist.description,
                backgroundImage: la.artist.backgroundImage,
                artworkImages: la.artworkImages,
                translations
            })
        }

        return artists
    } catch (error) {
        console.error('Erreur lors de la récupération des artistes:', error)
        throw new Error('Impossible de récupérer les artistes')
    }
} 