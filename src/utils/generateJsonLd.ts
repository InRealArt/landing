import { SeoPost } from '@/store/useSeoPostStore'
import { ArtistData } from '@/actions/artistActions'
import { ArtWork } from '@/types/types'

interface JsonLdOptions {
    baseUrl?: string
    organizationName?: string
    logoUrl?: string
    logoWidth?: number
    logoHeight?: number
}

/**
 * Génère le JSON-LD optimisé pour un article de blog
 */
export function generateArticleJsonLd(
    post: SeoPost,
    options: JsonLdOptions = {}
): string {
    const {
        baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com',
        organizationName = 'In Real Art',
        logoUrl = '/icons/Logo.png',
        logoWidth = 101,
        logoHeight = 32
    } = options

    const articleUrl = `${baseUrl}/blog/${post.slug}`
    const logoFullUrl = logoUrl.startsWith('http') ? logoUrl : `${baseUrl}${logoUrl}`

    // Calculer le nombre de mots approximatif
    const wordCount = post.content ? post.content.split(/\s+/).length : 0

    // Générer les entités "about" basées sur les tags
    const aboutEntities = post.listTags.map(tag => ({
        "@type": "Thing",
        "name": tag,
        "description": `Article en relation avec ${tag.toLowerCase()}`
    }))

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.metaDescription,
        "image": post.mainImageUrl ? [post.mainImageUrl] : [],
        "datePublished": post.createdAt.toISOString(),
        "dateModified": post.updatedAt.toISOString(),
        "author": {
            "@type": "Person",
            "name": post.author,
            ...(post.authorLink && { "url": post.authorLink })
        },
        "publisher": {
            "@type": "Organization",
            "name": organizationName,
            "logo": {
                "@type": "ImageObject",
                "url": logoFullUrl,
                "width": logoWidth,
                "height": logoHeight
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": articleUrl
        },
        "articleSection": post.category.name,
        "keywords": post.listTags.join(", "),
        ...(wordCount > 0 && { "wordCount": wordCount }),
        ...(post.estimatedReadTime && { "timeRequired": `PT${post.estimatedReadTime}M` }),
        "inLanguage": post.languageId === 1 ? "fr-FR" : "en-US", // Ajustez selon votre logique
        ...(aboutEntities.length > 0 && { "about": aboutEntities })
    }

    return JSON.stringify(jsonLd, null, 2)
}

/**
 * Génère le JSON-LD pour un article sur un artiste
 */
export function generateArtistArticleJsonLd(
    post: SeoPost,
    artistInfo: {
        name: string
        jobTitle?: string
        description?: string
        url?: string
    },
    options: JsonLdOptions = {}
): string {
    const {
        baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com',
        organizationName = 'In Real Art',
        logoUrl = '/icons/Logo.png'
    } = options

    const articleUrl = `${baseUrl}/blog/${post.slug}`
    const logoFullUrl = logoUrl.startsWith('http') ? logoUrl : `${baseUrl}${logoUrl}`

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.metaDescription,
        "image": post.mainImageUrl ? [post.mainImageUrl] : [],
        "datePublished": post.createdAt.toISOString(),
        "dateModified": post.updatedAt.toISOString(),
        "author": {
            "@type": "Person",
            "name": post.author,
            ...(post.authorLink && { "url": post.authorLink })
        },
        "publisher": {
            "@type": "Organization",
            "name": organizationName,
            "logo": {
                "@type": "ImageObject",
                "url": logoFullUrl
            }
        },
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": articleUrl
        },
        "about": {
            "@type": "Person",
            "name": artistInfo.name,
            ...(artistInfo.jobTitle && { "jobTitle": artistInfo.jobTitle }),
            ...(artistInfo.description && { "description": artistInfo.description }),
            ...(artistInfo.url && { "url": artistInfo.url })
        },
        "articleSection": post.category.name,
        "keywords": post.listTags.join(", "),
        "inLanguage": post.languageId === 1 ? "fr-FR" : "en-US"
    }

    return JSON.stringify(jsonLd, null, 2)
}

/**
 * Génère le JSON-LD pour un breadcrumb
 */
export function generateBreadcrumbJsonLd(
    postTitle: string,
    options: JsonLdOptions = {}
): string {
    const {
        baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'
    } = options

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Accueil",
                "item": baseUrl
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": `${baseUrl}/blog`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": postTitle
            }
        ]
    }

    return JSON.stringify(jsonLd, null, 2)
}

/**
 * Génère le JSON-LD pour une page de liste d'articles (Blog)
 */
export function generateBlogListJsonLd(
    posts: SeoPost[],
    options: JsonLdOptions = {}
): string {
    const {
        baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com',
        organizationName = 'In Real Art'
    } = options

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": `${organizationName} Blog`,
        "description": "Articles et actualités sur l'art, la blockchain et l'investissement artistique",
        "url": `${baseUrl}/blog`,
        "publisher": {
            "@type": "Organization",
            "name": organizationName
        },
        "blogPost": posts.slice(0, 10).map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.metaDescription,
            "url": `${baseUrl}/blog/${post.slug}`,
            "datePublished": post.createdAt.toISOString(),
            "author": {
                "@type": "Person",
                "name": post.author
            }
        }))
    }

    return JSON.stringify(jsonLd, null, 2)
}

/**
 * Valide et nettoie le JSON-LD
 */
