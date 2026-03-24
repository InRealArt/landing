'use client'

import { useLanguageStore } from '@/store/languageStore'

export default function Header() {
  const { t } = useLanguageStore()

  return (
    <header className="pt-32 md:pt-48 pb-16 md:pb-24 px-4 sm:px-6 lg:px-10 border-b border-borderColor">
      <div className="max-w-screen-2xl mx-auto text-center">
        <span className="section-number">
          {t('usecase.intro.label')}
        </span>
        <h1
          className="serif leading-tight mb-8"
          style={{ fontSize: 'clamp(3rem, 6vw, 5rem)' }}
        >
          {t('usecase.intro.titleBefore')}{' '}
          <span
            className="italic"
            style={{ color: 'var(--gold-accent)' }}
          >
            {t('usecase.intro.titleAccent')}
          </span>{' '}
          {t('usecase.intro.titleAfter')}
        </h1>
        <p className="text-[12px] uppercase tracking-[0.3em] text-grayText max-w-2xl mx-auto leading-relaxed">
          {t('usecase.intro.subtitle')}
        </p>
      </div>
    </header>
  )
}
