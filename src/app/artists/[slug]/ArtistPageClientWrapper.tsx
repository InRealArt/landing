'use client'

import dynamic from 'next/dynamic'
import ArtistPageSkeleton from '@/components/artists/ArtistPageSkeleton'

interface Props {
  slug: string
}

// Charger le composant client de manière dynamique avec SSR désactivé
const ArtistPageClient = dynamic(() => import('./ArtistPageClient'), {
  ssr: false,
  loading: () => <ArtistPageSkeleton />
})

export default function ArtistPageClientWrapper({ slug }: Props) {
  return <ArtistPageClient slug={slug} />
}
