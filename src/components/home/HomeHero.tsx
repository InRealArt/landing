'use client'

import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import gsap from 'gsap'
import { useTranslation } from '@/hooks/useTranslation'
import { EXTERNAL_URLS } from '@/constants/constants'
import type { FeaturedArtist, FeaturedArtwork, FeaturedPost } from '@/types/featured-item'

type Profile = 'collector' | 'artist' | 'enterprise'

interface HomeHeroProps {
  featuredArtist: FeaturedArtist | null
  featuredArtwork: FeaturedArtwork | null
  featuredPost: FeaturedPost | null
}

interface ProfileConfig {
  key: Profile
  labelKey: string
  ctaKey: string
  href: string
  headlineKey: string
  subheadlineKey: string
  imagePath: string
  description: string
}

const PROFILES: ProfileConfig[] = [
  {
    key: 'collector',
    labelKey: 'exhibitions.hero.profileCollector',
    ctaKey: 'exhibitions.hero.ctaCollector',
    href: '/presale',
    headlineKey: 'exhibitions.hero.claimCollector',
    subheadlineKey: 'exhibitions.hero.subheadlineCollector',
    imagePath: '/images/persona-heroes/collector.webp',
    description: 'Découvrez et acquérez des œuvres exclusives',
  },
  {
    key: 'artist',
    labelKey: 'exhibitions.hero.profileArtist',
    ctaKey: 'exhibitions.hero.ctaArtist',
    href: '/joinInRealArt',
    headlineKey: 'exhibitions.hero.claimArtist',
    subheadlineKey: 'exhibitions.hero.subheadlineArtist',
    imagePath: '/images/persona-heroes/artist.avif',
    description: 'Monétisez votre art et contrôlez vos ventes',
  },
  {
    key: 'enterprise',
    labelKey: 'exhibitions.hero.profileEnterprise',
    ctaKey: 'exhibitions.hero.ctaEnterprise',
    href: '/usecase',
    headlineKey: 'exhibitions.hero.claimEnterprise',
    subheadlineKey: 'exhibitions.hero.subheadlineEnterprise',
    imagePath: '/images/persona-heroes/enterprise.avif',
    description: 'Solutions d\'acquisition pour institutions',
  },
  // {
  //   key: 'brand',
  //   labelKey: 'exhibitions.hero.profileBrand',
  //   ctaKey: 'exhibitions.hero.ctaBrand',
  //   href: '/agence',
  //   headlineKey: 'exhibitions.hero.claimBrand',
  //   subheadlineKey: 'exhibitions.hero.subheadlineBrand',
  //   imagePath: '/images/persona-heroes/brand.avif',
  //   description: 'Partenaires créatifs et marques de prestige',
  // },
]

