'use client'

import dynamic from 'next/dynamic'
import ArtistPageSkeleton from '@/components/artists/ArtistPageSkeleton'
import { ArtistData } from '@/actions/artistActions'
import { ArtWork } from '@/types/types'
// Note: We don't strictly need to import the props interface if we trust inference, but explicit is better
// import { ArtistPageClientProps } from './ArtistPageClient' 

interface Props {
  slug: string
  initialArtist: ArtistData
  initialArtworks: ArtWork[]
  interviewUrl?: string | null
  artitudeUrl?: string | null
}

// Charger le composant client de manière dynamique avec SSR désactivé
const ArtistPageClient = dynamic(() => import('./ArtistPageClient'), {
  ssr: false,
  loading: () => <ArtistPageSkeleton />
})

export default function ArtistPageClientWrapper({ slug, initialArtist, initialArtworks, interviewUrl, artitudeUrl }: Props) {
  return <ArtistPageClient slug={slug} initialArtist={initialArtist} initialArtworks={initialArtworks} interviewUrl={interviewUrl} artitudeUrl={artitudeUrl} />
}
