import { Metadata } from 'next'
import Hero from "@/components/usecase/leasing/Hero";
import Advantages from "@/components/usecase/leasing/Advantages";
import Benefits from "@/components/usecase/leasing/Benefits";
import Investment from "@/components/usecase/leasing/Investment";
import SliderSection from "@/components/usecase/leasing/SliderSection";
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Leasing artistique — Louez des oeuvres avec sens et impact',
  description: 'Une solution souple pour entreprises et collectionneurs : exposez des œuvres sélectionnées, valorisez votre image.',
  keywords: ['leasing art', 'location œuvres', 'art contemporain bureau', 'impact culturel'],
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