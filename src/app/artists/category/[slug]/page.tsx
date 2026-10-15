import { permanentRedirect } from 'next/navigation'
import { Metadata } from 'next'
import { BASE_URL } from '@/utils/metadata'
import { getArtistCategoryBySlug } from '@/actions/artistCategoryActions'
import { getArtistsByCategory } from '@/actions/artistActions'
import ArtistCategoryPageClient from './ArtistCategoryPageClient'

export const dynamic = 'force-dynamic'

interface ArtistCategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArtistCategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getArtistCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'Catégorie non trouvée',
      description: 'La catégorie d\'artistes demandée n\'existe pas.'
    }
  }

  // Même construction que src/app/sitemap.ts : canonical identique quelle que soit la casse de l'URL demandée
  const canonical = `${BASE_URL}/artists/category/${encodeURIComponent(category.name.toLowerCase())}`

  return {
    // Nom contenant déjà la marque (ex. « Choix d'InRealArt ») : pas de suffixe du template
    title: category.name.includes('InRealArt')
      ? { absolute: `${category.name} | Catégories d'artistes` }
      : `${category.name} | Catégories d'artistes`,
    description: category.description || `Découvrez les artistes de la catégorie ${category.name} sur In Real Art.`,
    alternates: { canonical },
    openGraph: {
      url: canonical,
      title: category.name.includes('InRealArt') ? category.name : `${category.name} | InRealArt`,
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
    permanentRedirect('/artists')
  }

  return (
    <ArtistCategoryPageClient 
      category={category} 
      initialArtists={artists}
    />
  )
}
