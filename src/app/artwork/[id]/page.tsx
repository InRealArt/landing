import { Metadata } from 'next'
import { generateDynamicMetadata } from '@/utils/metadata'
import ArtworkPageClient from './ArtworkPageClient'

type ParamsType = Promise<{ id: string }>

interface Props {
  params: ParamsType
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: slug } = await params

  try {
    // In a real app, you would fetch artwork data here
    // For now, we'll create generic metadata
    const artworkName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    
    return generateDynamicMetadata({
      title: `${artworkName} - Œuvre d'Art`,
      description: `Découvrez ${artworkName}, une œuvre d'art unique disponible sur InRealArt. Investissez dans l'art tokenisé de qualité.`,
      keywords: [artworkName, 'œuvre d\'art', 'art tokenisé', 'investissement art', 'NFT'],
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/artwork/${slug}`
    }, 'product')
  } catch (error) {
    console.error('Error generating artwork metadata:', error)
    return {
      title: 'Œuvre non trouvée | InRealArt',
      description: 'Cette œuvre d\'art n\'existe pas ou n\'est plus disponible.'
    }
  }
}

export default async function ArtworkPage({ params }: Props) {
  const { id } = await params
  
  return (
    <>
      <ArtworkPageClient artworkId={id} />
    </>
  )
} 