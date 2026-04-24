'use client'

import { useTranslation } from '@/hooks/useTranslation'
import AgenceHero from './AgenceHero'
import AgenceDifferentiators from './AgenceDifferentiators'
import AgenceStreams from './AgenceStreams'
import AgencePricing from './AgencePricing'
import AgenceUgc from './AgenceUgc'
import AgenceCta from './AgenceCta'

export default function AgencePage() {
  const { t } = useTranslation()

  return (
    <main className="min-h-screen bg-backgroundColor text-textColor">
      <AgenceHero t={t} />
      <AgenceDifferentiators t={t} />
      <AgenceStreams t={t} />
      <AgencePricing t={t} />
      <AgenceUgc t={t} />
      <AgenceCta t={t} />
    </main>
  )
}
