'use client'

import { useState } from 'react'
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
import { getRandomSimulatorImage } from '@/utils/randomSimulatorImage'

export default function LoaSimulatorClient() {
  const { t } = useTranslation()
  const [results, setResults] = useState<{
    leaseResults: LeaseResultsType | null
    comparison: ComparisonType | null
    formData: ArtworkLeaseInputs | null
  }>({
    leaseResults: null,
    comparison: null,
    formData: null
  })

  const handleCalculation = (leaseResults: LeaseResultsType, comparison: ComparisonType, formData: ArtworkLeaseInputs) => {
    setResults({ leaseResults, comparison, formData })
  }

  // Default content for LOA simulator
  const defaultContent = (
    <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
      <OptimizedImage
        src={getRandomSimulatorImage()}
        alt="Simulateur LOA"
        width={500}
        height={500}
        className="w-full max-w-lg [&_img]:w-full [&_img]:h-auto [&_img]:object-cover"
      />
      <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--gray-text)] text-center">
        {t('loaSimulator.title')}
      </p>
    </div>
  )

  return (
    <SimulatorLayout>
      <FormSection>
        <ArtworkLeaseForm onCalculate={handleCalculation} />
      </FormSection>

      <ResultSection
        hasResults={!!(results.leaseResults && results.comparison)}
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
