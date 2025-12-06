import { notFound } from 'next/navigation'
import { getArtistBySlug } from '@/actions/artistActions'
import { getPresaleArtworksByArtistId } from '@/actions/presaleArtworkActions'
import { transformPresaleArtworkToArtwork } from '@/utils/transformers'
import ArtistPageClientWrapper from './ArtistPageClientWrapper'

interface Props {
  slug: string
}

export default async function ArtistPageAsync({ slug }: Props) {
  const artist = await getArtistBySlug(slug)
  
  if (!artist) {
    notFound()
  }

  const rawArtworks = await getPresaleArtworksByArtistId(artist.artistId)
  const artworks = rawArtworks.map(transformPresaleArtworkToArtwork)

  return <ArtistPageClientWrapper 
    slug={slug} 
    initialArtist={artist} 
    initialArtworks={artworks} 
  />
}
