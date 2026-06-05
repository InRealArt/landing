'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { EXTERNAL_URLS } from '@/constants/constants'

type Profile = 'collector' | 'artist' | 'enterprise' | 'brand'

const PROFILES: { key: Profile; labelKey: string; ctaKey: string; href: string }[] = [
  { key: 'collector',  labelKey: 'exhibitions.hero.profileCollector',  ctaKey: 'exhibitions.hero.ctaCollector',  href: '/presale' },
  { key: 'artist',     labelKey: 'exhibitions.hero.profileArtist',     ctaKey: 'exhibitions.hero.ctaArtist',     href: '/joinInRealArt' },
  { key: 'enterprise', labelKey: 'exhibitions.hero.profileEnterprise', ctaKey: 'exhibitions.hero.ctaEnterprise', href: '/usecase' },
  { key: 'brand',      labelKey: 'exhibitions.hero.profileBrand',      ctaKey: 'exhibitions.hero.ctaBrand',      href: '/agence' },
]

export default function HomeHero() {
  const { t } = useTranslation()
  const [active, setActive] = useState<Profile>('collector')

  const current = PROFILES.find((p) => p.key === active)!

  return (
    <section className="w-full bg-black pt-headerSize">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 py-20 md:py-28 lg:py-36">

        {/* Claim */}
        <div className="mb-10 md:mb-12 max-w-3xl">
          <h1
            className="unbounded text-white font-black uppercase leading-[0.9] tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
            suppressHydrationWarning
          >
            {t('exhibitions.hero.claim')}
            <br />
            <span className="text-gold-accent">{t('exhibitions.hero.claimAccent')}</span>
          </h1>
        </div>

        {/* Sélecteur de profil + CTA */}
        <div className="flex flex-col items-start gap-5">

          {/* Ligne 1 : boutons toggle profil + séparateur + CTA primaire */}
          <div className="flex flex-wrap items-center gap-4">

            {/* Boutons toggle profil */}
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label="Choisissez votre profil"
            >
              {PROFILES.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setActive(p.key)}
                  suppressHydrationWarning
                  className={`
                    text-[10px] uppercase tracking-[0.25em] px-4 py-2.5 font-medium transition-all duration-200
                    ${active === p.key
                      ? 'bg-gold-accent text-black'
                      : 'bg-transparent text-white/70 border border-white/30 hover:border-white/70 hover:text-white'}
                  `}
                >
                  {t(p.labelKey)}
                </button>
              ))}
            </div>

            {/* Séparateur vertical */}
            <div className="hidden sm:block w-px h-6 bg-white/20" aria-hidden="true" />

            {/* CTA primaire */}
            <Link
              href={current.href}
              suppressHydrationWarning
              className="inline-flex items-center gap-3 bg-white text-black text-[11px] uppercase tracking-[0.3em] font-bold px-6 py-3 hover:bg-gold-accent transition-colors duration-200"
            >
              {t(current.ctaKey)}
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

          </div>

          {/* Ligne 2 : CTA Calendly secondaire */}
          <a
            href={EXTERNAL_URLS.CALENDLY_MEETING}
            target="_blank"
            rel="noopener noreferrer"
            suppressHydrationWarning
            className="inline-flex items-center gap-2 text-white/50 text-[10px] uppercase tracking-[0.25em] font-medium hover:text-gold-accent transition-colors duration-200 group"
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true" className="shrink-0">
              <rect x="1" y="2.5" width="11" height="9.5" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <path d="M1 5.5h11" stroke="currentColor" strokeWidth="1.2" />
              <path d="M4 1v3M9 1v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span className="border-b border-white/20 group-hover:border-gold-accent/50 transition-colors duration-200 pb-px">
              {t('exhibitions.hero.ctaCalendly')}
            </span>
          </a>

        </div>
      </div>
    </section>
  )
}
