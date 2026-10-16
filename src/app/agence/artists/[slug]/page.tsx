import type { Metadata } from 'next'
import { BASE_URL } from '@/utils/metadata'
import { notFound } from 'next/navigation'
import { getUgcArtistBySlug } from '@/actions/ugcActions'
import AgenceArtistDetailPage from '@/components/agence/AgenceArtistDetailPage'
import AgenceGalleryBridge from '@/components/agence/AgenceGalleryBridge'
import { getArtistDisplayName } from '@/utils/artistDisplayName'

export const revalidate = 300 // filet de sécurité : 5 min max (IRA-22), en plus de /api/revalidate

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const artist = await getUgcArtistBySlug(slug)
  // 404 décidé ici (avant l'envoi du HTML) pour obtenir un vrai code 404, pas une page 200
  if (!artist) notFound()
  const name = getArtistDisplayName(artist)
  return {
    title: `${name} — Artiste`,
    description: artist.description ?? `Découvrez le profil de ${name}, artiste de l'agence InRealArt.`,
    alternates: { canonical: `${BASE_URL}/agence/artists/${slug}` },
  }
}

export default async function AgenceArtistDetailRoute({ params }: Props) {
  const { slug } = await params
  const artist = await getUgcArtistBySlug(slug)
  if (!artist) notFound()

  const artistDisplayName = getArtistDisplayName(artist)

  return (
    <>
      <AgenceArtistDetailPage artist={artist} />
      {artist.landingArtistSlug && (
        <AgenceGalleryBridge
          ugcArtistProfileId={artist.id}
          landingArtistSlug={artist.landingArtistSlug}
          artistDisplayName={artistDisplayName}
          language="fr"
        />
      )}
    </>
  )
}
