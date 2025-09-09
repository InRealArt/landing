'use client'

import { useState } from 'react'
import OptimizedImage from '@/components/common/OptimizedImage'
import HeritageArtForm from '@/components/heritage-art-simulator/HeritageArtForm'
import HeritageArtResults from '@/components/heritage-art-simulator/HeritageArtResults'
import SimulatorLayout from '@/components/common/simulator/SimulatorLayout'
import FormSection from '@/components/common/simulator/FormSection'
import ResultSection from '@/components/common/simulator/ResultSection'
import { type HeritageArtResults as HeritageArtResultsType } from '@/utils/heritageArtCalculations'
import HeritageArtSimulatorFAQ from '@/components/heritage-art-simulator/HeritageArtSimulatorFAQ'
import { getRandomSimulatorImage } from '@/utils/randomSimulatorImage'

export default function HeritageArtSimulatorPage() {
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
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center space-y-6">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] xl:w-[32rem] xl:h-[32rem] mx-auto">
          <div className="w-full h-full overflow-hidden rounded-lg shadow-lg">
            <OptimizedImage
              src={getRandomSimulatorImage()}
              alt="Simulateur Art Patrimoine"
              width={700}
              height={700}
              className="w-full h-full [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <> 
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
    <HeritageArtSimulatorFAQ />
    </>
  )
} 