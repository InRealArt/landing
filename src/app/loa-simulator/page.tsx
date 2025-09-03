'use client'

import { useState } from 'react'
import OptimizedImage from '@/components/common/OptimizedImage'
import { useLanguageStore } from '@/store/languageStore'
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
import LoaSimulatorFAQ from '@/components/loa-simulator/LoaSimulatorFAQ'

export default function LoaSimulatorPage() {
  const { t } = useLanguageStore()
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
    <div className="flex-1 flex items-end p-8 relative">
      <OptimizedImage
        src="/images/joinUs-1.png"
        alt="Portrait artwork"
        width={300}
        height={300}
        className="w-1/2 [&_img]:w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:shadow-lg"
      />
      <OptimizedImage
        src="/images/joinUs-2.png"
        alt="Abstract artwork"
        width={250}
        height={200}
        className="w-1/2 ml-[-20px] mb-[4rem] [&_img]:w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:shadow-lg"
      />
    </div>
  )

  return (
    <>  
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
    <LoaSimulatorFAQ />
    </>
  )
} 