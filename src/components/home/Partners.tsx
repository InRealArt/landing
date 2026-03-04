import { Suspense } from 'react'
import { getArtists } from '@/actions/artistActions'
import PartnersSkeleton from './PartnersSkeleton'
import PartnersClientWrapper from './PartnersClientWrapper'

async function PartnersContent() {
  const artists = await getArtists(true)

  const partners = artists.map(artist => ({
    id: artist.id,
    slug: artist.slug,
    name: `${artist.name} ${artist.surname}`.trim(),
    photo: artist.imageUrl,
    countryName: artist.countryName ?? null
  }))

  return <PartnersClientWrapper partners={partners} />
}

export default function Partners() {
  return (
    <Suspense fallback={<PartnersSkeleton />}>
      <PartnersContent />
    </Suspense>
  )
}
