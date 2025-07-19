import { Metadata } from 'next'
import Header from "@/components/usecase/Header";
import CustomerStories from "@/components/usecase/CustomerStories";
import ReadyToStart from "@/components/usecase/ReadyToStart";
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Cas d\'Usage - Solutions InRealArt',
  description: 'Découvrez les différents cas d\'usage d\'InRealArt : leasing d\'art, prêt garanti, fractionnement d\'œuvres et solutions pour entreprises.',
  keywords: ['cas d\'usage', 'leasing art', 'prêt garanti', 'fractionnement', 'solutions entreprises', 'art tokenisé'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/usecase`,
  alternateLanguages: {
    'fr': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/fr/usecase`,
    'en': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/en/usecase`
  }
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