'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'
import { useLanguageStore } from '@/store/languageStore'

export default function TeamHero() {
  const { t } = useLanguageStore()

  return (
    <section className="relative w-full h-[50vh] md:h-[65vh] lg:h-[75vh] overflow-hidden">
      <OptimizedBackgroundImage
        src="/images/team/hero_team.avif"
        alt={t('team.hero.title')}
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full"
        overlay={false}
        priority={true}
      />

      {/* Dark overlay at bottom to ensure text readability in all themes */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Hero content pinned to bottom-left */}
      <div className="absolute inset-0 z-20 flex items-end">
        <div className="max-w-screen-2xl mx-auto w-full px-10 pb-16 md:pb-20 lg:pb-28">
          <div className="max-w-3xl">
            <span className="section-number text-white/60">{t('team.hero.subtitle')}</span>
            <h1 className="text-7xl md:text-9xl serif text-white leading-none">
              {t('team.hero.titleLine1')}{' '}
              <span className="italic text-[#b89c72]">{t('team.hero.titleLine2')}</span>
            </h1>
          </div>
        </div>
      </div>
    </section>
  )
}
