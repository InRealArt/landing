import { MetadataRoute } from 'next'
import { getArtists } from '@/actions/artistActions'
import { getArtistCategories } from '@/actions/artistCategoryActions'
import { getPublishedPosts, getLanguageIdByCode, getCategoriesWithTranslations } from '@/actions/seoPostActions'
import { getPresaleArtworks } from '@/actions/presaleArtworkActions'
import { getAllUgcArtists } from '@/actions/ugcActions'
import { toSlug } from '@/utils/slug'

const BASE_URL = 'https://www.inrealart.com'

// Sans revalidation, le sitemap reste figé au build : il ignore les contenus créés ou renommés en base ensuite
export const revalidate = 300

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: '2026-02-27', changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/artists`, lastModified: '2026-02-27', changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/presale`, lastModified: '2026-02-27', changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/manifest`, lastModified: '2025-12-30', changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/simulators`, lastModified: '2025-10-15', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/team`, lastModified: '2025-09-06', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/loa-simulator`, lastModified: '2025-09-09', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/heritage-art-simulator`, lastModified: '2025-09-09', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/art-salon-simulator/artbasel-paris`, lastModified: '2025-09-06', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/art-salon-simulator/artgeneve`, lastModified: '2025-09-06', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/usecase`, lastModified: '2025-09-06', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/usecase/companies`, lastModified: '2025-09-06', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/usecase/leasing`, lastModified: '2025-09-06', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/joinInRealArt`, lastModified: '2025-08-26', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/joinInRealArt/artists`, lastModified: '2026-02-27', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/joinInRealArt/galleries`, lastModified: '2026-02-27', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: '2026-02-27', changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/faq`, lastModified: '2026-02-27', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/glossary`, lastModified: '2025-09-06', changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: '2025-09-06', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/terms`, lastModified: '2025-09-06', changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/legal`, lastModified: '2025-09-19', changeFrequency: 'yearly', priority: 0.3 },
    // Pages ajoutées par l'audit V2 (IRA-07)
    { url: `${BASE_URL}/agence`, lastModified: '2026-10-16', changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/agence/artists`, lastModified: '2026-10-16', changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/agence/brief`, lastModified: '2026-10-16', changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/media`, lastModified: '2026-10-16', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/media/production`, lastModified: '2026-10-16', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/services`, lastModified: '2026-10-16', changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/artists-studio`, lastModified: '2026-10-16', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/usecase/leasing/hotelPrestige`, lastModified: '2026-10-16', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/usecase/leasing/immobilier`, lastModified: '2026-10-16', changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/usecase/capital/contact`, lastModified: '2026-10-16', changeFrequency: 'yearly', priority: 0.5 },
  ]

  const [artists, artistCategories, frLangId, enLangId, blogCategories, artworks, ugcArtists] = await Promise.all([
    getArtists().catch(() => []),
    getArtistCategories().catch(() => []),
    getLanguageIdByCode('fr').catch(() => null),
    getLanguageIdByCode('en').catch(() => null),
    getCategoriesWithTranslations('fr').catch(() => []),
    getPresaleArtworks().catch(() => []),
    getAllUgcArtists().catch(() => []),
  ])

  const artistEntries: MetadataRoute.Sitemap = artists
    .filter(a => a.slug)
    .map(a => ({
      url: `${BASE_URL}/artists/${a.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  const artistCategoryEntries: MetadataRoute.Sitemap = artistCategories
    .filter(c => c.name)
    .map(c => ({
      url: `${BASE_URL}/artists/category/${encodeURIComponent(c.name.toLowerCase())}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))

  const [frPosts, enPosts] = await Promise.all([
    frLangId ? getPublishedPosts(frLangId).catch(() => ({ posts: [] })) : Promise.resolve({ posts: [] }),
    enLangId ? getPublishedPosts(enLangId).catch(() => ({ posts: [] })) : Promise.resolve({ posts: [] }),
  ])

  const allBlogPosts = [
    ...frPosts.posts.map(p => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...enPosts.posts.map(p => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
  // Dédupliquer par URL en gardant la date de modification la plus récente
  const blogUrlMap = new Map<string, (typeof allBlogPosts)[0]>()
  for (const entry of allBlogPosts) {
    const existing = blogUrlMap.get(entry.url)
    if (!existing || entry.lastModified > existing.lastModified) {
      blogUrlMap.set(entry.url, entry)
    }
  }
  const blogEntries: MetadataRoute.Sitemap = Array.from(blogUrlMap.values())

  const blogCategoryEntries: MetadataRoute.Sitemap = blogCategories
    .filter(c => c.url)
    .map(c => ({
      url: `${BASE_URL}/blog/category/${c.url}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))

  // Fiches œuvres en slug (/artwork/{id} redirige vers le slug) ; une seule entrée par URL :
  // deux œuvres au même nom partagent le même slug, seule la plus ancienne y répond
  const artworkSlugs = new Set(artworks.map(a => toSlug(a.name)).filter(Boolean))
  const artworkEntries: MetadataRoute.Sitemap = [...artworkSlugs].map(slug => ({
    url: `${BASE_URL}/artwork/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const agenceArtistEntries: MetadataRoute.Sitemap = ugcArtists
    .filter(a => a.slug)
    .map(a => ({
      url: `${BASE_URL}/agence/artists/${a.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))

  return [
    ...staticPages,
    ...artistEntries,
    ...artistCategoryEntries,
    ...blogEntries,
    ...blogCategoryEntries,
    ...artworkEntries,
    ...agenceArtistEntries,
  ]
}
