import type { Metadata } from 'next'
import { getAllUgcArtists } from '@/actions/ugcActions'
import AgenceArtistsPage from '@/components/agence/AgenceArtistsPage'
import AgenceArtistsFAQ from '@/components/agence/AgenceArtistsFAQ'

export const metadata: Metadata = {
  title: 'Nos artistes — Agence InRealArt',
  description:
    "Découvrez l'ensemble des artistes de l'agence InRealArt — métriques vérifiées, présence sociale et portfolios.",
}

export default async function AgenceArtistsRoute() {
  const artists = await getAllUgcArtists()
  return (
    <>
      <AgenceArtistsPage artists={artists} />
      <AgenceArtistsFAQ />
    </>
  )
}
