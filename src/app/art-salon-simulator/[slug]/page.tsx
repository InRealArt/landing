'use client'

import { useState, use } from 'react'
import OptimizedImage from '@/components/common/OptimizedImage'
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
  
  // Layout server component already guards against invalid slugs with permanentRedirect
  const salon = salons[slug]!

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
    <div className="flex-1 flex flex-col items-center justify-center p-8 gap-6">
      <OptimizedImage
        src={salon.image}
        alt={`${salon.name} background`}
        width={500}
        height={400}
        className="[&_img]:opacity-90 [&_img]:w-full [&_img]:h-auto [&_img]:object-cover"
      />
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--gray-text)] text-center">
        {salon.name}
      </p>
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