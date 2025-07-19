import { Metadata } from 'next'
import Hero from "@/components/usecase/lending/Hero";
import Advantages from "@/components/usecase/lending/Advantages";
import Solutions from "@/components/usecase/lending/Solutions";
import Alternative from "@/components/usecase/lending/Alternative";
import ForWho from "@/components/usecase/lending/ForWho";
import { generateStaticMetadata } from '@/utils/metadata'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Prêt Garanti par l\'Art - Solutions de Financement',
  description: 'Obtenez un prêt garanti par vos œuvres d\'art avec InRealArt. Solutions de financement innovantes et sécurisées pour les collectionneurs.',
  keywords: ['prêt garanti art', 'financement art', 'collatéral art', 'liquidité art', 'prêt sur œuvre', 'art banking'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/usecase/lending`,
  alternateLanguages: {
    'fr': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/fr/usecase/lending`,
    'en': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/en/usecase/lending`
  }
})

export default function LendingPage() {
  return (
    <main className="min-h-screen text-white">
      <Hero />
      <Advantages />
      <Solutions />
      <Alternative />
      <ForWho />
    </main>
  );
} 