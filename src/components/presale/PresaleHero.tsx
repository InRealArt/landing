'use client'

import { useLanguageStore } from '@/store/languageStore'

const PresaleHero = () => {
  const { t } = useLanguageStore()

  return (
    <section className="pt-48 pb-12 px-4 sm:px-10 max-w-screen-2xl mx-auto">
      <span className="section-number">{t('presale.onDemand')}</span>
      <h1 className="serif font-light text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-textColor leading-none max-w-3xl">
        {t('presale.intro.title').split(' ').slice(0, -2).join(' ')}{' '}
        <em className="text-gold-accent not-italic">
          {t('presale.intro.title').split(' ').slice(-2).join(' ')}
        </em>
      </h1>
      <p className="mt-8 text-[11px] uppercase tracking-[0.35em] text-textColor/60 max-w-xl leading-relaxed">
        {t('presale.intro.subtitle').replace(/<br\s*\/?>/gi, ' ')}
      </p>
    </section>
  )
}

export default PresaleHero
