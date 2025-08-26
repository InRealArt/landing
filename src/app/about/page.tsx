'use client'

import { Suspense } from 'react'
import AboutHero from '@/components/about/AboutHero'
import AboutSection1 from '@/components/about/AboutSection1'
import AboutSection2 from '@/components/about/AboutSection2'
import NewsletterInline from '@/components/common/NewsletterInline'

export default function AboutPage() {
  return (
    <>
      {/* Hero Section avec image hero_about.webp */}
      <AboutHero />
      
      {/* Section 1 : contenu avec mise en page en deux colonnes */}
      <AboutSection1 />
      
      {/* Section 2 : image de femme à gauche, contenu à droite */}
      <AboutSection2 />
      
      {/* Section 3 : newsletter */}
      <NewsletterInline />
      {/* Le footer est automatiquement inclus via le layout principal */}
    </>
  )
}
