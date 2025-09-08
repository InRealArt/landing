import { Suspense } from 'react'
import ArtistPageClient from './ArtistPageClient'
import ArtistPageSkeleton from '@/components/artists/ArtistPageSkeleton'

interface Props {
  slug: string
}

export default function ArtistPageSuspense({ slug }: Props) {
  return (
    <Suspense fallback={<ArtistPageSkeleton />}>
      <ArtistPageClient slug={slug} />
    </Suspense>
  )
}
