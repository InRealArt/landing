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
    countryCode?: string | null
    countryName?: string | null
    mediumTags?: string[]
    birthYear?: number | null
    quoteFromInRealArt?: string | null
    biographyHeader1?: string | null
    biographyText1?: string | null
    biographyHeader2?: string | null
    biographyText2?: string | null
    biographyHeader3?: string | null
    biographyText3?: string | null
    biographyHeader4?: string | null
    biographyText4?: string | null
    translations?: {
        intro?: Record<string, string>
        description?: Record<string, string>
        artworkStyle?: Record<string, string>
        quoteFromInRealArt?: Record<string, string>
        biographyHeader1?: Record<string, string>
        biographyText1?: Record<string, string>
        biographyHeader2?: Record<string, string>
        biographyText2?: Record<string, string>
        biographyHeader3?: Record<string, string>
        biographyText3?: Record<string, string>
        biographyHeader4?: Record<string, string>
        biographyText4?: Record<string, string>
    }
}

export async function getArtists(isGallery?: boolean): Promise<ArtistData[]> {
    try {
        // Construire la condition de filtrage
        const whereCondition: any = {
            artistsPage: true
        }

        // Ajouter le filtre isGallery si fourni
        // isGallery: true = galeries, isGallery: false = artistes individuels
        if (isGallery !== undefined) {
            whereCondition.artist = {
                isGallery: isGallery
            }
        }

        // console.log('Filtrage getArtists - isGallery:', isGallery, 'whereCondition:', JSON.stringify(whereCondition))

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
                mediumTags: true,
                quoteFromInRealArt: true,
                biographyHeader1: true,
                biographyText1: true,
                biographyHeader2: true,
                biographyText2: true,
                biographyHeader3: true,
                biographyText3: true,
                biographyHeader4: true,
                biographyText4: true,
                artist: {
                    select: {
                        name: true,
                        surname: true,
                        description: true,
                        pseudo: true,
                        backgroundImage: true,
                        isGallery: true,
                        countryCode: true,
                        birthYear: true,
                        Country: {
                            select: {
                                code: true,
                                name: true
                            }
                        }
                    }
                }
            }
        })

        console.log(`Récupération de ${landingArtists.length} artistes avec isGallery=${isGallery}`)

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
                artworkStyle: translationsByEntity[landingArtistKey]?.artworkStyle || {},
                quoteFromInRealArt: translationsByEntity[landingArtistKey]?.quoteFromInRealArt || {},
                biographyHeader1: translationsByEntity[landingArtistKey]?.biographyHeader1 || {},
                biographyText1: translationsByEntity[landingArtistKey]?.biographyText1 || {},
                biographyHeader2: translationsByEntity[landingArtistKey]?.biographyHeader2 || {},
                biographyText2: translationsByEntity[landingArtistKey]?.biographyText2 || {},
                biographyHeader3: translationsByEntity[landingArtistKey]?.biographyHeader3 || {},
                biographyText3: translationsByEntity[landingArtistKey]?.biographyText3 || {},
                biographyHeader4: translationsByEntity[landingArtistKey]?.biographyHeader4 || {},
                biographyText4: translationsByEntity[landingArtistKey]?.biographyText4 || {}
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
                countryCode: la.artist.countryCode ?? null,
                countryName: la.artist.Country?.name ?? null,
                mediumTags: la.mediumTags ?? [],
                birthYear: la.artist.birthYear ?? null,
                quoteFromInRealArt: la.quoteFromInRealArt ?? null,
                biographyHeader1: la.biographyHeader1 ?? null,
                biographyText1: la.biographyText1 ?? null,
                biographyHeader2: la.biographyHeader2 ?? null,
                biographyText2: la.biographyText2 ?? null,
                biographyHeader3: la.biographyHeader3 ?? null,
                biographyText3: la.biographyText3 ?? null,
                biographyHeader4: la.biographyHeader4 ?? null,
                biographyText4: la.biographyText4 ?? null,
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

