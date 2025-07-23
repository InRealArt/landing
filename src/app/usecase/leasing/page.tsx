import { Metadata } from 'next'
import Hero from "@/components/usecase/leasing/Hero";
import Advantages from "@/components/usecase/leasing/Advantages";
import Benefits from "@/components/usecase/leasing/Benefits";
import Investment from "@/components/usecase/leasing/Investment";
import SliderSection from "@/components/usecase/leasing/SliderSection";
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Leasing d\'Art - Location avec Option d\'Achat',
  description: 'Découvrez le leasing d\'art avec InRealArt. Location avec option d\'achat d\'œuvres d\'art, avantages fiscaux et investissement progressif.',
  keywords: ['leasing art', 'location avec option d\'achat', 'LOA art', 'investissement art', 'avantages fiscaux', 'art corporate'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/usecase/leasing`
})

export default function LeasingPage() {
  return (
    <main className="min-h-screen text-white">
      <Hero />
      <Advantages />
      <Benefits />
      <Investment />
      <SliderSection />
    </main>
  );
} 