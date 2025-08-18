import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getArtistCategoryBySlug, getArtistCategories } from '@/actions/artistCategoryActions'
import { getArtistsByCategory } from '@/actions/artistActions'
import ArtistCategoryPageClient from './ArtistCategoryPageClient'

interface ArtistCategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const categories = await getArtistCategories()
    
    return categories.map((category) => ({
      slug: encodeURIComponent(category.name.toLowerCase())
    }))
  } catch (error) {
    console.error('Erreur lors de la génération des paramètres statiques:', error)
    return []
  }
}

export async function generateMetadata({ params }: ArtistCategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getArtistCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'Catégorie non trouvée | In Real Art',
      description: 'La catégorie d\'artistes demandée n\'existe pas.'
    }
  }

  return {
    title: `${category.name} | Catégories d'artistes | In Real Art`,
    description: category.description || `Découvrez les artistes de la catégorie ${category.name} sur In Real Art.`,
    openGraph: {
      title: `${category.name} | In Real Art`,
      description: category.description || `Découvrez les artistes de la catégorie ${category.name} sur In Real Art.`,
      images: category.imageUrl ? [{ url: category.imageUrl }] : []
    }
  }
}

export default async function ArtistCategoryPage({ params }: ArtistCategoryPageProps) {
  const { slug } = await params
  
  // Récupérer les données en parallèle
  const [category, artists] = await Promise.all([
    getArtistCategoryBySlug(slug),
    getArtistsByCategory(slug)
  ])

  // Vérifier si la catégorie existe
  if (!category) {
    notFound()
  }

  return (
    <ArtistCategoryPageClient 
      category={category} 
      initialArtists={artists}
    />
  )
}
