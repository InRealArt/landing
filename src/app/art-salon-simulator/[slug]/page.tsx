'use client'

import { useState, use } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import ArtSalonForm from '@/components/art-salon-simulator/ArtSalonForm'
import ArtSalonResults from '@/components/art-salon-simulator/ArtSalonResults'
import SimulatorLayout from '@/components/common/simulator/SimulatorLayout'
import FormSection from '@/components/common/simulator/FormSection'
import ResultSection from '@/components/common/simulator/ResultSection'
import { type ArtSalonResults as ArtSalonResultsType } from '@/utils/artSalonCalculations'
import { salons } from '@/utils/artSalonCalculations'

interface ArtSalonSimulatorPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function ArtSalonSimulatorPage({ params }: ArtSalonSimulatorPageProps) {
  const { slug } = use(params)
  
  // Check if salon exists
  const salon = salons[slug]
  if (!salon) {
    notFound()
  }

  const [results, setResults] = useState<{
    results: ArtSalonResultsType | null
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

  const handleCalculation = (calculationResults: ArtSalonResultsType, formData: { firstName: string, lastName: string, email: string, phone: string }) => {
    setResults({ results: calculationResults, formData })
  }

  // Default content for Art Salon simulator
  const defaultContent = (
    <div className="flex-1 flex items-center justify-center p-8">
      <Image
        src={salon.image}
        alt={`${salon.name} background`}
        width={500}
        height={400}
        className="rounded-lg shadow-lg opacity-80"
      />
    </div>
  )

  return (
    <SimulatorLayout>
      <FormSection>
        <ArtSalonForm 
          onCalculate={handleCalculation} 
          salonId={slug}
          salonName={salon.name}
        />
      </FormSection>

      <ResultSection 
        hasResults={!!results.results}
        defaultContent={defaultContent}
      >
        {results.results && (
          <ArtSalonResults 
            results={results.results}
            formData={results.formData}
          />
        )}
      </ResultSection>
    </SimulatorLayout>
  )
} 