'use client'

import { useState } from 'react'
import OptimizedImage from '@/components/common/OptimizedImage'
import HeritageArtForm from '@/components/heritage-art-simulator/HeritageArtForm'
import HeritageArtResults from '@/components/heritage-art-simulator/HeritageArtResults'
import SimulatorLayout from '@/components/common/simulator/SimulatorLayout'
import FormSection from '@/components/common/simulator/FormSection'
import ResultSection from '@/components/common/simulator/ResultSection'
import { type HeritageArtResults as HeritageArtResultsType } from '@/utils/heritageArtCalculations'
import { getRandomSimulatorImage } from '@/utils/randomSimulatorImage'

export default function HeritageArtSimulatorClient() {
  const [results, setResults] = useState<{
    results: HeritageArtResultsType | null
    formData: {
      firstName: string
      lastName: string
      email: string
      phone: string
    } | undefined
  }>({
    results: null,
    formData: undefined
  })

  const handleCalculation = (calculationResults: HeritageArtResultsType, formData: { firstName: string, lastName: string, email: string, phone: string }) => {
    setResults({ results: calculationResults, formData })
  }

  // Default content for Heritage Art simulator
  const defaultContent = (
    <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
      <OptimizedImage
        src={getRandomSimulatorImage()}
        alt="Simulateur Art Patrimoine"
        width={700}
        height={700}
        className="w-full max-w-lg [&_img]:w-full [&_img]:h-auto [&_img]:object-cover"
      />
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--gray-text)] text-center">
        Patrimoine & Art
      </p>
    </div>
  )

  return (
    <SimulatorLayout>
      <FormSection>
        <HeritageArtForm onCalculate={handleCalculation} />
      </FormSection>

      <ResultSection
        hasResults={!!results.results}
        defaultContent={defaultContent}
      >
        {results.results && (
          <HeritageArtResults
            results={results.results}
            formData={results.formData}
          />
        )}
      </ResultSection>
    </SimulatorLayout>
  )
}
