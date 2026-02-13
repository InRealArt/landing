import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { generateDynamicMetadata } from '@/utils/metadata'
import { getArtistBySlug } from '@/actions/artistActions'
import { getPresaleArtworksByArtistId } from '@/actions/presaleArtworkActions'
import { transformPresaleArtworkToArtwork } from '@/utils/transformers'
import {
  generateArtistPersonJsonLd,
  generateArtistVisualArtworksJsonLd,
  generateArtistBreadcrumbJsonLd
} from '@/utils/generateJsonLd'
import ArtistPageClientWrapper from './ArtistPageClientWrapper'

type ParamsType = Promise<{ slug: string }>

interface Props {
  params: ParamsType
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    const artist = await getArtistBySlug(slug)

    if (!artist) {
      return {
        title: 'Artiste non trouvé | InRealArt',
        description: 'Cet artiste n\'existe pas ou n\'est plus disponible.'
      }
    }

    const artistName = artist.name ? `${artist.name} ${artist.surname}` : slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    return generateDynamicMetadata({
      title: `${artistName} - Artiste`,
      description: artist.intro || artist.description || `Découvrez l'univers artistique de ${artistName}. Explorez ses œuvres uniques et son style distinctif sur InRealArt.`,
      keywords: [artistName, 'artiste', 'œuvres d\'art', 'art contemporain', 'galerie', ...(artist.mediumTags || [])],
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/artists/${slug}`
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

  const artist = await getArtistBySlug(slug)

  if (!artist) {
    notFound()
  }

  const rawArtworks = await getPresaleArtworksByArtistId(artist.artistId)
  const artworks = rawArtworks.map(transformPresaleArtworkToArtwork)

  const artistName = `${artist.name} ${artist.surname}`
  const personJsonLd = generateArtistPersonJsonLd(artist)
  const artworksJsonLd = generateArtistVisualArtworksJsonLd(artworks, artistName, slug)
  const breadcrumbJsonLd = generateArtistBreadcrumbJsonLd(artistName, slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: personJsonLd }}
      />
      {artworksJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: artworksJsonLd }}
        />
      )}
      {/* BreadcrumbJsonLd does not exist yet */}
      {/* <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      /> */}
      <ArtistPageClientWrapper
        slug={slug}
        initialArtist={artist}
        initialArtworks={artworks}
      />
    </>
  )
}
