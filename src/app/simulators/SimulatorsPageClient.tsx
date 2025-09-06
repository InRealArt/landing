'use client'

import { useLanguageStore } from '@/store/languageStore'
import Link from 'next/link'
import { salons } from '@/utils/artSalonCalculations'

export default function SimulatorsPageClient() {
  const { t } = useLanguageStore()

  return (
    <div className="min-h-screen bg-backgroundColor pt-headerSize">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl bricolage-grotesque font-bold mb-6 text-textColor">
            {t('simulators.title')}
          </h1>
          <p className="text-lg text-grayText max-w-3xl mx-auto">
            {t('simulators.description')}
          </p>
        </div>

        {/* Art Salon Simulators */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-textColor">
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
          <h2 className="text-3xl font-bold mb-8 text-textColor">
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
            href="/"
            className="inline-flex items-center px-6 py-3 bg-purpleColor text-textColor rounded-lg hover:bg-purpleColor/90 transition-colors font-medium"
          >
            {t('simulators.backToHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}
