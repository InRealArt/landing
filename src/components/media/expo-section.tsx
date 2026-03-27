import { Suspense } from 'react'
import { getLatestExpos } from '@/actions/expoActions'
import ExpoCarousel, { ExpoCarouselSkeleton } from './ExpoCarousel'

async function ExpoSectionContent() {
  const expos = await getLatestExpos()

  if (expos.length === 0) return null

  return <ExpoCarousel expos={expos} />
}

export default function ExpoSection() {
  return (
    <Suspense fallback={<ExpoCarouselSkeleton />}>
      <ExpoSectionContent />
    </Suspense>
  )
}
