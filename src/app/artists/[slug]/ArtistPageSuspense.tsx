import { Suspense } from 'react'
import ArtistPageAsync from './ArtistPageAsync'
import ArtistPageSkeleton from '@/components/artists/ArtistPageSkeleton'

interface Props {
  slug: string
}

export default function ArtistPageSuspense({ slug }: Props) {
  return (
    <Suspense fallback={<ArtistPageSkeleton />}>
      <ArtistPageAsync slug={slug} />
    </Suspense>
  )
}
