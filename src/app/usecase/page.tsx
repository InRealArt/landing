import { Metadata } from 'next'
import Header from "@/components/usecase/Header";
import CustomerStories from "@/components/usecase/CustomerStories";
import ReadyToStart from "@/components/usecase/ReadyToStart";
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Cas d\'usage — Comment InRealArt accompagne chaque acteur',
  description: 'Leasing, mécénat, investissement ou diffusion : découvrez toutes les façons d\'interagir avec notre écosystème artistique.',
  keywords: ['cas d\'usage art', 'leasing artistique', 'mécénat', 'diffusion œuvres'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/usecase`
})

export default function UseCase() {
  return (
    <main className="min-h-screen text-white">
      <Header />
      {/* <CustomerStories /> */}
      {/* <ReadyToStart /> */}
    </main>
  );
} 