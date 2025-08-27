'use client'

import { Suspense } from 'react'
import AcademyHero from '@/components/academy/AcademyHero'
import AcademySection1 from '@/components/academy/AcademySection1'
import AcademySection2 from '@/components/academy/AcademySection2'
import AcademySection3 from '@/components/academy/AcademySection3'
import NewsletterInline from '@/components/common/NewsletterInline'

export default function AcademyPage() {
  return (
    <>
      {/* Hero Section */}
      <AcademyHero />
      
      {/* Section 1 : Grille de blocs */}
      <AcademySection1 />
      
      {/* Section 2 : Approfondissez vos connaissances */}
      <AcademySection2 />
      
      {/* Section 3 : Marché de confiance */}
      <AcademySection3 />
      
      {/* Section newsletter */}
      <NewsletterInline />
      {/* Le footer est automatiquement inclus via le layout principal */}
    </>
  )
}
