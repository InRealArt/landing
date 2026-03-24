import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'
import Header from '@/components/usecase/Header'
import UseCaseScenarios from '@/components/usecase/UseCaseScenarios'
import UseCaseImpact from '@/components/usecase/UseCaseImpact'
import UseCaseCtaFinal from '@/components/usecase/UseCaseCtaFinal'
import UseCaseFAQ from '@/components/usecase/UseCaseFAQ'
import UsecaseAnimations from '@/components/usecase/UsecaseAnimations'

export const metadata: Metadata = generateStaticMetadata({
  title: "Cas d'usage — Comment InRealArt accompagne chaque acteur",
  description:
    "Leasing, mécénat, investissement ou diffusion : découvrez toutes les façons d'interagir avec notre écosystème artistique.",
  keywords: ["cas d'usage art", 'leasing artistique', 'mécénat', 'diffusion œuvres'],
  canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/usecase`,
})

export default function UseCase() {
  return (
    <main className="min-h-screen" style={{ background: 'var(--canvas-bg)', color: 'var(--ink-black)' }}>
      <UsecaseAnimations />

      {/* 1. Hero full-bleed avec sous-pages grid */}
      <Header />

      {/* 2. Scénarios alternés image / texte */}
      <UseCaseScenarios />

      {/* 3. Section impact — fond noir, 3 stats */}
      <UseCaseImpact />

      {/* 4. CTA final */}
      <UseCaseCtaFinal />

      {/* 5. FAQ */}
      <UseCaseFAQ />
    </main>
  )
}
