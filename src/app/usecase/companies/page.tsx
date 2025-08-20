import { Metadata } from 'next'
import Hero from "@/components/usecase/companies/Hero";
import Expert from "@/components/usecase/companies/Expert";
import Possibilities from "@/components/usecase/companies/Possibilities";
import { generateStaticMetadata } from '@/utils/metadata'
import CompaniesFAQ from '@/components/usecase/companies/CompaniesFAQ';

export const metadata: Metadata = generateStaticMetadata({
  title: 'Art & entreprise — Intégrer l\'Art au cœur de votre stratégie',
  description: 'Proposez à vos collaborateurs et visiteurs une expérience artistique forte. Leasing, curation, visibilité et engagement culturel.',
  keywords: ['art entreprise', 'curation corporate', 'mécénat culturel', 'leasing œuvres'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/usecase/companies`
})

export default function CompaniesPage() {
  return (
    <main className="min-h-screen text-white">
      <Hero />
      <Expert />
      <Possibilities />
      <CompaniesFAQ/>
    </main>
  );
} 