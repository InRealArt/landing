import type { Metadata } from 'next'
import { getAllUgcArtists } from '@/actions/ugcActions'
import AgenceArtistsPage from '@/components/agence/AgenceArtistsPage'

export const metadata: Metadata = {
  title: 'Nos artistes — Agence InRealArt',
  description:
    "Découvrez l'ensemble des créateurs UGC du catalogue InRealArt — métriques vérifiées, présence sociale et portfolios.",
}

export default async function AgenceArtistsRoute() {
  const artists = await getAllUgcArtists()
  return <AgenceArtistsPage artists={artists} />
}
