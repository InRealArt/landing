import { SeoPost } from '@/types/seoPost'
import { ArtistData } from '@/actions/artistActions'
import type { PresaleArtworkData } from '@/actions/presaleArtworkActions'
import { getArtistDisplayName } from '@/utils/artistDisplayName'
import { serializeJsonLd, toJsonLdUrl, toPlainText } from '@/utils/jsonLd'
import { toSlug } from '@/utils/slug'
import { getImageUrl } from '@/lib/cloufare/r2/url'

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inrealart.com'

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
        baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inrealart.com',
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

    return serializeJsonLd(jsonLd)
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
        baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inrealart.com',
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

    return serializeJsonLd(jsonLd)
}

/**
 * Génère le JSON-LD pour un breadcrumb
 */
export function generateBreadcrumbJsonLd(
    postTitle: string,
    options: JsonLdOptions = {}
): string {
    const {
        baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inrealart.com'
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

    return serializeJsonLd(jsonLd)
}

/**
 * Génère le JSON-LD pour une page de liste d'articles (Blog)
 */
export function generateBlogListJsonLd(
    posts: SeoPost[],
    options: JsonLdOptions = {}
): string {
    const {
        baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inrealart.com',
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

    return serializeJsonLd(jsonLd)
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
 * Génère le JSON-LD Schema Person enrichi pour une page artiste (IRA-02)
 * `name` = nom d'usage (pseudo s'il existe), `alternateName` = nom civil s'il diffère.
 */
export function generateArtistPersonJsonLd(
    artist: ArtistData,
    baseUrl: string = DEFAULT_BASE_URL
): string {
    const displayName = getArtistDisplayName(artist)
    const legalName = [artist.name, artist.surname].filter(Boolean).join(' ').trim()
    const artistUrl = `${baseUrl}/artists/${artist.slug}`

    const personData: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${artistUrl}#person`,
        name: displayName,
        url: artistUrl,
        worksFor: {
            '@type': 'Organization',
            name: 'InRealArt',
            url: baseUrl
        }
    }

    if (legalName && legalName !== displayName) {
        personData.alternateName = legalName
    }

    if (artist.sameAs && artist.sameAs.length > 0) {
        personData.sameAs = artist.sameAs
    }

    if (artist.artworkStyle) {
        personData.jobTitle = artist.artworkStyle
    }

    const description = toPlainText(artist.intro || artist.description)
    if (description) {
        personData.description = description.slice(0, 300)
    }

    const image = toJsonLdUrl(getImageUrl(artist.imageUrl))
    if (image) {
        personData.image = image
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

    return serializeJsonLd(personData)
}

/**
 * Objet schema.org VisualArtwork (+ Offer) d'une œuvre du catalogue, partagé par la fiche
 * œuvre et la fiche artiste. Offer : prix > 0 → prix en EUR ; sinon « sur demande » (sans prix).
 */
export function buildVisualArtwork(
    artwork: PresaleArtworkData,
    creator: { name: string; url?: string },
    baseUrl: string = DEFAULT_BASE_URL
): Record<string, unknown> {
    const url = `${baseUrl}/artwork/${toSlug(artwork.name)}`
    const item: Record<string, unknown> = {
        '@type': 'VisualArtwork',
        '@id': `${url}#artwork`,
        name: artwork.name,
        url,
        creator: {
            '@type': 'Person',
            name: creator.name,
            ...(creator.url && { url: creator.url })
        }
    }

    const description = toPlainText(artwork.description)
    if (description) item.description = description.slice(0, 500)

    const image = toJsonLdUrl(getImageUrl(artwork.imageUrl))
    if (image) item.image = image

    if (artwork.width) {
        item.width = { '@type': 'QuantitativeValue', value: artwork.width, unitCode: 'CMT' }
    }
    if (artwork.height) {
        item.height = { '@type': 'QuantitativeValue', value: artwork.height, unitCode: 'CMT' }
    }

    const offer: Record<string, unknown> = {
        '@type': 'Offer',
        url,
        priceCurrency: 'EUR',
        availability: artwork.isSold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
        seller: { '@type': 'Organization', name: 'InRealArt', url: baseUrl }
    }
    if (artwork.price && artwork.price > 0) offer.price = artwork.price
    // Sans prix, une Offer est invalide pour Google : on ne la publie que si l'œuvre a un prix ou est vendue
    if (offer.price || artwork.isSold) item.offers = offer

    return item
}

/**
 * Génère le JSON-LD VisualArtwork pour la fiche œuvre (IRA-02)
 */
export function generateArtworkJsonLd(
    artwork: PresaleArtworkData,
    creator: { name: string; url?: string },
    baseUrl: string = DEFAULT_BASE_URL
): string {
    return serializeJsonLd({
        '@context': 'https://schema.org',
        ...buildVisualArtwork(artwork, creator, baseUrl)
    })
}

/**
 * Génère le JSON-LD BreadcrumbList pour la fiche œuvre : Accueil > Catalogue > (artiste) > œuvre
 */
export function generateArtworkBreadcrumbJsonLd(
    artworkName: string,
    artworkSlug: string,
    artist?: { name: string; slug: string | null },
    baseUrl: string = DEFAULT_BASE_URL
): string {
    const items = [
        { name: 'Accueil', item: baseUrl },
        { name: 'Catalogue', item: `${baseUrl}/presale` },
        ...(artist?.slug ? [{ name: artist.name, item: `${baseUrl}/artists/${artist.slug}` }] : []),
        { name: artworkName, item: `${baseUrl}/artwork/${artworkSlug}` }
    ]
    return serializeJsonLd({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((entry, index) => ({ '@type': 'ListItem', position: index + 1, ...entry }))
    })
}

/**
 * Génère le JSON-LD VisualArtwork pour les œuvres d'un artiste (fiche artiste)
 */
export function generateArtistVisualArtworksJsonLd(
    artworks: PresaleArtworkData[],
    artistName: string,
    artistSlug: string,
    baseUrl: string = DEFAULT_BASE_URL
): string {
    const creator = { name: artistName, url: `${baseUrl}/artists/${artistSlug}` }
    const items = artworks.slice(0, 10).map(artwork => buildVisualArtwork(artwork, creator, baseUrl))

    if (items.length === 0) return ''

    if (items.length === 1) return serializeJsonLd({ '@context': 'https://schema.org', ...items[0] })

    return serializeJsonLd({
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
    baseUrl: string = DEFAULT_BASE_URL
): string {
    return serializeJsonLd({
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