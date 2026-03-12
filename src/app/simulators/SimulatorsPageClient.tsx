'use client'

import { useLanguageStore } from '@/store/languageStore'
import Link from 'next/link'
import { salons } from '@/utils/artSalonCalculations'
import { EXTERNAL_URLS } from '@/constants/constants'

export default function SimulatorsPageClient() {
  const { t } = useLanguageStore()

  return (
    <div className="min-h-screen bg-canvas-white pt-headerSize">
      <div className="max-w-screen-2xl mx-auto px-10 py-16">
        {/* Header */}
        <div className="text-center mb-16 border-b border-border-light pb-12">
          <span className="section-number">Outils Professionnels</span>
          <h1 className="text-6xl md:text-8xl serif text-ink-black mb-6">
            Tous les <span className="italic text-gold-accent">Simulateurs</span>
          </h1>
          <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t('simulators.description')}
          </p>
        </div>

        {/* Art Salon Simulators */}
        <section className="mb-16">
          <h2 className="text-5xl md:text-7xl serif italic leading-tight mb-8 text-textColor">
            {t('footer.simulators')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(salons).map(([slug, salon]) => (
              <Link
                key={slug}
                href={`/art-salon-simulator/${slug}`}
                className="group bg-cardBackground border border-textColor/20 rounded-lg p-6 hover:border-purpleColor/50 transition-all duration-300 hover:shadow-lg"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-textColor group-hover:text-purpleColor transition-colors">
                    {salon.name}
                  </h3>
                  <p className="text-grayText text-sm mt-2">
                    {t('footer.artSalonSimulator')}
                  </p>
                </div>
                <div className="flex items-center text-purpleColor group-hover:text-purpleColor/80 transition-colors">
                  <span className="text-sm font-medium">
                    {t('simulators.accessSimulator')} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Other Simulators */}
        <section className="mb-16">
          <h2 className="text-5xl md:text-7xl serif italic leading-tight mb-8 text-textColor">
            {t('simulators.otherSimulators')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* LOA Simulator */}
            <Link
              href="/loa-simulator"
              className="group bg-cardBackground border border-textColor/20 rounded-lg p-6 hover:border-purpleColor/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-textColor group-hover:text-purpleColor transition-colors">
                  {t('footer.loaSimulator')}
                </h3>
                <p className="text-grayText text-sm mt-2">
                  {t('simulators.loaDescription')}
                </p>
              </div>
              <div className="flex items-center text-purpleColor group-hover:text-purpleColor/80 transition-colors">
                <span className="text-sm font-medium">
                  {t('simulators.accessSimulator')} →
                </span>
              </div>
            </Link>

            {/* Heritage & Art Simulator */}
            <Link
              href="/heritage-art-simulator"
              className="group bg-cardBackground border border-textColor/20 rounded-lg p-6 hover:border-purpleColor/50 transition-all duration-300 hover:shadow-lg"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-textColor group-hover:text-purpleColor transition-colors">
                  {t('footer.heritageArtSimulator')}
                </h3>
                <p className="text-grayText text-sm mt-2">
                  {t('simulators.heritageDescription')}
                </p>
              </div>
              <div className="flex items-center text-purpleColor group-hover:text-purpleColor/80 transition-colors">
                <span className="text-sm font-medium">
                  {t('simulators.accessSimulator')} →
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Back to Home */}
        <div className="text-center">
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