export default function HomeHero({ featuredArtist, featuredArtwork, featuredPost }: HomeHeroProps) {
  const { t } = useTranslation()
  const [active, setActive] = useState<Profile>('collector')
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadlineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const cardsRef = useRef<(HTMLButtonElement | null)[]>([])

  const current = PROFILES.find((p) => p.key === active)!

  // Animate headline + subheading on persona change
  useEffect(() => {
    if (!headlineRef.current || !subheadlineRef.current) return

    const headlineSpans = headlineRef.current.querySelectorAll('span')
    const tl = gsap.timeline()

    // Fade out + slide up current content
    tl.to(headlineSpans, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.in',
    }, 0)

    tl.to(subheadlineRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: 'power2.in',
    }, 0)

    // Fade in + slide down new content
    tl.to(headlineSpans, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power2.out',
    }, 0.15)

    tl.to(subheadlineRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, 0.15)
  }, [active])

  // CTA subtle pulse animation on mount
  useLayoutEffect(() => {
    if (!ctaRef.current) return

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 7 })
    tl.to(
      ctaRef.current,
      {
        scale: 1.05,
        boxShadow: '0 8px 32px rgba(184, 156, 114, 0.4)',
        duration: 0.3,
        ease: 'power2.out',
      },
      0
    ).to(
      ctaRef.current,
      {
        scale: 1,
        boxShadow: '0 0px 0px rgba(184, 156, 114, 0)',
        duration: 0.3,
        ease: 'power2.out',
      },
      0.3
    )

    return () => {
      tl.kill()
    }
  }, [])

  // Card hover + active animations
  const handleCardHover = (e: React.MouseEvent<HTMLButtonElement>, isEnter: boolean) => {
    gsap.to(e.currentTarget, {
      scale: isEnter ? 1.02 : 1,
      duration: 0.3,
      ease: 'power2.inOut',
    })
  }

  return (
    <section className="w-full bg-black pt-headerSize">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 py-20 md:py-28 lg:py-36">

        {/* Persona Selector avec contexte */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col gap-4">
            {/* Label instructionnel */}
            <div className="flex items-center gap-2">
              <span className="text-white/50 text-[11px] uppercase tracking-[0.3em] font-medium">
                {t('exhibitions.hero.whoAreYou') || 'Qui êtes-vous ?'}
              </span>
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" aria-hidden="true" />
            </div>

            {/* Boutons toggle profil - layout avec images */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
              role="group"
              aria-label="Choisissez votre profil"
            >
              {PROFILES.map((p, idx) => (
                <button
                  key={p.key}
                  ref={(el) => {
                    cardsRef.current[idx] = el
                  }}
                  type="button"
                  onClick={() => setActive(p.key)}
                  onMouseEnter={(e) => handleCardHover(e, true)}
                  onMouseLeave={(e) => handleCardHover(e, false)}
                  suppressHydrationWarning
                  className={`
                    relative group text-left overflow-hidden
                    h-40 sm:h-48
                    ${active === p.key
                      ? 'border-t-4 border-l border-r border-b border-gold-accent'
                      : 'border border-white/20 hover:border-white/50'}
                  `}
                  aria-pressed={active === p.key}
                >
                  {/* Background image */}
                  <Image
                    src={p.imagePath}
                    alt={t(p.labelKey)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority={active === p.key}
                  />

                  {/* Gradient overlay - du bas vers haut pour lire le texte */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" aria-hidden="true" />

                  {/* Content (en bas de la card) */}
                  <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 z-10">
                    {/* Label */}
                    <span className={`
                      text-sm sm:text-base uppercase tracking-[0.25em] font-bold transition-colors mb-2
                      ${active === p.key ? 'text-gold-accent' : 'text-white/90'}
                    `}>
                      {t(p.labelKey)}
                    </span>

                    {/* Description */}
                    <p className={`
                      text-xs sm:text-sm leading-snug transition-all duration-300
                      ${active === p.key ? 'text-white/80 opacity-100' : 'text-white/50 opacity-0 group-hover:opacity-100'}
                    `}>
                      {p.description}
                    </p>
                  </div>

                  {/* Indicator border (actif) */}
                  {active === p.key && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-gold-accent" aria-hidden="true" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Claim (contextual per persona) */}
        <div className="mb-8 md:mb-10 max-w-3xl" key={active}>
          <h1
            ref={headlineRef}
            className="unbounded text-white font-black uppercase leading-[0.9] tracking-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
            suppressHydrationWarning
          >
            {/* Headline adaptatif par persona */}
            <span className="block text-white">{t(current.headlineKey)}</span>
            <span className="block text-gold-accent">
              {active === 'collector'
                ? t('exhibitions.hero.claimAccent')
                : active === 'artist'
                ? t('exhibitions.hero.claimAccentArtist')
                : t('exhibitions.hero.claimAccentEnterprise')}
            </span>
          </h1>

          {/* Subheading contextuel */}
          <p
            ref={subheadlineRef}
            className="mt-6 text-white/70 text-sm sm:text-base max-w-2xl leading-relaxed"
            suppressHydrationWarning
          >
            {t(current.subheadlineKey)}
          </p>
        </div>

        {/* CTA Row - simplifiée et plus claire */}
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          {/* CTA Primaire */}
          <Link
            ref={ctaRef}
            href={current.href}
            suppressHydrationWarning
            className="inline-flex items-center gap-3 bg-white text-black text-[11px] uppercase tracking-[0.3em] font-bold px-8 py-4 hover:bg-gold-accent transition-all duration-200 shadow-lg hover:shadow-gold-accent/30"
          >
            {t(current.ctaKey)}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          {/* CTA Secondaire Calendly */}
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
