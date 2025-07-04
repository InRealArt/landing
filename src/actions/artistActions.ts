'use server'

import { prisma } from '@/lib/prisma'
import { organizeTranslations } from '@/utils/translations'

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
    artistId: number // ID de l'artiste dans la table Artist
    translations?: {
        intro?: Record<string, string>
        description?: Record<string, string>
        artworkStyle?: Record<string, string>
    }
}

export async function getArtists(isGallery?: boolean): Promise<ArtistData[]> {
    try {
        // Construire la condition de filtrage
        const whereCondition: any = {
            artistsPage: true
        }

        // Ajouter le filtre isGallery si fourni
        if (isGallery !== undefined) {
            whereCondition.artist = {
                isGallery
            }
        }

        // Récupérer les artistes de la landing page
        const landingArtists = await prisma.landingArtist.findMany({
            where: whereCondition,
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

        if (landingArtists.length === 0) {
            return []
        }

        // Récupérer les ID des artistes pour les requêtes groupées
        const artistIds = landingArtists.map(la => la.artistId)
        const landingArtistIds = landingArtists.map(la => la.id)

        // Récupérer toutes les traductions en une seule requête
        const allTranslations = await prisma.translation.findMany({
            where: {
                OR: [
                    {
                        entityType: 'LandingArtist',
                        entityId: { in: landingArtistIds }
                    }
                ]
            },
            include: {
                language: true
            }
        })

        // Organisation des traductions par entité et par champ
        const translationsByEntity = organizeTranslations(allTranslations)
        // Transformer les données pour correspondre à l'interface ArtistData
        const artists: ArtistData[] = landingArtists.map(la => {
            const landingArtistKey = `LandingArtist-${la.id}`

            // Organiser les traductions
            const translations = {
                intro: translationsByEntity[landingArtistKey]?.intro || {},
                description: translationsByEntity[landingArtistKey]?.description || {},
                artworkStyle: translationsByEntity[landingArtistKey]?.artworkStyle || {}
            }

            let artworkImages = la.artworkImages
            if (artworkImages) {
                try {
                    if (typeof artworkImages === 'string') {
                        artworkImages = JSON.parse(artworkImages)
                    }
                    if (Array.isArray(artworkImages)) {
                        artworkImages = artworkImages.map((artwork: any, index: number) => ({
                            ...artwork,
                            id: artwork.id || `artwork-${la.id}-${index}`
                        }))
                    }
                } catch (error) {
                    console.error('Error processing artworkImages:', error)
                    artworkImages = []
                }
            }

            return {
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
                artworkImages,
                artistId: la.artistId,
                translations
            }
        })

        return artists
    } catch (error) {
        console.error('Erreur lors de la récupération des artistes:', error)
        throw new Error('Impossible de récupérer les artistes')
    }
}

export async function getTestimonialArtists(): Promise<ArtistData[]> {
    try {
        // Récupérer les artistes avec leurs données de base (isGallery: false)
        const artists = await prisma.artist.findMany({
            where: {
                isGallery: false
            },
            select: {
                id: true,
                name: true,
                surname: true,
                imageUrl: true,
                LandingArtist: {
                    select: {
                        id: true,
                        slug: true,
                        imageUrl: true
                    }
                }
            }
        })

        // Transformer les données pour correspondre au besoin des testimonials
        const testimonialArtists: ArtistData[] = artists.map(artist => ({
            id: artist.LandingArtist[0]?.id || artist.id,
            slug: artist.LandingArtist[0]?.slug || '',
            name: artist.name,
            surname: artist.surname,
            pseudo: '',
            intro: null,
            description: null,
            artworkStyle: null,
            artistsPage: null,
            imageUrl: artist.LandingArtist[0]?.imageUrl || artist.imageUrl,
            backgroundImage: null,
            artworkImages: null,
            artistId: artist.id
        }))

        return testimonialArtists
    } catch (error) {
        console.error('Erreur lors de la récupération des artistes testimonials:', error)
        return []
    }
}

export async function getTestimonialGalleries(): Promise<ArtistData[]> {
    try {
        // Récupérer les galeries avec leurs données de base (isGallery: true)
        const galleries = await prisma.artist.findMany({
            where: {
                isGallery: true
            },
            select: {
                id: true,
                name: true,
                surname: true,
                imageUrl: true,
                LandingArtist: {
                    select: {
                        id: true,
                        slug: true,
                        imageUrl: true
                    }
                }
            }
        })

        // Transformer les données pour correspondre au besoin des testimonials
        const testimonialGalleries: ArtistData[] = galleries.map(gallery => ({
            id: gallery.LandingArtist[0]?.id || gallery.id,
            slug: gallery.LandingArtist[0]?.slug || '',
            name: gallery.name,
            surname: gallery.surname,
            pseudo: '',
            intro: null,
            description: null,
            artworkStyle: null,
            artistsPage: null,
            imageUrl: gallery.LandingArtist[0]?.imageUrl || gallery.imageUrl,
            backgroundImage: null,
            artworkImages: null,
            artistId: gallery.id
        }))

        return testimonialGalleries
    } catch (error) {
        console.error('Erreur lors de la récupération des galeries testimonials:', error)
        return []
    }
} 