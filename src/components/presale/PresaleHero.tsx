'use client'

import { useTranslation } from '@/hooks/useTranslation'

interface PresaleHeroProps {
  totalCount?: number
}

const PresaleHero = ({ totalCount }: PresaleHeroProps) => {
  const { t } = useTranslation()

  return (
    <section className="pt-48 pb-12 px-4 sm:px-10 max-w-screen-2xl mx-auto">
      <span className="section-number" suppressHydrationWarning>{t('presale.onDemand')}</span>
      <h1 className="serif font-light text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-textColor leading-none max-w-3xl">
        <span suppressHydrationWarning>{t('presale.intro.title').split(' ').slice(0, -2).join(' ')}</span>{' '}
        <em className="text-gold-accent not-italic" suppressHydrationWarning>
          {t('presale.intro.title').split(' ').slice(-2).join(' ')}
        </em>
      </h1>
      <p className="mt-8 text-[11px] uppercase tracking-[0.35em] text-textColor/60 max-w-xl leading-relaxed" suppressHydrationWarning>
        {t('presale.intro.subtitle').replace(/<br\s*\/?>/gi, ' ')}
      </p>
      {totalCount !== undefined && (
        <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-gold-accent/80" suppressHydrationWarning>
          {t('presale.availableCount').replace('{{count}}', String(totalCount))}
        </p>
      )}
    </section>
  )
}

export default PresaleHero
