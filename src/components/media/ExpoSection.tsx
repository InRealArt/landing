import { Suspense } from 'react'
import { getExhibitions, type ExpoData } from '@/actions/exhibitionActions'
import ExpoCarousel, { ExpoCarouselSkeleton } from './ExpoCarousel'

async function ExpoSectionContent() {
  const exhibitions = await getExhibitions()

  if (exhibitions.length === 0) return null

  // Map ExhibitionData to ExpoData expected by ExpoCarousel
  const expos: ExpoData[] = exhibitions.map((expo) => {
    const start = new Date(expo.startDate)
    const end = new Date(expo.endDate)

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
      }).toUpperCase()
    }

    const dateStr = formatDate(start) === formatDate(end)
      ? formatDate(start)
      : `${formatDate(start)} - ${formatDate(end)}`

    return {
      title: expo.name,
      location: expo.address,
      date: dateStr,
      imageUrl: expo.imageUrl ?? '',
      href: expo.linkToEvent ?? '#',
    }
  })

  return <ExpoCarousel expos={expos} />
}

export default function ExpoSection() {
  return (
    <Suspense fallback={<ExpoCarouselSkeleton />}>
      <ExpoSectionContent />
    </Suspense>
  )
}
