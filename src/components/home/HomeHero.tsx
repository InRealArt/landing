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
  const featuredRef = useRef<HTMLDivElement>(null)

  const current = PROFILES.find((p) => p.key === active)!

  const hasFeaturedContent =
    (active === 'collector' && featuredArtwork !== null) ||
    (active === 'artist' && featuredArtist !== null) ||
    (active === 'enterprise' && featuredPost !== null)

  // Animate headline + subheading + featured zone on persona change
  useEffect(() => {
    if (!headlineRef.current || !subheadlineRef.current) return

    const headlineSpans = headlineRef.current.querySelectorAll('span')
    const tl = gsap.timeline()

    // Fade out + slide up — headline, subheading, featured zone
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

    if (featuredRef.current) {
      tl.to(featuredRef.current, {
        opacity: 0,
        y: -8,
        duration: 0.25,
        ease: 'power2.in',
      }, 0)
    }

    // Fade in + slide down — headline, subheading, featured zone
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

    if (featuredRef.current) {
      tl.to(featuredRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      }, 0.2)
    }

    return () => {
      tl.kill()
    }
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

        {/* Persona Selector */}
        <div className="mb-8 md:mb-12">
          <div className="flex flex-col gap-4">
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

        {/* Featured contextuelle par persona */}
        {hasFeaturedContent && (
          <div ref={featuredRef} className="mb-12">
            {/* Image — très grande, dominante, avec badge en overlay */}
            <a
              href={
                active === 'collector' ? '/presale' :
                active === 'artist' && featuredArtist ? `/artists/${featuredArtist.slug}` :
                active === 'enterprise' && featuredPost ? `/media/${featuredPost.slug}` : '#'
              }
              className="relative overflow-hidden bg-white/5 group/img block w-full max-w-2xl h-[420px] sm:h-[520px]"
            >
              {active === 'collector' && featuredArtwork?.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredArtwork.imageUrl}
                  alt={featuredArtwork.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-[1.03]"
                />
              )}
              {active === 'artist' && featuredArtist?.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredArtist.imageUrl}
                  alt={`${featuredArtist.name} ${featuredArtist.surname}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-[1.03]"
                />
              )}
              {active === 'enterprise' && featuredPost?.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featuredPost.imageUrl}
                  alt={featuredPost.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-[1.03]"
                />
              )}
              {/* Badge "de la semaine" en haut à gauche */}
              <span className="absolute top-4 left-4 bg-black/70 text-gold-accent text-[9px] uppercase tracking-[0.3em] px-3 py-1.5 montserrat backdrop-blur-sm">
                {active === 'collector' && 'Œuvre de la semaine'}
                {active === 'artist' && 'Artiste de la semaine'}
                {active === 'enterprise' && 'Article de la semaine'}
              </span>
              {/* Gradient bas pour lisibilité */}
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
            </a>

            {/* Texte discret sous l'image */}
            <div className="flex flex-col gap-2 mt-4 max-w-2xl">
              <p className="text-white/30 text-xs leading-relaxed">
                {active === 'collector' && 'Découvrez les œuvres exclusives avant tout le monde.'}
                {active === 'artist' && 'Découvrez les artistes émergents avant tout le monde.'}
                {active === 'enterprise' && "Les analyses de marché qui guident les décisions d'acquisition."}
              </p>
            </div>
          </div>
        )}

        {/* Dynamic Claim */}
        <div className="mb-6 md:mb-8 max-w-2xl">
          <h1
            ref={headlineRef}
            className="unbounded text-white font-black uppercase leading-[0.9] tracking-tight text-xl sm:text-2xl md:text-3xl"
            suppressHydrationWarning
          >
            <span className="block text-white">{t(current.headlineKey)}</span>
            <span className="block text-gold-accent">
              {active === 'collector'
                ? t('exhibitions.hero.claimAccent')
                : active === 'artist'
                ? t('exhibitions.hero.claimAccentArtist')
                : t('exhibitions.hero.claimAccentEnterprise')}
            </span>
          </h1>

          <p
            ref={subheadlineRef}
            className="mt-4 text-white/50 text-xs sm:text-sm max-w-xl leading-relaxed"
            suppressHydrationWarning
          >
            {t(current.subheadlineKey)}
          </p>
        </div>

        {/* CTA Row */}
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
