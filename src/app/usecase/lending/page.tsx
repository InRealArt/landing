import { Metadata } from 'next'
import Hero from "@/components/usecase/lending/Hero";
import Advantages from "@/components/usecase/lending/Advantages";
import Solutions from "@/components/usecase/lending/Solutions";
import Alternative from "@/components/usecase/lending/Alternative";
import ForWho from "@/components/usecase/lending/ForWho";
import { generateStaticMetadata } from '@/utils/metadata'
import LendingFAQ from '@/components/usecase/lending/LendingFAQ';

export const metadata: Metadata = generateStaticMetadata({
  title: 'Financement par l\'Art — Prêt garanti, valeur symbolique',
  description: 'Bénéficiez de solutions de financement en adossant vos œuvres comme garantie. Expertise curatoriale et sécurité.',
  keywords: ['prêt art', 'garantie artistique', 'financement culturel', 'actifs symboliques'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/usecase/lending`
})

export default function LendingPage() {
  return (
    <main className="min-h-screen text-textColor">
      <Hero />
      <Advantages />
      <Solutions />
      <Alternative />
      <ForWho />
      <LendingFAQ />
    </main>
  );
} 