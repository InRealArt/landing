import type { Metadata } from 'next'
import { BASE_URL } from '@/utils/metadata'
import { getAllUgcArtists } from '@/actions/ugcActions'
import AgenceArtistsPage from '@/components/agence/AgenceArtistsPage'
import AgenceArtistsFAQ from '@/components/agence/AgenceArtistsFAQ'

export const revalidate = 300 // filet de sécurité : 5 min max (IRA-22), en plus de /api/revalidate

export const metadata: Metadata = {
  title: 'Nos artistes — Agence',
  description:
    "Découvrez l'ensemble des artistes de l'agence InRealArt — métriques vérifiées, présence sociale et portfolios.",
  alternates: { canonical: `${BASE_URL}/agence/artists` },
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
