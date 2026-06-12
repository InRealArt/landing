import { Metadata } from 'next'
import { generateStaticMetadata, generateBlogJsonLd } from '@/utils/metadata'
import BlogPageClient from './BlogPageClient'
import NewsletterInline from '@/components/common/NewsletterInline'
import BlogFAQ from '@/components/blog/BlogFAQ'
import {
  getFeaturedPost,
  getLanguageIdByCode,
  getCategoriesWithTranslations,
  getPublishedPostsPaginated,
} from '@/actions/seoPostActions'

export const revalidate = 1800

export const metadata: Metadata = generateStaticMetadata({
  title: 'Le Blog InRealArt — Art, Culture & Patrimoine en Mouvement',
  description: "Tendances, interviews, analyses curatoriales et conseils pratiques. Le blog qui explore l'art vivant et ses enjeux contemporains.",
  keywords: ['blog art', 'tendances artistiques', "interviews d'artistes", 'curation', "marché de l'art"],
  canonical: 'https://inrealart.com/blog',
})

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const rawPage = parseInt(resolvedSearchParams.page ?? '1', 10)
  const initialPage = isNaN(rawPage) || rawPage < 1 ? 1 : rawPage

  const [langId, initialCategories] = await Promise.all([
    getLanguageIdByCode('fr'),
    getCategoriesWithTranslations('fr'),
  ])

  const [initialFeaturedPost, paginatedResult] = await Promise.all([
    langId ? getFeaturedPost(langId) : Promise.resolve(null),
    langId
      ? getPublishedPostsPaginated(langId, initialPage, 6, true)
      : Promise.resolve({ posts: [], total: 0, totalPages: 0 }),
  ])

  const jsonLd = generateBlogJsonLd()

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <BlogPageClient
        initialFeaturedPost={initialFeaturedPost}
        initialCategories={initialCategories}
        initialPosts={paginatedResult.posts}
        initialPage={initialPage}
        totalPages={paginatedResult.totalPages}
      />
      <BlogFAQ />
      <NewsletterInline />
    </>
  )
}
