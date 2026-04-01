import { notFound } from 'next/navigation'
import { getArtistBySlug } from '@/actions/artistActions'
import { getKeyWorksByArtistId } from '@/actions/presaleArtworkActions'
import ArtistPageClientWrapper from './ArtistPageClientWrapper'

interface Props {
  slug: string
}

export default async function ArtistPageAsync({ slug }: Props) {
  const artist = await getArtistBySlug(slug)
  
  if (!artist) {
    notFound()
  }

  const artworks = await getKeyWorksByArtistId(artist.artistId)

  return <ArtistPageClientWrapper
    slug={slug}
    initialArtist={artist}
    initialArtworks={artworks}
  />
}
