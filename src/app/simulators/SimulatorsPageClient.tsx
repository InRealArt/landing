'use client'

import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'
import { salons } from '@/utils/artSalonCalculations'
import { EXTERNAL_URLS } from '@/constants/constants'
import SimulatorsAnimations from '@/components/simulators/SimulatorsAnimations'

export default function SimulatorsPageClient() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-[var(--canvas-bg)] pt-headerSize">
      <SimulatorsAnimations />
      <div className="max-w-screen-2xl mx-auto px-10 py-32">

        {/* Header */}
        <div className="text-center mb-28 border-b border-[var(--border-light)] pb-20">
          <span className="section-number">Outils Professionnels</span>
          <h1 data-anim="sim-hero-title" className="text-6xl md:text-8xl serif italic text-[var(--ink-black)] mt-6 mb-8 leading-none">
            Tous les{' '}
            <span className="text-[var(--gold-accent)]">Simulateurs</span>
          </h1>
          <p data-anim="sim-hero-sub" className="text-[11px] uppercase tracking-[0.3em] text-[var(--gray-text)] max-w-3xl mx-auto leading-relaxed">
            {t('simulators.description')}
          </p>
        </div>

        {/* Art Salon Simulators */}
        <section className="mb-28">
          <div data-anim="sim-section-header" className="border-b border-[var(--border-light)] pb-10 mb-16">
            <span className="section-number">01</span>
            <h2 className="text-5xl md:text-7xl serif italic leading-tight mt-4 text-[var(--ink-black)]">
              {t('footer.simulators')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-light)]">
            {Object.entries(salons).map(([slug, salon], index) => (
              <Link
                key={slug}
                href={`/art-salon-simulator/${slug}`}
                data-anim="sim-card" className="group bg-[var(--canvas-bg)] p-10 hover:bg-[var(--soft-gray)] transition-colors duration-500 flex flex-col justify-between"
              >
                <div>
                  <span className="serif italic text-4xl text-[var(--gold-accent)] block mb-6">
                    {String(index + 1).padStart(2, '0')}.
                  </span>
                  <h3 className="serif italic text-xl text-[var(--ink-black)] group-hover:text-[var(--gold-accent)] transition-colors mb-3">
                    {salon.name}
                  </h3>
                  <p className="text-[12px] text-[var(--gray-text)] leading-loose">
                    {t('footer.artSalonSimulator')}
                  </p>
                </div>
                <div className="mt-8 pt-6 border-t border-[var(--border-light)]">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--gray-text)] group-hover:text-[var(--ink-black)] transition-colors">
                    {t('simulators.accessSimulator')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Other Simulators */}
        <section className="mb-28">
          <div data-anim="sim-section-header" className="border-b border-[var(--border-light)] pb-10 mb-16">
            <span className="section-number">02</span>
            <h2 className="text-5xl md:text-7xl serif italic leading-tight mt-4 text-[var(--ink-black)]">
              {t('simulators.otherSimulators')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--border-light)]">

            {/* LOA Simulator */}
            <Link
              href="/loa-simulator"
              data-anim="sim-card" className="group bg-[var(--canvas-bg)] p-10 hover:bg-[var(--soft-gray)] transition-colors duration-500 flex flex-col justify-between"
            >
              <div>
                <span className="serif italic text-4xl text-[var(--gold-accent)] block mb-6">
                  01.
                </span>
                <h3 className="serif italic text-xl text-[var(--ink-black)] group-hover:text-[var(--gold-accent)] transition-colors mb-3">
                  {t('footer.loaSimulator')}
                </h3>
                <p className="text-[12px] text-[var(--gray-text)] leading-loose">
                  {t('simulators.loaDescription')}
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-[var(--border-light)]">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--gray-text)] group-hover:text-[var(--ink-black)] transition-colors">
                  {t('simulators.accessSimulator')}
                </span>
              </div>
            </Link>

            {/* Heritage & Art Simulator */}
            <Link
              href="/heritage-art-simulator"
              data-anim="sim-card" className="group bg-[var(--canvas-bg)] p-10 hover:bg-[var(--soft-gray)] transition-colors duration-500 flex flex-col justify-between"
            >
              <div>
                <span className="serif italic text-4xl text-[var(--gold-accent)] block mb-6">
                  02.
                </span>
                <h3 className="serif italic text-xl text-[var(--ink-black)] group-hover:text-[var(--gold-accent)] transition-colors mb-3">
                  {t('footer.heritageArtSimulator')}
                </h3>
                <p className="text-[12px] text-[var(--gray-text)] leading-loose">
                  {t('simulators.heritageDescription')}
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-[var(--border-light)]">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--gray-text)] group-hover:text-[var(--ink-black)] transition-colors">
                  {t('simulators.accessSimulator')}
                </span>
              </div>
            </Link>

          </div>
        </section>

        {/* Calendly CTA */}
        <div data-anim="sim-cta" className="border-t border-[var(--border-light)] pt-16 text-center">
          <Link
            href={EXTERNAL_URLS.CALENDLY_MEETING}
            target="_blank"
            className="btn-cta"
            data-umami-event="calendly-simulators-page-click"
          >
            {t('simulators.scheduleMeeting')}
          </Link>
        </div>

      </div>
    </div>
  )
}
