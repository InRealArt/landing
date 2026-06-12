import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getUgcArtistBySlug } from '@/actions/ugcActions'
import AgenceArtistDetailPage from '@/components/agence/AgenceArtistDetailPage'
import AgenceGalleryBridge from '@/components/agence/AgenceGalleryBridge'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const artist = await getUgcArtistBySlug(slug)
  if (!artist) return {}
  const name = artist.pseudo ?? [artist.name, artist.surname].filter(Boolean).join(' ')
  return {
    title: `${name} — Artiste | InRealArt`,
    description: artist.description ?? `Découvrez le profil de ${name}, artiste de l'agence InRealArt.`,
  }
}

export default async function AgenceArtistDetailRoute({ params }: Props) {
  const { slug } = await params
  const artist = await getUgcArtistBySlug(slug)
  if (!artist) notFound()

  const artistDisplayName = artist.pseudo ?? [artist.name, artist.surname].filter(Boolean).join(' ')

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
