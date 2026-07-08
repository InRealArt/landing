'use client'

import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useTranslation } from '@/hooks/useTranslation'
import { EXTERNAL_URLS } from '@/constants/constants'
import type { FeaturedArtist, FeaturedArtwork, FeaturedPost } from '@/types/featured-item'
import HomeHeroFeaturedSlider, { type FeaturedSlideKey } from './HomeHeroFeaturedSlider'

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
}

const PROFILES: ProfileConfig[] = [
  {
    key: 'collector',
    labelKey: 'exhibitions.hero.profileCollector',
    ctaKey: 'exhibitions.hero.ctaCollector',
    href: '/presale',
    headlineKey: 'exhibitions.hero.claimCollector',
    subheadlineKey: 'exhibitions.hero.subheadlineCollector',
  },
  {
    key: 'artist',
    labelKey: 'exhibitions.hero.profileArtist',
    ctaKey: 'exhibitions.hero.ctaArtist',
    href: '/joinInRealArt',
    headlineKey: 'exhibitions.hero.claimArtist',
    subheadlineKey: 'exhibitions.hero.subheadlineArtist',
  },
  // {
  //   key: 'enterprise',
  //   labelKey: 'exhibitions.hero.profileEnterprise',
  //   ctaKey: 'exhibitions.hero.ctaEnterprise',
  //   href: '/usecase',
  //   headlineKey: 'exhibitions.hero.claimEnterprise',
  //   subheadlineKey: 'exhibitions.hero.subheadlineEnterprise',
  // },
  // {
  //   key: 'brand',
  //   labelKey: 'exhibitions.hero.profileBrand',
  //   ctaKey: 'exhibitions.hero.ctaBrand',
  //   href: '/agence',
  //   headlineKey: 'exhibitions.hero.claimBrand',
  //   subheadlineKey: 'exhibitions.hero.subheadlineBrand',
  // },
]

export default function HomeHero({ featuredArtist, featuredArtwork, featuredPost }: HomeHeroProps) {
  const { t } = useTranslation()
  const [active, setActive] = useState<Profile>('collector')
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subheadlineRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  const current = PROFILES.find((p) => p.key === active)!

  const handleSliderSlideChange = (key: FeaturedSlideKey) => {
    setActive(key === 'artwork' ? 'collector' : 'artist')
  }

  // Animate headline + subheading on persona change
  useEffect(() => {
    if (!headlineRef.current || !subheadlineRef.current) return

    const headlineSpans = headlineRef.current.querySelectorAll('span')
    const tl = gsap.timeline()

    // Fade out + slide up — headline, subheading
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

    // Fade in + slide down — headline, subheading
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

  return (
    <section className="w-full bg-black pt-headerSize">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-12 lg:px-24 xl:px-32 pt-8 md:pt-10 lg:pt-12 pb-20 md:pb-28 lg:pb-36">

        {/* Slider "artiste de la semaine" / "œuvre de la semaine" */}
        <HomeHeroFeaturedSlider
          featuredArtwork={featuredArtwork}
          featuredArtist={featuredArtist}
          onActiveSlideChange={handleSliderSlideChange}
        />

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
