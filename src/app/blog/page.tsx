import { Metadata } from 'next'
import { generateStaticMetadata, generateBlogJsonLd } from '@/utils/metadata'
import BlogPageClient from './BlogPageClient'
import { getFeaturedPost, getLanguageIdByCode, getCategoriesWithTranslations } from '@/actions/seoPostActions'

export const revalidate = 1800

export const metadata: Metadata = generateStaticMetadata({
  title: 'Le Blog InRealArt — Art, Culture & Patrimoine en Mouvement',
  description: "Tendances, interviews, analyses curatoriales et conseils pratiques. Le blog qui explore l'art vivant et ses enjeux contemporains.",
  keywords: ['blog art', 'tendances artistiques', "interviews d'artistes", 'curation', "marché de l'art"],
  canonical: 'https://inrealart.com/blog',
})

export default async function BlogPage() {
  const [langId, initialCategories] = await Promise.all([
    getLanguageIdByCode('fr'),
    getCategoriesWithTranslations('fr'),
  ])

  const initialFeaturedPost = langId ? await getFeaturedPost(langId) : null

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
      />
    </>
  )
}
