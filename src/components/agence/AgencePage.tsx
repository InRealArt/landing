'use client'

import { useTranslation } from '@/hooks/useTranslation'
import AgenceHero from './AgenceHero'
import AgenceDifferentiators from './AgenceDifferentiators'
import AgenceTopCreateurs from './AgenceTopCreateurs'
import AgencePartners from './AgencePartners'
import AgenceTestimonials from './AgenceTestimonials'
import AgencePricing from './AgencePricing'
import AgenceCta from './AgenceCta'
import AgenceCaseStudies from './AgenceCaseStudies'
import type { UgcTopArtistData } from '@/actions/ugcActions'

interface Props {
  topArtists: UgcTopArtistData[]
}

export default function AgencePage({ topArtists }: Props) {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-backgroundColor text-textColor">
      <AgenceHero t={t} />
      <AgenceDifferentiators t={t} />
      <AgenceTopCreateurs t={t} artists={topArtists} />
      <AgenceCaseStudies t={t} />
      <AgencePartners t={t} />
      <AgenceTestimonials t={t} artists={topArtists} />
      <AgencePricing t={t} />
      <AgenceCta t={t} />
    </main>
  )
}
