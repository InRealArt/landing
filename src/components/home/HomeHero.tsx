'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'

type Profile = 'collector' | 'artist' | 'enterprise'

const PROFILES: { key: Profile; labelKey: string; ctaKey: string; href: string }[] = [
  { key: 'collector',  labelKey: 'exhibitions.hero.profileCollector',  ctaKey: 'exhibitions.hero.ctaCollector',  href: '/presale' },
  { key: 'artist',     labelKey: 'exhibitions.hero.profileArtist',     ctaKey: 'exhibitions.hero.ctaArtist',     href: '/joinInRealArt' },
  { key: 'enterprise', labelKey: 'exhibitions.hero.profileEnterprise', ctaKey: 'exhibitions.hero.ctaEnterprise', href: '/usecase' },
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">

          {/* Boutons toggle profil */}
          <div
            className="flex gap-2"
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
      </div>
    </section>
  )
}
