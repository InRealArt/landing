import { Metadata } from 'next'
import { generateStaticMetadata, generateBlogJsonLd } from '@/utils/metadata'
import BlogPageClient from './BlogPageClient'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Le Blog InRealArt — Art, Culture & Patrimoine en Mouvement',
  description: "Tendances, interviews, analyses curatoriales et conseils pratiques. Le blog qui explore l'art vivant et ses enjeux contemporains.",
  keywords: ['blog art', 'tendances artistiques', 'interviews d\'artistes', 'curation', 'marché de l\'art'],
  canonical: 'https://inrealart.com/blog',
})

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateBlogJsonLd() }}
      />
      <BlogPageClient />
    </>
  )
} 