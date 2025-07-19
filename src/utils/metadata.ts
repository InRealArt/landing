import { Metadata } from 'next'

// Base configuration
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'
export const SITE_NAME = 'InRealArt'
export const SITE_DESCRIPTION = 'RWA: Elevating Art, Empowering Change'
export const DEFAULT_OG_IMAGE = '/opengraph-image.png'

// SEO metadata types
export interface PageMetadata {
  title: string
  description: string
  keywords?: string[]
  image?: string
  imageAlt?: string
  noIndex?: boolean
  canonical?: string
  alternateLanguages?: { [key: string]: string }
  structuredData?: object
}

export interface DynamicPageMetadata extends PageMetadata {
  slug?: string
  id?: string
  publishDate?: string
  modifiedDate?: string
  author?: string
  section?: string
  tags?: string[]
}

/**
 * Generate basic metadata for static pages
 */
export function generateStaticMetadata(
  pageData: PageMetadata,
  locale: string = 'fr'
): Metadata {
  const {
    title,
    description,
    keywords,
    image = DEFAULT_OG_IMAGE,
    imageAlt = `${SITE_NAME} - ${title}`,
    noIndex = false,
    canonical,
    alternateLanguages = {}
  } = pageData

  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords?.join(', '),
    
    // Basic meta tags
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url: canonical || BASE_URL,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          alt: imageAlt,
          width: 1200,
          height: 630
        }
      ],
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website'
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl]
    },

    // Canonical URL
    alternates: {
      canonical: canonical || BASE_URL,
      languages: alternateLanguages
    }
  }

  return metadata
}

/**
 * Generate metadata for dynamic pages (blog posts, artist pages, etc.)
 */
export function generateDynamicMetadata(
  pageData: DynamicPageMetadata,
  pageType: 'article' | 'profile' | 'product' = 'article',
  locale: string = 'fr'
): Metadata {
  const {
    title,
    description,
    keywords,
    image = DEFAULT_OG_IMAGE,
    imageAlt = `${SITE_NAME} - ${title}`,
    noIndex = false,
    canonical,
    alternateLanguages = {},
    publishDate,
    modifiedDate,
    author,
    section,
    tags
  } = pageData

  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const imageUrl = image.startsWith('http') ? image : `${BASE_URL}${image}`

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords?.join(', ') || tags?.join(', '),
    
    // Authors
    ...(author && { authors: [{ name: author }] }),

    // Basic meta tags
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      url: canonical || BASE_URL,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          alt: imageAlt,
          width: 1200,
          height: 630
        }
      ],
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type: pageType === 'article' ? 'article' : 'website',
      ...(pageType === 'article' && {
        publishedTime: publishDate,
        modifiedTime: modifiedDate,
        authors: author ? [author] : undefined,
        section: section,
        tags: tags
      })
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl]
    },

    // Canonical URL and alternates
    alternates: {
      canonical: canonical || BASE_URL,
      languages: alternateLanguages
    }
  }

  return metadata
}

/**
 * Generate JSON-LD structured data for Organization
 */
