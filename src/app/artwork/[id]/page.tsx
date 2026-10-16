import { Metadata } from 'next'
import { cache } from 'react'
import { notFound, permanentRedirect } from 'next/navigation'
import { generateDynamicMetadata } from '@/utils/metadata'
import {
  getPresaleArtworkBySlug,
  getPresaleArtworkById,
  getKeyWorksByArtistId,
} from '@/actions/presaleArtworkActions'
import { getArtistById } from '@/actions/artistActions'
import ArtworkPageClient from './ArtworkPageClient'
import { generateArtworkJsonLd, generateArtworkBreadcrumbJsonLd } from '@/utils/generateJsonLd'
import { getArtistDisplayName } from '@/utils/artistDisplayName'
import { getImageUrl } from '@/lib/cloufare/r2/url'
import { BASE_URL } from '@/utils/metadata'
import { toSlug } from '@/utils/slug'
import { toPlainText } from '@/utils/jsonLd'
import type { TransformedArtistData } from '@/types/artist'

export const revalidate = 300 // filet de sécurité : 5 min max (IRA-22), en plus de /api/revalidate

type ParamsType = Promise<{ id: string }>

interface Props {
  params: ParamsType
}

/**
 * Résout l'œuvre de l'URL (IRA-07). Appelée d'abord par generateMetadata, avant tout envoi de HTML :
 * le 404 et la redirection y donnent donc un vrai code HTTP (dans la page, streamée sous le
 * loading.tsx racine, on obtiendrait un 200 « soft 404 »).
 * - slug connu → l'œuvre ;
 * - identifiant numérique (anciennes URL /artwork/{id}) → 308 permanente vers /artwork/<slug> ;
 * - sinon → 404.
 */
const resolveArtwork = cache(async (param: string) => {
  const artwork = await getPresaleArtworkBySlug(param)
  if (artwork) return artwork

  if (/^\d+$/.test(param)) {
    const byId = await getPresaleArtworkById(Number(param))
    const slug = byId && toSlug(byId.name)
    if (slug) permanentRedirect(`/artwork/${slug}`)
  }
  notFound()
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const artwork = await resolveArtwork(id)

  const artistName = getArtistDisplayName(artwork.artist)
  const description = toPlainText(artwork.description)
  const canonical = `${BASE_URL}/artwork/${id}`

  return generateDynamicMetadata({
    title: `${artwork.name} — ${artistName}`,
    description: description
      ? `${description.slice(0, 140)}… Disponible sur InRealArt.`
      : `Découvrez "${artwork.name}" de ${artistName} sur InRealArt. Œuvre originale disponible à l'achat et en location-vente.`,
    image: getImageUrl(artwork.imageUrl) ?? undefined,
    imageAlt: `${artwork.name} — ${artistName}`,
    canonical,
    alternateLanguages: {
      'x-default': canonical,
      fr: canonical,
      en: canonical,
    },
  }, 'product')
}

export default async function ArtworkPage({ params }: Props) {
  const { id } = await params
  const artwork = await resolveArtwork(id)

  // Fetch artist + related artworks in parallel
  const [artistData, allKeyWorks] = await Promise.all([
    getArtistById(artwork.artistId),
    getKeyWorksByArtistId(artwork.artistId),
  ])
  const relatedArtworks = allKeyWorks.filter(aw => aw.id !== artwork.id)

  // JSON-LD rendu côté serveur (IRA-02) : VisualArtwork + Offer, fil d'Ariane Accueil > Catalogue > artiste > œuvre
  const artistName = getArtistDisplayName(artwork.artist)
  const artistSlug = artistData?.slug ?? artwork.artist.slug
  const artworkJsonLd = generateArtworkJsonLd(artwork, {
    name: artistName,
    ...(artistSlug && { url: `${BASE_URL}/artists/${artistSlug}` }),
  })
  const breadcrumbJsonLd = generateArtworkBreadcrumbJsonLd(artwork.name, id, { name: artistName, slug: artistSlug })

  const artist: TransformedArtistData | null = artistData
    ? {
        id: artistData.id,
        artistId: artistData.artistId,
        name: getArtistDisplayName(artistData),
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
    <>
      {/* JSON-LD généré depuis des données internes, `<` échappé par serializeJsonLd */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: artworkJsonLd }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />
      <ArtworkPageClient
        artwork={artwork}
        artist={artist}
        relatedArtworks={relatedArtworks}
      />
    </>
  )
}
