import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateDynamicMetadata, generatePersonJsonLd, generateBreadcrumbJsonLd } from '@/utils/metadata'
import ArtistPageClient from './ArtistPageClient'

type ParamsType = Promise<{ slug: string }>

interface Props {
  params: ParamsType
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    // In a real app, you would fetch artist data here
    // For now, we'll create generic metadata
    const artistName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    
    return generateDynamicMetadata({
      title: `${artistName} - Artiste`,
      description: `Découvrez l'univers artistique de ${artistName}. Explorez ses œuvres uniques et son style distinctif sur InRealArt.`,
      keywords: [artistName, 'artiste', 'œuvres d\'art', 'art contemporain', 'galerie'],
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/artists/${slug}`,
      alternateLanguages: {
        'fr': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/fr/artists/${slug}`,
        'en': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/en/artists/${slug}`
      }
    }, 'profile')
  } catch (error) {
    console.error('Error generating artist metadata:', error)
    return {
      title: 'Artiste non trouvé | InRealArt',
      description: 'Cet artiste n\'existe pas ou n\'est plus disponible.'
    }
  }
}

export default async function ArtistPage({ params }: Props) {
  const { slug } = await params

  return <ArtistPageClient slug={slug} />
} 