import { Metadata } from 'next'
import { generateDynamicMetadata } from '@/utils/metadata'
import { getPresaleArtworkById } from '@/actions/presaleArtworkActions'
import ArtworkPageClient from './ArtworkPageClient'

type ParamsType = Promise<{ id: string }>

interface Props {
  params: ParamsType
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  try {
    const artwork = await getPresaleArtworkById(Number(id))

    if (!artwork) {
      return {
        title: 'Œuvre non trouvée | InRealArt',
        description: 'Cette œuvre d\'art n\'existe pas ou n\'est plus disponible.',
      }
    }

    const artistFullName = `${artwork.artist.name} ${artwork.artist.surname}`.trim()
    const canonical = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/artwork/${id}`

    return generateDynamicMetadata({
      title: `${artwork.name} — ${artistFullName}`,
      description: artwork.description
        ? `${artwork.description.slice(0, 140)}… Disponible sur InRealArt.`
        : `Découvrez "${artwork.name}" de ${artistFullName} sur InRealArt. Œuvre originale disponible à l'achat et en location-vente.`,
      keywords: [artwork.name, artistFullName, 'œuvre d\'art', 'art contemporain', 'art tokenisé'],
      image: artwork.imageUrl || undefined,
      canonical,
      alternateLanguages: {
        'x-default': canonical,
        'fr': canonical,
        'en': canonical,
      },
    }, 'product')
  } catch (error) {
    console.error('Error generating artwork metadata:', error)
    return {
      title: 'Œuvre non trouvée | InRealArt',
      description: 'Cette œuvre d\'art n\'existe pas ou n\'est plus disponible.',
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