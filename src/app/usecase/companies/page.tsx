import { Metadata } from 'next'
import Hero from "@/components/usecase/companies/Hero";
import Expert from "@/components/usecase/companies/Expert";
import Possibilities from "@/components/usecase/companies/Possibilities";
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Solutions pour Entreprises - Art Corporate',
  description: 'Solutions InRealArt pour les entreprises : collection d\'art corporate, mécénat, investissement et décoration professionnelle.',
  keywords: ['art corporate', 'entreprise art', 'mécénat entreprise', 'collection corporate', 'investissement art entreprise', 'décoration bureau'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/usecase/companies`,
  alternateLanguages: {
    'fr': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/fr/usecase/companies`,
    'en': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/en/usecase/companies`
  }
})

export default function CompaniesPage() {
  return (
    <main className="min-h-screen text-white">
      <Hero />
      <Expert />
      <Possibilities />
    </main>
  );
} 