export function generateOrganizationJsonLd(): string {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/icons/Logo.png`,
      width: 101,
      height: 32
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'teaminrealart@gmail.com',
      contactType: 'customer service'
    },
    sameAs: [
      'https://www.linkedin.com/company/inrealart/',
      'https://www.instagram.com/inrealart/',
      'https://twitter.com/inrealart',
      'https://www.facebook.com/inrealart'
    ]
  }

  return JSON.stringify(organizationData)
}

/**
 * Generate JSON-LD structured data for WebSite
 */
export function generateWebSiteJsonLd(): string {
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }

  return JSON.stringify(websiteData)
}

/**
 * Generate JSON-LD structured data for Person (Artist)
 */
export function generatePersonJsonLd(
  name: string,
  jobTitle: string = 'Artist',
  description?: string,
  image?: string,
  url?: string
): string {
  const personData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    ...(description && { description }),
    ...(image && { image: image.startsWith('http') ? image : `${BASE_URL}${image}` }),
    ...(url && { url }),
    worksFor: {
      '@type': 'Organization',
      name: SITE_NAME
    }
  }

  return JSON.stringify(personData)
}

/**
 * Generate JSON-LD structured data for Creative Work (Artwork)
 */
export function generateCreativeWorkJsonLd(
  name: string,
  description: string,
  image: string,
  creator: string,
  dateCreated?: string,
  medium?: string,
  dimensions?: string
): string {
  const creativeWorkData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    image: image.startsWith('http') ? image : `${BASE_URL}${image}`,
    creator: {
      '@type': 'Person',
      name: creator
    },
    ...(dateCreated && { dateCreated }),
    ...(medium && { artMedium: medium }),
    ...(dimensions && { size: dimensions })
  }

  return JSON.stringify(creativeWorkData)
}

/**
 * Generate JSON-LD structured data for FAQ Page
 */
export function generateFAQJsonLd(
  faqs: { question: string; answer: string }[]
): string {
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }

  return JSON.stringify(faqData)
}

/**
 * Generate JSON-LD structured data for Collection Page
 */
export function generateCollectionJsonLd(
  name: string,
  description: string,
  items: { name: string; url: string }[]
): string {
  const collectionData = {
    '@context': 'https://schema.org',
    '@type': 'Collection',
    name,
    description,
    hasPart: items.map(item => ({
      '@type': 'CreativeWork',
      name: item.name,
      url: item.url
    }))
  }

  return JSON.stringify(collectionData)
}

/**
 * Generate breadcrumb JSON-LD
 */
export function generateBreadcrumbJsonLd(
  breadcrumbs: { name: string; url?: string }[]
): string {
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      ...(breadcrumb.url && { item: breadcrumb.url })
    }))
  }

  return JSON.stringify(breadcrumbData)
}

/**
 * Get default metadata for pages
 */
export const defaultMetadata = {
  home: {
    title: 'InRealArt - La Tokenisation de l\'Art accessible pour tous',
    description: 'Investissez dans l\'art tokenisé avec InRealArt. Découvrez des œuvres d\'art rares et exclusives, participez à la révolution de l\'art numérique et de la blockchain.',
    keywords: ['art tokenisé', 'investissement art', 'blockchain art', 'NFT', 'art numérique', 'RWA', 'tokenisation']
  },
  
  artists: {
    title: 'Artistes - Découvrez nos Créateurs',
    description: 'Explorez la diversité créative de nos artistes partenaires. Découvrez leurs œuvres uniques et leur univers artistique sur InRealArt.',
    keywords: ['artistes', 'créateurs', 'œuvres d\'art', 'art contemporain', 'galerie']
  },
  
  marketplace: {
    title: 'Marketplace - Achetez et Vendez de l\'Art Tokenisé',
    description: 'Notre marketplace révolutionnaire pour l\'achat et la vente d\'art tokenisé. Investissez dans l\'art de demain dès aujourd\'hui.',
    keywords: ['marketplace art', 'achat art', 'vente art', 'plateforme art', 'investissement']
  },
  
  token: {
    title: 'Token IRA - Le Token de l\'Art Tokenisé',
    description: 'Découvrez le token IRA, votre passerelle vers l\'écosystème InRealArt. Participez à la gouvernance et bénéficiez des avantages exclusifs.',
    keywords: ['token IRA', 'crypto art', 'gouvernance', 'blockchain', 'tokenomics']
  },
  
  blog: {
    title: 'Blog - Actualités et Guides sur l\'Art Tokenisé',
    description: 'Restez informé des dernières tendances de l\'art tokenisé, découvrez nos guides et analyses sur l\'investissement artistique.',
    keywords: ['blog art', 'actualités art', 'guides investissement', 'tendances art', 'éducation blockchain']
  },
  
  faq: {
    title: 'FAQ - Questions Fréquentes',
    description: 'Trouvez les réponses à vos questions sur InRealArt, l\'art tokenisé, les investissements et notre plateforme.',
    keywords: ['FAQ', 'questions fréquentes', 'aide', 'support', 'guide utilisateur']
  },
  
  contact: {
    title: 'Contact - Nous Contacter',
    description: 'Contactez l\'équipe InRealArt pour toute question, partenariat ou demande d\'information. Nous sommes là pour vous accompagner.',
    keywords: ['contact', 'support', 'équipe', 'partenariat', 'information']
  }
} 