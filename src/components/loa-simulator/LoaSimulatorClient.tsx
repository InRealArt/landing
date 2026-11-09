'use client'

import { useEffect, useRef, useState } from 'react'
import OptimizedImage from '@/components/common/OptimizedImage'
import { useTranslation } from '@/hooks/useTranslation'
import ArtworkLeaseForm from '@/components/loa-simulator/ArtworkLeaseForm'
import ArtworkLeaseResults from '@/components/loa-simulator/ArtworkLeaseResults'
import SimulatorLayout from '@/components/common/simulator/SimulatorLayout'
import FormSection from '@/components/common/simulator/FormSection'
import ResultSection from '@/components/common/simulator/ResultSection'
import {
  type ArtworkLeaseResults as LeaseResultsType,
  type ArtworkLeaseComparison as ComparisonType,
  type ArtworkLeaseInputs
} from '@/utils/artworkLeaseCalculations'
import { useRandomSimulatorImage } from '@/hooks/useRandomSimulatorImage'

export default function LoaSimulatorClient({ headingLevel = 'h1' }: { headingLevel?: 'h1' | 'h2' }) {
  const { t } = useTranslation()
  const imageSrc = useRandomSimulatorImage()
  const [results, setResults] = useState<{
    leaseResults: LeaseResultsType | null
    comparison: ComparisonType | null
    formData: ArtworkLeaseInputs | null
  }>({
    leaseResults: null,
    comparison: null,
    formData: null
  })

  const resultsRef = useRef<HTMLDivElement>(null)
  const hasResults = !!(results.leaseResults && results.comparison)

  // Mobile : les résultats s'affichent sous le formulaire, on y amène le visiteur
  useEffect(() => {
    if (hasResults && window.matchMedia('(max-width: 1023px)').matches) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [results, hasResults])

  const handleCalculation = (leaseResults: LeaseResultsType, comparison: ComparisonType, formData: ArtworkLeaseInputs) => {
    setResults({ leaseResults, comparison, formData })
  }

  // Default content for LOA simulator
  const defaultContent = (
    <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
      {imageSrc ? (
        <OptimizedImage
          src={imageSrc}
          alt="Simulateur LOA"
          width={500}
          height={500}
          className="w-full max-w-lg [&_img]:w-full [&_img]:h-auto [&_img]:object-cover"
        />
      ) : (
        <div className="w-full max-w-lg aspect-[2/3]" aria-hidden="true" />
      )}
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--gray-text)] text-center">
        {t('loaSimulator.title')}
      </p>
    </div>
  )

  return (
    <SimulatorLayout>
      <FormSection>
        <ArtworkLeaseForm onCalculate={handleCalculation} headingLevel={headingLevel} />
      </FormSection>

      <ResultSection
        hasResults={hasResults}
        sectionRef={resultsRef}
        defaultContent={defaultContent}
      >
        {results.leaseResults && results.comparison && (
          <ArtworkLeaseResults
            leaseResults={results.leaseResults}
            comparison={results.comparison}
            formData={results.formData || undefined}
          />
        )}
      </ResultSection>
    </SimulatorLayout>
  )
}
