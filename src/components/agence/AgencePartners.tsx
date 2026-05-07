'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Props {
  t: (key: string) => string
}

export default function AgencePartners({ t }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
          scrollTrigger: { trigger: headerRef.current, start: 'top 88%', once: true },
        }
      )

      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
          scrollTrigger: { trigger: cardRef.current, start: 'top 88%', once: true },
        }
      )

      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll<HTMLElement>('[data-stat]')
        gsap.fromTo(
          items,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
            stagger: 0.1,
            scrollTrigger: { trigger: statsRef.current, start: 'top 88%', once: true },
          }
        )
      }
    }, sectionRef)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-backgroundColor py-24 lg:py-32 overflow-hidden"
    >
      <div className="max-w-screen-2xl mx-auto px-10">

        {/* Section header */}
        <div ref={headerRef} className="mb-20" style={{ opacity: 0 }}>
          <span className="section-number">{t('agence.partners.eyebrow')}</span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mt-4 pb-14 border-b border-borderColor">
            <h2 className="serif text-4xl md:text-5xl font-light leading-tight text-textColor max-w-xl">
              {t('agence.partners.title')}{' '}
              <em className="not-italic text-gold-accent">{t('agence.partners.titleAccent')}</em>
            </h2>
            <p className="text-[13px] text-grayText leading-loose montserrat max-w-sm">
              {t('agence.partners.subtitle')}
            </p>
          </div>
        </div>

        {/* Case study card */}
        <div
          ref={cardRef}
          className="grid lg:grid-cols-12 gap-0 border border-borderColor"
          style={{ opacity: 0 }}
        >
          {/* Left — brand logo panel */}
          <div className="lg:col-span-4 bg-backgroundGrey border-b lg:border-b-0 lg:border-r border-borderColor flex flex-col justify-between p-12 lg:p-16 relative overflow-hidden min-h-[280px]">
            {/* Top — case label */}
            <p className="relative text-[9px] uppercase tracking-[0.4em] text-grayText montserrat">
              {t('agence.partners.caseLabel')}
            </p>

            {/* Center — Logitech logo, prominent */}
            <div className="relative flex items-center justify-center py-8">
              <div className="relative w-full max-w-[180px] h-16">
                <Image
                  src="/images/agency/logitech.webp"
                  alt={t('agence.partners.partnerLogoAlt')}
                  fill
                  className="object-contain"
                  sizes="180px"
                />
              </div>
            </div>

            {/* Bottom — artist callout */}
            <div className="relative">
              <div className="w-8 h-px bg-gold-accent mb-4" />
              <p className="text-[9px] uppercase tracking-[0.4em] text-grayText montserrat mb-1">
                {t('agence.partners.caseTag')}
              </p>
              <p
                className="text-gold-accent leading-none"
                style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 'clamp(22px, 2.5vw, 32px)' }}
              >
                {t('agence.partners.caseArtist')}
              </p>
            </div>
          </div>

          {/* Right — case study content */}
          <div className="lg:col-span-8 flex flex-col">

            {/* Top — title + description */}
            <div className="flex-1 p-10 lg:p-14 border-b border-borderColor">
              <h3 className="serif text-3xl md:text-4xl font-light text-textColor mb-6 leading-tight">
                {t('agence.partners.caseTitle')}
              </h3>
              <p className="text-[14px] text-grayText leading-loose montserrat mb-10 max-w-2xl">
                {t('agence.partners.caseDescription')}
              </p>

              {/* Pull quote */}
              <blockquote className="border-l-2 border-gold-accent pl-6">
                <p
                  className="text-textColor leading-relaxed"
                  style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 'clamp(16px, 1.5vw, 20px)' }}
                >
                  {t('agence.partners.quote')}
                </p>
                <footer className="mt-2 text-[10px] uppercase tracking-[0.35em] text-gold-accent montserrat">
                  {t('agence.partners.quoteAuthor')}
                </footer>
              </blockquote>
            </div>

            {/* Bottom — stats + CTA */}
            <div className="flex flex-col sm:flex-row items-stretch">
              {/* Stats row */}
              <div
                ref={statsRef}
                className="flex-1 grid grid-cols-3 divide-x divide-borderColor"
              >
                {(
                  [
                    { value: 'statReachValue', label: 'statReach' },
                    { value: 'statEngagementValue', label: 'statEngagement' },
                    { value: 'statAssetsValue', label: 'statAssets' },
                  ] as const
                ).map(({ value, label }) => (
                  <div
                    key={label}
                    data-stat
                    className="flex flex-col justify-center items-center text-center p-6 hover:bg-backgroundGrey transition-colors duration-200"
                    style={{ opacity: 0 }}
                  >
                    <span
                      className="text-gold-accent leading-none mb-1"
                      style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 'clamp(24px, 2.5vw, 32px)' }}
                    >
                      {t(`agence.partners.${value}`)}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.3em] text-grayText montserrat leading-snug">
                      {t(`agence.partners.${label}`)}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="border-t sm:border-t-0 sm:border-l border-borderColor flex items-center justify-center p-6">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-3 border border-gold-accent text-textColor px-8 py-4 text-[10px] uppercase tracking-[0.4em] montserrat hover:bg-gold-accent hover:text-white transition-all duration-300 whitespace-nowrap"
                >
                  {t('agence.partners.ctaLabel')}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M2.5 7h9M7 2.5l4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
