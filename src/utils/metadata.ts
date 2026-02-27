import { Metadata } from 'next'

// Base configuration
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'
export const SITE_NAME = 'InRealArt'
export const SITE_DESCRIPTION = 'Catalyseur d\'Art, culture et Patrimoine'
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
    alternateLanguages = {
      'x-default': canonical || BASE_URL,
      'fr': canonical || BASE_URL,
      'en': canonical || BASE_URL,
    }
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
    alternateName: 'InRealArt',
    description: SITE_DESCRIPTION,
    url: BASE_URL,
    foundingDate: '2023',
    logo: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/icons/Logo.png`,
      width: 101,
      height: 32
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Paris',
      addressCountry: 'FR'
    },
    areaServed: ['FR', 'BE', 'CH', 'LU'],
    knowsAbout: [
      'art tokenization',
      'art leasing',
      'contemporary art',
      'art investment',
      'art marketplace',
      'LOA artistique',
      'patrimoine culturel'
    ],
    founder: [
      {
        '@type': 'Person',
        name: 'Timothée Roy'
      },
      {
        '@type': 'Person',
        name: 'Maxime Girard'
      },
      {
        '@type': 'Person',
        name: 'Gilles Bruno'
      }
    ],
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
 * Generate JSON-LD structured data for a DefinedTermSet (glossary)
 */
export function generateDefinedTermSetJsonLd(
  name: string,
  description: string,
  url: string,
  terms: { title: string; content: string; categories?: string[] }[]
): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name,
    description,
    url,
    hasDefinedTerm: terms.map(term => ({
      '@type': 'DefinedTerm',
      name: term.title,
      description: term.content,
      inDefinedTermSet: url,
      termCode: term.categories?.[0] || undefined,
    }))
  }

  return JSON.stringify(data)
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
    title: 'InRealArt — Catalyseur de l\'Art, de la Culture et du Patrimoine',
    description: 'La plateforme curatoriale qui rend l\'art, la culture et le patrimoine accessible, humain et éthique. Pour artistes, collectionneurs et mécènes.',
    keywords: ['patrimoine culturel', 'artistes francophones', 'plateforme curatoriale', 'éthique']
  },
  
  artists: {
    title: 'Artistes InRealArt — Créateurs sélectionnés, histoires singulières',
    description: 'Rencontrez les artistes représentés par InRealArt : peintres, sculpteurs, graveurs. Découvrez leurs univers à travers notre accompagnement éditorial.',
    keywords: ['artistes contemporains', 'peinture', 'sculpture', 'art francophone', 'portrait d\'artiste']
  },
  
  marketplace: {
    title: 'Marketplace InRealArt — Achetez, louez, soutenez l\'Art Vivant',
    description: 'Découvrez notre marketplace sélective : vente, leasing et collection d\'œuvres d\'art contextualisées. Un nouveau modèle de circulation artistique.',
    keywords: ['marketplace art', 'leasing artistique', 'collection art', 'art contemporain en ligne']
  },
  
  token: {
    title: 'Token IRA — Investir dans l\'Art avec sens et sécurité',
    description: 'Le token IRA vous donne accès à une gouvernance éthique de l\'art. Un levier d\'investissement symbolique, culturel et responsable.',
    keywords: ['token art', 'crypto éthique', 'gouvernance artistique', 'blockchain culturelle']
  },
  
  blog: {
    title: 'Le Blog InRealArt — Art, Culture & Patrimoine en Mouvement',
    description: 'Tendances, interviews, analyses curatoriales et techniques. Le blog qui explore l\'art vivant et ses enjeux contemporains.',
    keywords: ['blog art', 'tendances artistiques', 'interviews d\'artistes', 'curation', 'marché de l\'art']
  },
  
  faq: {
    title: 'Questions fréquentes — Tout comprendre sur InRealArt',
    description: 'Retrouvez les réponses aux questions les plus fréquentes sur notre fonctionnement, nos services et notre éthique.',
    keywords: ['faq art', 'fonctionnement InRealArt', 'questions artistes', 'plateforme curatoriale']
  },
  
  contact: {
    title: 'Contactez InRealArt — Conseils, partenariats, accompagnement',
    description: 'Une question, un projet artistique ou un partenariat ? L\'équipe InRealArt est à votre écoute. Réponse rapide et personnalisée.',
    keywords: ['contact art', 'équipe InRealArt', 'accompagnement artistes', 'partenariat art']
  }
} 