export function validateJsonLd(jsonLdString: string): boolean {
    try {
        const parsed = JSON.parse(jsonLdString)

        // Vérifications basiques
        if (!parsed["@context"] || !parsed["@type"]) {
            return false
        }

        // Pour les articles, vérifier les champs obligatoires
        if (parsed["@type"] === "Article") {
            return !!(parsed.headline && parsed.author && parsed.publisher)
        }

        return true
    } catch (error) {
        console.error('JSON-LD invalide:', error)
        return false
    }
}

/**
 * Exemple d'utilisation pour générer le JSON-LD d'un post
 */
export function generatePostJsonLd(post: SeoPost): string {
    // Détecter le type d'article basé sur les tags ou le contenu
    const isArtistArticle = post.listTags.some(tag =>
        tag.toLowerCase().includes('artiste') ||
        tag.toLowerCase().includes('artist')
    )

    if (isArtistArticle) {
        // Extraire le nom de l'artiste du titre (logique à adapter)
        const artistName = extractArtistNameFromTitle(post.title)

        return generateArtistArticleJsonLd(post, {
            name: artistName,
            jobTitle: "Artiste contemporain",
            description: `Artiste présenté sur ${process.env.NEXT_PUBLIC_SITE_URL}`,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/artists/${artistName.toLowerCase().replace(/\s+/g, '-')}`
        })
    }

    return generateArticleJsonLd(post)
}

/**
 * Génère le JSON-LD Schema Person enrichi pour une page artiste (point 3 du template SEO)
 */
export function generateArtistPersonJsonLd(
    artist: ArtistData,
    baseUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'
): string {
    const artistName = `${artist.name} ${artist.surname}`
    const artistUrl = `${baseUrl}/artists/${artist.slug}`

    const personData: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: artistName,
        url: artistUrl,
        worksFor: {
            '@type': 'Organization',
            name: 'InRealArt',
            url: baseUrl
        }
    }

    if (artist.pseudo) {
        personData.alternateName = artist.pseudo
    }

    if (artist.artworkStyle) {
        personData.jobTitle = artist.artworkStyle
    }

    if (artist.intro || artist.description) {
        personData.description = (artist.intro || artist.description || '').replace(/<[^>]*>/g, '').slice(0, 200)
    }

    if (artist.imageUrl) {
        personData.image = artist.imageUrl
    }

    if (artist.birthYear) {
        personData.birthDate = String(artist.birthYear)
    }

    if (artist.countryName || artist.countryCode) {
        personData.nationality = {
            '@type': 'Country',
            name: artist.countryName || artist.countryCode
        }
    }

    if (artist.mediumTags && artist.mediumTags.length > 0) {
        personData.knowsAbout = artist.mediumTags
        personData.hasOccupation = {
            '@type': 'Occupation',
            name: artist.artworkStyle || 'Artiste',
            occupationalCategory: 'Arts visuels'
        }
    }

    return JSON.stringify(personData)
}

/**
 * Génère le JSON-LD Schema VisualArtwork pour les œuvres d'un artiste (point 3 du template SEO)
 */
export function generateArtistVisualArtworksJsonLd(
    artworks: ArtWork[],
    artistName: string,
    artistSlug: string,
    baseUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'
): string {
    const artistUrl = `${baseUrl}/artists/${artistSlug}`

    const items = artworks.slice(0, 10).map(artwork => {
        const name = artwork.name.FR || artwork.name.EN || Object.values(artwork.name)[0] || ''
        const item: Record<string, unknown> = {
            '@context': 'https://schema.org',
            '@type': 'VisualArtwork',
            name,
            creator: {
                '@type': 'Person',
                name: artistName,
                url: artistUrl
            }
        }

        if (artwork.image) {
            item.image = {
                '@type': 'ImageObject',
                url: artwork.image
            }
        }

        if (artwork.width) {
            item.width = {
                '@type': 'QuantitativeValue',
                value: artwork.width,
                unitCode: 'CMT'
            }
        }

        if (artwork.height) {
            item.height = {
                '@type': 'QuantitativeValue',
                value: artwork.height,
                unitCode: 'CMT'
            }
        }

        if (artwork.price && !artwork.isSold) {
            item.offers = {
                '@type': 'Offer',
                price: artwork.price,
                priceCurrency: 'EUR',
                availability: 'https://schema.org/InStock',
                seller: {
                    '@type': 'Organization',
                    name: 'InRealArt'
                }
            }
        }

        return item
    })

    if (items.length === 0) return ''

    if (items.length === 1) return JSON.stringify(items[0])

    return JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': items
    })
}

/**
 * Génère le JSON-LD BreadcrumbList pour une page artiste (point 3 du template SEO)
 */
export function generateArtistBreadcrumbJsonLd(
    artistName: string,
    artistSlug: string,
    baseUrl: string = process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'
): string {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Accueil',
                item: baseUrl
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Artistes',
                item: `${baseUrl}/artists`
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: artistName,
                item: `${baseUrl}/artists/${artistSlug}`
            }
        ]
    })
}

/**
 * Fonction utilitaire pour extraire le nom d'un artiste du titre
 */
function extractArtistNameFromTitle(title: string): string {
    // Logique simple - à adapter selon vos conventions de titres
    const patterns = [
        /Découvrez l'univers artistique de (.+)/i,
        /(.+) : artiste/i,
        /L'art de (.+)/i,
        /(.+), artiste/i
    ]

    for (const pattern of patterns) {
        const match = title.match(pattern)
        if (match && match[1]) {
            return match[1].trim()
        }
    }

    // Fallback : retourner le titre sans mots-clés communs
    return title
        .replace(/découvrez|l'univers|artistique|de|artiste|art/gi, '')
        .trim()
} 