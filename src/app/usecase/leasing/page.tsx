import { Metadata } from 'next'
import Hero from "@/components/usecase/leasing/Hero";
import Advantages from "@/components/usecase/leasing/Advantages";
import Benefits from "@/components/usecase/leasing/Benefits";
import Investment from "@/components/usecase/leasing/Investment";
import SliderSection from "@/components/usecase/leasing/SliderSection";
import LeasingFAQ from "@/components/usecase/leasing/LeasingFAQ";
import { generateStaticMetadata } from '@/utils/metadata'
import LeasingInfosServer from '@/components/common/LeasingInfosServer';
import LeasingAnimations from '@/components/usecase/leasing/LeasingAnimations';

export const metadata: Metadata = generateStaticMetadata({
  title: 'Leasing artistique — Louez des oeuvres avec sens et impact',
  description: 'Une solution souple pour entreprises et collectionneurs : exposez des œuvres sélectionnées, valorisez votre image.',
  keywords: ['leasing art', 'location œuvres', 'art contemporain bureau', 'impact culturel'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/usecase/leasing`
})

export default function LeasingPage() {
  return (
    <main className="min-h-screen bg-[var(--canvas-bg)] text-[var(--ink-black)]">
      <LeasingAnimations />
      <Hero />
      <Advantages />
      <Benefits />
      <Investment />
      {/* <LeasingInfosServer titleKey="leasing.slider.title" descriptionKey="leasing.slider.subtitle" /> */}
      <LeasingFAQ />
    </main>
  );
} 