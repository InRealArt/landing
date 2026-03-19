'use client'

import { useLanguageStore } from '@/store/languageStore'
import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'

export default function Hero() {
  const { t } = useLanguageStore()

  return (
    <section className="relative w-full h-[55vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      <OptimizedBackgroundImage
        src="/images/marketplace/hero_marketplace.webp"
        alt={t('marketplace.hero.title')}
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full"
        overlay={false}
        priority={true}
      />

      {/* Dark gradient overlay — same pattern as TeamHero */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content pinned to bottom-left */}
      <div className="absolute inset-0 z-20 flex items-end">
        <div className="max-w-screen-2xl mx-auto w-full px-10 pb-16 md:pb-20 lg:pb-28">
          <div className="max-w-4xl">
            <span className="section-number text-white/60">{t('marketplace.hero.subtitle')}</span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl serif text-white leading-none">
              {t('marketplace.hero.titleLine1')}{' '}
              <span className="italic text-gold-accent">{t('marketplace.hero.titleLine2')}</span>
            </h1>
            <p className="mt-8 text-[11px] uppercase tracking-[0.3em] text-white/60 max-w-lg leading-relaxed">
              {t('marketplace.hero.description')}
            </p>
            <div className="mt-10">
              <span className="inline-block text-[0.6rem] uppercase tracking-[0.25em] border border-white/40 text-white/50 px-7 py-3.5 cursor-not-allowed select-none">
                {t('marketplace.hero.mainButton')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
