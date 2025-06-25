'use client'

import { useState } from 'react'
import { Container } from '@/components/common/Container'
import { useLanguageStore } from '@/store/languageStore'
import ArtworkLeaseForm from '@/components/loa-simulator/ArtworkLeaseForm'
import ArtworkLeaseResults from '@/components/loa-simulator/ArtworkLeaseResults'
import {
  type ArtworkLeaseResults as LeaseResultsType,
  type ArtworkLeaseComparison as ComparisonType,
  type ArtworkLeaseInputs
} from '@/utils/artworkLeaseCalculations'
import Image from 'next/image'

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

  return (
    <div className="min-h-screen bg-backgroundColor">
      <Container>
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Formulaire - Left side with dark background */}
            <div className="lg:sticky lg:top-20 lg:self-start">
              <ArtworkLeaseForm onCalculate={handleCalculation} />
            </div>

            {/* Résultats ou images d'artwork - Right side with purple background */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 flex flex-col gap-4 rounded-b-2xl lg:rounded-r-2xl lg:rounded-b-none">
              {results.leaseResults && results.comparison ? (
                <ArtworkLeaseResults 
                  leaseResults={results.leaseResults}
                  comparison={results.comparison}
                  formData={results.formData || undefined}
                />
              ) : (
                <div className="flex-1 flex items-end p-8 relative">
                  <Image
                    src="/images/joinUs-1.png"
                    alt="Portrait artwork"
                    width={300}
                    height={300}
                    className="rounded-lg shadow-lg w-1/2 h-auto"
                  />
                  <Image
                    src="/images/joinUs-2.png"
                    alt="Abstract artwork"
                    width={250}
                    height={200}
                    className="rounded-lg shadow-lg w-1/2 h-auto ml-[-20px] mb-[4rem]"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
} 