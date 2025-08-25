'use client'

import { Suspense } from 'react'
import ArtistPageClient from './ArtistPageClient'
import Loading from './loading'

interface Props {
  slug: string
}

export default function ArtistPageSuspense({ slug }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <ArtistPageClient slug={slug} />
    </Suspense>
  )
}