export async function getArtistById(artistId: number): Promise<ArtistData | null> {
    try {
        // Récupérer l'artiste et son LandingArtist associé
        const landingArtist = await prisma.landingArtist.findFirst({
            where: {
                artistId: artistId,
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
                mediumTags: true,
                quoteFromInRealArt: true,
                biographyHeader1: true,
                biographyText1: true,
                biographyHeader2: true,
                biographyText2: true,
                biographyHeader3: true,
                biographyText3: true,
                biographyHeader4: true,
                biographyText4: true,
                artist: {
                    select: {
                        name: true,
                        surname: true,
                        description: true,
                        pseudo: true,
                        backgroundImage: true,
                        isGallery: true,
                        countryCode: true,
                        birthYear: true,
                        Country: {
                            select: {
                                code: true,
                                name: true
                            }
                        }
                    }
                }
            }
        })

        if (!landingArtist) {
            return null
        }

        // Récupérer les traductions pour cet artiste
        const allTranslations = await prisma.translation.findMany({
            where: {
                entityType: 'LandingArtist',
                entityId: landingArtist.id
            },
            include: {
                language: true
            }
        })

        // Organisation des traductions par entité et par champ
        const translationsByEntity = organizeTranslations(allTranslations)
        const landingArtistKey = `LandingArtist-${landingArtist.id}`

        // Organiser les traductions
        const translations = {
            intro: translationsByEntity[landingArtistKey]?.intro || {},
            description: translationsByEntity[landingArtistKey]?.description || {},
            artworkStyle: translationsByEntity[landingArtistKey]?.artworkStyle || {},
            quoteFromInRealArt: translationsByEntity[landingArtistKey]?.quoteFromInRealArt || {},
            biographyHeader1: translationsByEntity[landingArtistKey]?.biographyHeader1 || {},
            biographyText1: translationsByEntity[landingArtistKey]?.biographyText1 || {},
            biographyHeader2: translationsByEntity[landingArtistKey]?.biographyHeader2 || {},
            biographyText2: translationsByEntity[landingArtistKey]?.biographyText2 || {},
            biographyHeader3: translationsByEntity[landingArtistKey]?.biographyHeader3 || {},
            biographyText3: translationsByEntity[landingArtistKey]?.biographyText3 || {},
            biographyHeader4: translationsByEntity[landingArtistKey]?.biographyHeader4 || {},
            biographyText4: translationsByEntity[landingArtistKey]?.biographyText4 || {}
        }

        // Traitement des artworkImages
        let artworkImages = landingArtist.artworkImages
        if (artworkImages) {
            try {
                if (typeof artworkImages === 'string') {
                    artworkImages = JSON.parse(artworkImages)
                }
                if (Array.isArray(artworkImages)) {
                    artworkImages = artworkImages.map((artwork: any, index: number) => ({
                        ...artwork,
                        id: artwork.id || `artwork-${landingArtist.id}-${index}`
                    }))
                }
            } catch (error) {
                console.error('Error processing artworkImages:', error)
                artworkImages = []
            }
        }

        return {
            id: landingArtist.id,
            slug: landingArtist.slug,
            name: landingArtist.artist.name,
            surname: landingArtist.artist.surname,
            pseudo: landingArtist.artist.pseudo,
            intro: landingArtist.intro,
            artworkStyle: landingArtist.artworkStyle,
            artistsPage: landingArtist.artistsPage,
            imageUrl: landingArtist.imageUrl,
            description: landingArtist.artist.description,
            backgroundImage: landingArtist.artist.backgroundImage,
            artworkImages,
            artistId: landingArtist.artistId,
            countryCode: landingArtist.artist.countryCode ?? null,
            countryName: landingArtist.artist.Country?.name ?? null,
            mediumTags: landingArtist.mediumTags ?? [],
            birthYear: landingArtist.artist.birthYear ?? null,
            quoteFromInRealArt: landingArtist.quoteFromInRealArt ?? null,
            biographyHeader1: landingArtist.biographyHeader1 ?? null,
            biographyText1: landingArtist.biographyText1 ?? null,
            biographyHeader2: landingArtist.biographyHeader2 ?? null,
            biographyText2: landingArtist.biographyText2 ?? null,
            biographyHeader3: landingArtist.biographyHeader3 ?? null,
            biographyText3: landingArtist.biographyText3 ?? null,
            biographyHeader4: landingArtist.biographyHeader4 ?? null,
            biographyText4: landingArtist.biographyText4 ?? null,
            translations
        }
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'artiste avec l'ID ${artistId}:`, error)
        return null
    }
}

export async function getArtistsByCategory(categorySlug: string): Promise<ArtistData[]> {
    try {
        // Décoder l'URL et récupérer la catégorie par son nom (en attendant la migration pour le slug)
        const decodedSlug = decodeURIComponent(categorySlug)
        const category = await prisma.artistCategory.findFirst({
            where: {
                name: {
                    equals: decodedSlug,
                    mode: 'insensitive'
                }
            },
            select: {
                id: true
            }
        })

        if (!category) {
            return []
        }

        // Récupérer les artistes de cette catégorie via la table de liaison
        const artistCategoryRelations = await prisma.artistCategoryArtist.findMany({
            where: {
                categoryId: category.id
            },
            select: {
                landingArtistId: true
            }
        })

        const landingArtistIds = artistCategoryRelations.map(relation => relation.landingArtistId)

        if (landingArtistIds.length === 0) {
            return []
        }

        // Récupérer les LandingArtists correspondants
        const landingArtists = await prisma.landingArtist.findMany({
            where: {
                id: { in: landingArtistIds },
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
                mediumTags: true,
                quoteFromInRealArt: true,
                biographyHeader1: true,
                biographyText1: true,
                biographyHeader2: true,
                biographyText2: true,
                biographyHeader3: true,
                biographyText3: true,
                biographyHeader4: true,
                biographyText4: true,
                artist: {
                    select: {
                        name: true,
                        surname: true,
                        description: true,
                        pseudo: true,
                        backgroundImage: true,
                        isGallery: true,
                        countryCode: true,
                        birthYear: true,
                        Country: {
                            select: {
                                code: true,
                                name: true
                            }
                        }
                    }
                }
            }
        })

        if (landingArtists.length === 0) {
            return []
        }

        // Récupérer les traductions
        const allTranslations = await prisma.translation.findMany({
            where: {
                entityType: 'LandingArtist',
                entityId: { in: landingArtistIds }
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
                artworkStyle: translationsByEntity[landingArtistKey]?.artworkStyle || {},
                quoteFromInRealArt: translationsByEntity[landingArtistKey]?.quoteFromInRealArt || {},
                biographyHeader1: translationsByEntity[landingArtistKey]?.biographyHeader1 || {},
                biographyText1: translationsByEntity[landingArtistKey]?.biographyText1 || {},
                biographyHeader2: translationsByEntity[landingArtistKey]?.biographyHeader2 || {},
                biographyText2: translationsByEntity[landingArtistKey]?.biographyText2 || {},
                biographyHeader3: translationsByEntity[landingArtistKey]?.biographyHeader3 || {},
                biographyText3: translationsByEntity[landingArtistKey]?.biographyText3 || {},
                biographyHeader4: translationsByEntity[landingArtistKey]?.biographyHeader4 || {},
                biographyText4: translationsByEntity[landingArtistKey]?.biographyText4 || {}
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
                countryCode: la.artist.countryCode ?? null,
                countryName: la.artist.Country?.name ?? null,
                mediumTags: la.mediumTags ?? [],
                birthYear: la.artist.birthYear ?? null,
                translations
            }
        })

        return artists
    } catch (error) {
        console.error('Erreur lors de la récupération des artistes par catégorie:', error)
        return []
    }
} 