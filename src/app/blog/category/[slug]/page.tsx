import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateDynamicMetadata } from '@/utils/metadata'
import BlogCategoryPageClient from './BlogCategoryPageClient'

type ParamsType = Promise<{ slug: string }>

interface Props {
  params: ParamsType
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    // In a real app, you would fetch category data here
    const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    
    return generateDynamicMetadata({
      title: `${categoryName} - Blog`,
      description: `Découvrez tous les articles de la catégorie ${categoryName} sur InRealArt. Actualités, guides et analyses sur l'art tokenisé.`,
      keywords: [categoryName, 'blog', 'articles', 'art tokenisé', 'actualités'],
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/blog/category/${slug}`
    })
  } catch (error) {
    console.error('Error generating category metadata:', error)
    return {
      title: 'Catégorie non trouvée | InRealArt',
      description: 'Cette catégorie n\'existe pas ou n\'est plus disponible.'
    }
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params

  return <BlogCategoryPageClient categorySlug={slug} />
} 