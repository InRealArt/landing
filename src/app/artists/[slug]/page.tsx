import { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { generateDynamicMetadata } from '@/utils/metadata'
import { getArtistBySlug } from '@/actions/artistActions'
import { getKeyWorksByArtistId } from '@/actions/presaleArtworkActions'
import { getArtistDisplayName } from '@/utils/artistDisplayName'
import { getImageUrl } from '@/lib/cloufare/r2/url'

export const revalidate = 300 // filet de sécurité : 5 min max (IRA-22), en plus de /api/revalidate
import {
  generateArtistPersonJsonLd,
  generateArtistVisualArtworksJsonLd,
  generateArtistBreadcrumbJsonLd
} from '@/utils/generateJsonLd'
// Import direct (pas de dynamic ssr:false) : la fiche est pré-rendue côté serveur (IRA-01)
import ArtistPageClient from './ArtistPageClient'

type ParamsType = Promise<{ slug: string }>

interface Props {
  params: ParamsType
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  const artist = await getArtistBySlug(slug)
  // Redirection décidée ici (avant l'envoi du HTML) pour obtenir un vrai 308, pas une page 200 ;
  // hors du try : permanentRedirect lève une exception que le catch avalerait
  if (!artist) permanentRedirect('/artists')

  try {

    const artistName = getArtistDisplayName(artist) || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

    const specialty = artist.artworkStyle || (artist.mediumTags?.[0] ? `Artiste ${artist.mediumTags[0]}` : 'Artiste')
    const nationality = artist.countryName ? ` ${artist.countryName}` : ''
    const rawArtworks = await getKeyWorksByArtistId(artist.artistId)
    const artworkCount = rawArtworks.length

    const titleTag = `${artistName} - ${specialty} | Bio, Œuvres & Cote | InRealArt`
    const metaDescription = `Découvrez ${artistName}, ${specialty.toLowerCase()}${nationality}. Biographie, ${artworkCount > 0 ? `${artworkCount}+ ` : ''}œuvres originales, expositions 2026. Achat LOA disponible sur InRealArt.`

    const canonical = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.inrealart.com'}/artists/${slug}`
    return generateDynamicMetadata({
      title: titleTag,
      description: metaDescription,
      keywords: [artistName, 'artiste', 'œuvres d\'art', 'art contemporain', 'galerie', ...(artist.mediumTags || [])],
      image: getImageUrl(artist.imageUrl) ?? undefined,
      imageAlt: artistName,
      canonical,
      alternateLanguages: {
        'x-default': canonical,
        'fr': canonical,
        'en': canonical,
      },
    }, 'profile')
  } catch (error) {
    console.error('Error generating artist metadata:', error)
    return {
      title: 'Artiste non trouvé',
      description: 'Cet artiste n\'existe pas ou n\'est plus disponible.'
    }
  }
}

export default async function ArtistPage({ params }: Props) {
  const { slug } = await params

  const artist = await getArtistBySlug(slug)

  if (!artist) {
    permanentRedirect('/artists')
  }

  const artworks = await getKeyWorksByArtistId(artist.artistId)

  const artistName = getArtistDisplayName(artist)
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
      {/* JSON-LD généré depuis des données internes (safe) */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }}
      />
      <ArtistPageClient
        slug={slug}
        initialArtist={artist}
        initialArtworks={artworks}
        interviewUrl={artist.interviewUrl}
        artitudeUrl={artist.artitudeUrl}
      />
    </>
  )
}
