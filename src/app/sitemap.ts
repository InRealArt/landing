import { MetadataRoute } from 'next'
import { getArtists } from '@/actions/artistActions'
import { getArtistCategories } from '@/actions/artistCategoryActions'
import { getPublishedPosts, getLanguageIdByCode, getCategoriesWithTranslations } from '@/actions/seoPostActions'
import { getPresaleArtworks } from '@/actions/presaleArtworkActions'

const BASE_URL = 'https://inrealart.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/marketplace`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/artists`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/presale`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/team`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/roadmap`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/loa-simulator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/heritage-art-simulator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/art-salon-simulator/artbasel-paris`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/art-salon-simulator/artgeneve`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/usecase`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/usecase/companies`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/usecase/leasing`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/usecase/lending`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/usecase/fractionate`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/joinInRealArt`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/joinInRealArt/artists`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/joinInRealArt/galleries`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/faq/translated`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/glossary`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms-nft`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/legal`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]

  const [artists, artistCategories, frLangId, enLangId, blogCategories, artworks] = await Promise.all([
    getArtists().catch(() => []),
    getArtistCategories().catch(() => []),
    getLanguageIdByCode('fr').catch(() => null),
    getLanguageIdByCode('en').catch(() => null),
    getCategoriesWithTranslations('fr').catch(() => []),
    getPresaleArtworks().catch(() => []),
  ])

  const artistEntries: MetadataRoute.Sitemap = artists
    .filter(a => a.slug)
    .map(a => ({
      url: `${BASE_URL}/artists/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  const artistCategoryEntries: MetadataRoute.Sitemap = artistCategories
    .filter(c => c.name)
    .map(c => ({
      url: `${BASE_URL}/artists/category/${encodeURIComponent(c.name.toLowerCase())}`,
      lastModified: new Date(),
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
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))

  const artworkEntries: MetadataRoute.Sitemap = artworks.map(a => ({
    url: `${BASE_URL}/artwork/${a.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...artistEntries,
    ...artistCategoryEntries,
    ...blogEntries,
    ...blogCategoryEntries,
    ...artworkEntries,
  ]
}
