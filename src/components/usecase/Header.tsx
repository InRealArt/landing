'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

type Profile = 'pme' | 'largeGroup' | 'hotel' | 'developer' | 'residential'
const PROFILES: Profile[] = ['pme', 'largeGroup', 'hotel', 'developer', 'residential']

export default function Header() {
  const { t } = useTranslation()
  const [activeProfile, setActiveProfile] = useState<Profile>('pme')

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
          <span className="italic" style={{ color: 'var(--gold-accent)' }}>
            {t('usecase.intro.titleAccent')}
          </span>{' '}
          {t('usecase.intro.titleAfter')}
        </h1>

        {/* Profile selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {PROFILES.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={activeProfile === p}
              onClick={() => setActiveProfile(p)}
              className={[
                'text-xs uppercase tracking-[0.35em] montserrat px-5 py-2.5 border transition-colors duration-200',
                activeProfile === p
                  ? 'border-gold-accent bg-gold-accent text-white'
                  : 'border-borderColor text-grayText hover:border-gold-accent/50 hover:text-textColor',
              ].join(' ')}
            >
              {t(`usecase.intro.profiles.${activeProfile === p ? activeProfile : p}.label`)}
            </button>
          ))}
        </div>

        <p className="text-sm uppercase tracking-[0.3em] text-grayText max-w-2xl mx-auto leading-relaxed transition-all duration-300">
          {t(`usecase.intro.profiles.${activeProfile}.tagline`)}
        </p>
      </div>
    </header>
  )
}
