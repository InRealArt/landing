'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from '@/hooks/useTranslation'

const PACKAGES = ['portrait', 'reportage', 'campaign'] as const

export default function MediaProductionPackages() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 88%', once: true },
      })
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll<HTMLElement>('[data-pkg]')
        gsap.fromTo(cards, { opacity: 0, y: 36 }, {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.13,
          scrollTrigger: { trigger: cardsRef.current, start: 'top 88%', once: true },
        })
      }
    }, sectionRef)

    return () => { ctx.revert() }
  }, [])

  return (
    <section ref={sectionRef} className="bg-backgroundGrey border-y border-borderColor py-24 lg:py-32 px-4 sm:px-6 lg:px-10">
      <div className="max-w-screen-2xl mx-auto">

        <div ref={headerRef} className="mb-20" style={{ opacity: 0 }}>
          <span className="section-number">{t('media.production.eyebrow')}</span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mt-4 pb-14 border-b border-borderColor">
            <h2 className="serif text-5xl md:text-6xl xl:text-7xl font-light leading-none text-textColor">
              {t('media.production.title')}{' '}
              <em className="not-italic italic text-gold-accent">{t('media.production.titleAccent')}</em>
            </h2>
            <p className="text-sm uppercase tracking-[0.25em] text-grayText montserrat leading-relaxed max-w-sm">
              {t('media.production.subtitle')}
            </p>
          </div>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-px bg-borderColor mb-16">
          {PACKAGES.map((pkg, i) => (
            <div
              key={pkg}
              data-pkg
              className="bg-backgroundColor p-10 flex flex-col gap-6 group hover:bg-backgroundGrey transition-colors duration-300"
              style={{ opacity: 0 }}
            >
              <div>
                <p
                  className="text-gold-accent/40 text-5xl font-light leading-none mb-4 group-hover:text-gold-accent/70 transition-colors duration-300 serif italic"
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, '0')}
                </p>
                <div className="w-6 h-px bg-gold-accent mb-4" />
                <h3 className="text-sm uppercase tracking-[0.4em] text-textColor montserrat font-bold mb-2">
                  {t(`media.production.packages.${pkg}.name`)}
                </h3>
                <span className="text-xs uppercase tracking-[0.3em] text-gold-accent montserrat border border-gold-accent/40 px-2 py-0.5">
                  {t(`media.production.packages.${pkg}.tag`)}
                </span>
              </div>

              <p className="text-sm text-grayText montserrat leading-loose">
                {t(`media.production.packages.${pkg}.description`)}
              </p>

              <ul className="space-y-2 mt-auto">
                {([0, 1, 2] as const).map((idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-gold-accent shrink-0 mt-1.5" aria-hidden="true" />
                    <span className="text-sm text-grayText montserrat">
                      {t(`media.production.packages.${pkg}.includes.${idx}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link
            href="/media/production"
            className="inline-flex items-center gap-3 bg-gold-accent text-white px-8 py-4 text-xs uppercase tracking-[0.4em] montserrat hover:bg-gold-accent/80 transition-all duration-300"
          >
            {t('media.production.cta')}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2.5 7h9M7 2.5l4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  )
}
