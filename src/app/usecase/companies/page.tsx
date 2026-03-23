import { Metadata } from 'next'
import Hero from "@/components/usecase/companies/Hero";
import Possibilities from "@/components/usecase/companies/Possibilities";
import { generateStaticMetadata } from '@/utils/metadata'
import CompaniesFAQ from '@/components/usecase/companies/CompaniesFAQ';
import CompaniesAnimations from '@/components/usecase/companies/CompaniesAnimations';

export const metadata: Metadata = generateStaticMetadata({
  title: 'Art & entreprise — Intégrer l\'Art au cœur de votre stratégie',
  description: 'Proposez à vos collaborateurs et visiteurs une expérience artistique forte. Leasing, curation, visibilité et engagement culturel.',
  keywords: ['art entreprise', 'curation corporate', 'mécénat culturel', 'leasing œuvres'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/usecase/companies`
})

export default function CompaniesPage() {
  return (
    <main className="min-h-screen bg-[var(--canvas-bg)] text-[var(--ink-black)]">
      <CompaniesAnimations />
      <Hero />
      {/* <Expert /> */}
      <Possibilities />
      <CompaniesFAQ/>
    </main>
  );
} 