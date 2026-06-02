import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'
import Header from '@/components/usecase/Header'
import UseCaseScenarios from '@/components/usecase/UseCaseScenarios'
import UseCaseFiscalStats from '@/components/usecase/UseCaseFiscalStats'
import UseCaseInlineSimulator from '@/components/usecase/UseCaseInlineSimulator'
import UseCaseImpact from '@/components/usecase/UseCaseImpact'
import UseCaseCtaFinal from '@/components/usecase/UseCaseCtaFinal'
import UseCaseFAQ from '@/components/usecase/UseCaseFAQ'
import UsecaseAnimations from '@/components/usecase/UsecaseAnimations'

export const metadata: Metadata = generateStaticMetadata({
  title: "L'art comme actif stratégique — InRealArt Capital",
  description:
    "Leasing d'art 100% déductible, amortissement sur 5 ans, TVA récupérable. Découvrez comment InRealArt accompagne entreprises, hôtels et promoteurs.",
  keywords: ["leasing art entreprise", "cas d'usage art", 'LOA art', 'avantages fiscaux art', 'investissement art'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/usecase`,
})

export default function UseCase() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--canvas-bg)', color: 'var(--ink-black)' }}>
      <UsecaseAnimations />

      {/* 1. Hero + sélecteur profil */}
      <Header />

      {/* 2. 3 chiffres fiscaux clés */}
      <UseCaseFiscalStats />

      {/* 3. Scénarios avec ROI chiffrés */}
      <UseCaseScenarios />

      {/* 4. Simulateur LOA inline */}
      <UseCaseInlineSimulator />

      {/* 5. Section impact */}
      <UseCaseImpact />

      {/* 6. Double CTA final */}
      <UseCaseCtaFinal />

      {/* 7. FAQ */}
      <UseCaseFAQ />
    </main>
  )
}
