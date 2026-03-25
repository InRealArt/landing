import { Suspense } from 'react'
import { getExhibitions } from '@/actions/exhibitionActions'
import ExhibitionSlider, { ExhibitionSliderSkeleton } from './ExhibitionSlider'

async function ExhibitionSliderContent() {
  const exhibitions = await getExhibitions()

  if (exhibitions.length === 0) return null

  return <ExhibitionSlider exhibitions={exhibitions} />
}

export default function ExhibitionSliderWrapper() {
  return (
    <Suspense fallback={<ExhibitionSliderSkeleton />}>
      <ExhibitionSliderContent />
    </Suspense>
  )
}
