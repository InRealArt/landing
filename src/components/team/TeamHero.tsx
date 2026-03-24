'use client'

import { useLanguageStore } from '@/store/languageStore'

export default function TeamHero() {
  const { t } = useLanguageStore()

  return (
    <section className="pt-40 pb-16 px-10 bg-backgroundColor">
      <div className="max-w-screen-xl mx-auto">
        <div className="border-b border-borderColor pb-12 mb-20">
          <span className="section-number">{t('team.hero.subtitle')}</span>
          <h1 className="text-5xl md:text-7xl serif leading-tight">
            {t('team.hero.titleLine1')}<br />
            <span className="italic text-[#b89c72]">{t('team.hero.titleLine2')}</span>
          </h1>
        </div>
      </div>
    </section>
  )
}
