import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'
import LeasingHero from '@/components/usecase/leasing/LeasingHero';
import LeasingAdvantages from '@/components/usecase/leasing/LeasingAdvantages';
import LeasingProcess from '@/components/usecase/leasing/LeasingProcess';
import LeasingSimulatorForm from '@/components/usecase/leasing/LeasingSimulatorForm';
import LeasingFAQ from '@/components/usecase/leasing/LeasingFAQ';

export const metadata: Metadata = generateStaticMetadata({
  title: 'Leasing d\'Art | InRealArt - Solutions Entreprises',
  description: 'Optimisez la fiscalité de votre entreprise tout en sublimant vos espaces de travail grâce à nos solutions de Location avec Option d\'Achat (LOA).',
  keywords: ['leasing art', 'location œuvres', 'art contemporain bureau', 'investissement art', 'LOA art'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/usecase/leasing`
})

export default function LeasingPage() {
  return (
    <main className="min-h-screen bg-[var(--canvas-bg)] text-[var(--ink-black)]">
      <LeasingHero />
      <LeasingAdvantages />
      <LeasingProcess />
      <LeasingSimulatorForm />
      <LeasingFAQ />
    </main>
  );
} 