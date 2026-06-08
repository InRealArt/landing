'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface Props {
  t: (key: string) => string
}

export default function AgenceHero({ t }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLSpanElement>(null)
  const titleLineRef = useRef<HTMLSpanElement>(null)
  const titleAccentRef = useRef<HTMLElement>(null)
  const subtitleRowRef = useRef<HTMLDivElement>(null)
  const goldBarRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      tl.fromTo(eyebrowRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(titleLineRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.3')
        .fromTo(titleAccentRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.55')
        .fromTo(goldBarRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.6 }, '-=0.3')
        .fromTo(subtitleRowRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
        .fromTo(ctaRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.25')
        .fromTo(statsRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.7 }, '-=0.5')
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[85vh] bg-backgroundColor flex items-end overflow-hidden"
    >
      {/* Background noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Gold vertical bar — far left decorative */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-accent/40 to-transparent" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-10 pt-headerSize pb-24 w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <span
              ref={eyebrowRef}
              className="section-number mb-8"
              style={{ opacity: 0 }}
            >
              {t('agence.hero.eyebrow')}
            </span>

            <h1 className="serif font-light leading-none mb-8" style={{ fontSize: 'clamp(3.5rem, 8vw, 8rem)' }}>
              <span ref={titleLineRef} style={{ opacity: 0, display: 'block' }}>
                {t('agence.hero.title')}
              </span>
              <em
                ref={titleAccentRef}
                className="text-gold-accent not-italic italic"
                style={{ opacity: 0, display: 'block' }}
              >
                {t('agence.hero.titleAccent')}
              </em>
            </h1>

            <div
              ref={subtitleRowRef}
              className="flex items-center gap-4 mb-10"
              style={{ opacity: 0 }}
            >
              <div
                ref={goldBarRef}
                className="w-12 h-px bg-gold-accent shrink-0"
                style={{ transformOrigin: 'left center' }}
              />
              <p className="text-[12px] uppercase tracking-[0.3em] text-grayText montserrat max-w-xl leading-relaxed">
                {t('agence.hero.subtitle')}
              </p>
            </div>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4" style={{ opacity: 0 }}>
              <Link
                href="/agence/brief"
                className="inline-flex items-center gap-3 bg-gold-accent text-white px-8 py-4 text-[10px] uppercase tracking-[0.4em] montserrat hover:bg-gold-accent/80 transition-all duration-300"
              >
                {t('agence.hero.cta')}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Right column — vertical stat strip */}
          <div
            ref={statsRef}
            className="lg:col-span-4 flex lg:flex-col justify-end lg:justify-start gap-8 lg:gap-0 lg:border-l border-borderColor lg:pl-10"
            style={{ opacity: 0 }}
          >
            {[
              { value: '20', labelKey: 'agence.hero.stat1' },
              { value: '5', labelKey: 'agence.hero.stat2' },
            ].map((stat, i) => (
              <div key={i} className="lg:py-8 lg:border-b border-borderColor last:border-0">
                <p
                  className="text-4xl lg:text-5xl text-textColor leading-none mb-2"
                  style={{ fontFamily: 'var(--font-unbounded)' }}
                >
                  {stat.value}
                </p>
                <p className="text-[10px] uppercase tracking-[0.35em] text-grayText montserrat">
                  {t(stat.labelKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
