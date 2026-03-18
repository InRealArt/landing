import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateDynamicMetadata } from '@/utils/metadata'
import {
  getPresaleArtworkBySlug,
  getPresaleArtworksByArtistId,
} from '@/actions/presaleArtworkActions'
import { getArtistById } from '@/actions/artistActions'
import ArtworkPageClient from './ArtworkPageClient'
import type { TransformedArtistData } from '@/types/artist'

export const revalidate = 1800 // régénère toutes les 30 min

type ParamsType = Promise<{ id: string }>

interface Props {
  params: ParamsType
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params

  try {
    const artwork = await getPresaleArtworkBySlug(id)

    if (!artwork) {
      return {
        title: 'Œuvre non trouvée | InRealArt',
        description: "Cette œuvre d'art n'existe pas ou n'est plus disponible.",
      }
    }

    const artistFullName = `${artwork.artist.name} ${artwork.artist.surname}`.trim()
    const canonical = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/artwork/${id}`

    return generateDynamicMetadata({
      title: `${artwork.name} — ${artistFullName}`,
      description: artwork.description
        ? `${artwork.description.slice(0, 140)}… Disponible sur InRealArt.`
        : `Découvrez "${artwork.name}" de ${artistFullName} sur InRealArt. Œuvre originale disponible à l'achat et en location-vente.`,
      keywords: [artwork.name, artistFullName, "œuvre d'art", 'art contemporain', 'art tokenisé'],
      image: artwork.imageUrl || undefined,
      canonical,
      alternateLanguages: {
        'x-default': canonical,
        fr: canonical,
        en: canonical,
      },
    }, 'product')
  } catch (error) {
    console.error('Error generating artwork metadata:', error)
    return {
      title: 'Œuvre non trouvée | InRealArt',
      description: "Cette œuvre d'art n'existe pas ou n'est plus disponible.",
    }
  }
}

export default async function ArtworkPage({ params }: Props) {
  const { id } = await params

  const artwork = await getPresaleArtworkBySlug(id)
  if (!artwork) notFound()

  // Fetch artist + related artworks in parallel
  const [artistData, relatedArtworks] = await Promise.all([
    getArtistById(artwork.artistId),
    getPresaleArtworksByArtistId(artwork.artistId),
  ])

  const artist: TransformedArtistData | null = artistData
    ? {
        id: artistData.id,
        artistId: artistData.artistId,
        name: `${artistData.name} ${artistData.surname}`,
        photo: artistData.imageUrl,
        role: artistData.artworkStyle || 'Artiste',
        intro: artistData.intro || '',
        description: artistData.description || '',
        secondaryImageUrl: artistData.secondaryImageUrl || '',
        slug: artistData.slug,
        countryCode: artistData.countryCode,
        countryName: artistData.countryName,
        mediumTags: artistData.mediumTags || [],
        birthYear: artistData.birthYear,
        biographyHeader1: artistData.biographyHeader1,
        biographyText1: artistData.biographyText1,
        biographyHeader2: artistData.biographyHeader2,
        biographyText2: artistData.biographyText2,
        biographyHeader3: artistData.biographyHeader3,
        biographyText3: artistData.biographyText3,
        biographyHeader4: artistData.biographyHeader4,
        biographyText4: artistData.biographyText4,
        artworkImages: artistData.artworkImages
          ? JSON.parse(JSON.stringify(artistData.artworkImages))
          : [],
      }
    : null

  return (
    <ArtworkPageClient
      artwork={artwork}
      artist={artist}
      relatedArtworks={relatedArtworks}
    />
  )
}
