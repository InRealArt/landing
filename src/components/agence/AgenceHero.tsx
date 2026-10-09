'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { AgencyEventData } from '@/actions/agencyEventActions'
import AgenceHeroEvents from './AgenceHeroEvents'

gsap.registerPlugin(ScrollTrigger)

interface Props {
  t: (key: string) => string
  events?: AgencyEventData[]
}

const STATS = [
  { value: 20, labelKey: 'agence.hero.stat1' },
  { value: 5, labelKey: 'agence.hero.stat2' },
]

export default function AgenceHero({ t, events = [] }: Props) {
  const hasEvents = events.length > 0
  const lead = events[0]
  const sectionRef = useRef<HTMLElement>(null)
  const spotlightRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const titleLineRef = useRef<HTMLSpanElement>(null)
  const titleAccentRef = useRef<HTMLElement>(null)
  const subtitleRowRef = useRef<HTMLDivElement>(null)
  const goldBarRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const ctaLinkRef = useRef<HTMLAnchorElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const eventsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {}, section)

    ctx.add(() => {
      // CTA magnétique (souris uniquement)
      const link = ctaLinkRef.current
      const finePointer = window.matchMedia('(pointer: fine)').matches
      const onCtaMove = (e: PointerEvent) => {
        if (!link) return
        const rect = link.getBoundingClientRect()
        gsap.to(link, {
          x: (e.clientX - rect.left - rect.width / 2) * 0.25,
          y: (e.clientY - rect.top - rect.height / 2) * 0.35,
          duration: 0.5,
          ease: 'power3',
          overwrite: 'auto',
        })
      }
      const onCtaLeave = () => link && gsap.to(link, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' })

      // Projecteur : une lumière de galerie suit le pointeur sur tout le hero
      const spot = spotlightRef.current
      const onSpotMove = (e: PointerEvent) => {
        if (!spot) return
        const rect = section.getBoundingClientRect()
        gsap.to(spot, {
          '--sx': `${e.clientX - rect.left}px`,
          '--sy': `${e.clientY - rect.top}px`,
          opacity: 1,
          duration: 0.8,
          ease: 'power3',
          overwrite: 'auto',
        })
      }
      const onSpotLeave = () => spot && gsap.to(spot, { opacity: 0, duration: 0.8 })

      if (finePointer) {
        link?.addEventListener('pointermove', onCtaMove)
        link?.addEventListener('pointerleave', onCtaLeave)
        section.addEventListener('pointermove', onSpotMove)
        section.addEventListener('pointerleave', onSpotLeave)
      }

      return () => {
        link?.removeEventListener('pointermove', onCtaMove)
        link?.removeEventListener('pointerleave', onCtaLeave)
        section.removeEventListener('pointermove', onSpotMove)
        section.removeEventListener('pointerleave', onSpotLeave)
      }
    })

    // Parallaxe au scroll : l'œuvre et le titre se séparent légèrement (desktop)
    ctx.add(() => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px)', () => {
        const scrollTrigger = { trigger: section, start: 'top top', end: 'bottom top', scrub: true }
        if (eventsRef.current) gsap.to(eventsRef.current, { yPercent: -12, ease: 'none', scrollTrigger })
        gsap.to(titleRef.current, { yPercent: 18, ease: 'none', scrollTrigger })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[80vh] sm:min-h-[85vh] bg-backgroundColor flex items-end overflow-hidden"
    >
      {/* Background noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Projecteur qui suit le pointeur */}
      <div
        ref={spotlightRef}
        className="pointer-events-none absolute inset-0 opacity-0"
        style={{
          ['--sx' as string]: '50%',
          ['--sy' as string]: '50%',
          background:
            'radial-gradient(650px circle at var(--sx) var(--sy), rgba(184, 156, 114, 0.16), rgba(184, 156, 114, 0) 60%)',
        }}
        aria-hidden="true"
      />

      {/* Gold vertical bar — far left decorative */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-accent/40 to-transparent" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-5 sm:px-8 lg:px-10 pt-headerSize pb-16 sm:pb-20 lg:pb-24 w-full">
        <div className={`grid lg:grid-cols-12 items-end ${hasEvents ? 'gap-14 lg:gap-12 xl:gap-16' : 'gap-10 lg:gap-8'}`}>
          <div className={hasEvents ? 'lg:col-span-7' : 'lg:col-span-8'}>
            <span
              ref={eyebrowRef}
              className="section-number mb-8"
            >
              {t('agence.hero.eyebrow')}
            </span>

            <h1
              ref={titleRef}
              className="serif font-light leading-[1.05] mb-6 sm:mb-8 break-words"
              style={{ fontSize: hasEvents ? 'clamp(2.5rem, 6.5vw, 6.75rem)' : 'clamp(2.5rem, 9vw, 8rem)' }}
            >
              <span ref={titleLineRef} style={{ display: 'block' }}>
                {t('agence.hero.title')}
              </span>
              <em
                ref={titleAccentRef}
                className="text-gold-accent not-italic italic"
                style={{ display: 'block' }}
              >
                {t('agence.hero.titleAccent')}
              </em>
            </h1>

            <div
              ref={subtitleRowRef}
              className="flex items-center gap-4 mb-8 sm:mb-10"
            >
              <div
                ref={goldBarRef}
                className="w-8 sm:w-12 h-px bg-gold-accent shrink-0"
                style={{ transformOrigin: 'left center' }}
              />
              <p className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.3em] text-grayText montserrat max-w-xl leading-relaxed">
                {t('agence.hero.subtitle')}
              </p>
            </div>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
              <Link
                ref={ctaLinkRef}
                href="/agence/brief"
                className="group/cta inline-flex items-center justify-center gap-3 bg-gold-accent text-white px-6 sm:px-8 py-4 text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.4em] montserrat hover:bg-gold-accent/80 transition-all duration-300 text-center"
              >
                {t('agence.hero.cta')}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover/cta:translate-x-1"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {hasEvents && (
              <div
                ref={statsRef}
                className="mt-10 sm:mt-12 pt-7 border-t border-borderColor grid grid-cols-2 gap-8 sm:gap-12 max-w-2xl"
                >
                {STATS.map((stat) => (
                  <StatFigure key={stat.labelKey} value={stat.value} label={t(stat.labelKey)} compact />
                ))}
              </div>
            )}
          </div>

          {hasEvents ? (
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div ref={eventsRef} className="w-full max-w-md sm:max-w-lg lg:max-w-[400px] xl:max-w-[440px]">
                <AgenceHeroEvents t={t} events={events} />
              </div>
            </div>
          ) : (
            /* Right column — vertical stat strip */
            <div
              ref={statsRef}
              className="lg:col-span-4 flex flex-row lg:flex-col justify-start gap-10 sm:gap-12 lg:gap-0 pt-8 lg:pt-0 border-t lg:border-t-0 lg:border-l border-borderColor lg:pl-10"
            >
              {STATS.map((stat) => (
                <div key={stat.labelKey} className="lg:py-8 lg:border-b border-borderColor last:border-0">
                  <StatFigure value={stat.value} label={t(stat.labelKey)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </section>
  )
}

function StatFigure({ value, label, compact = false }: { value: number; label: string; compact?: boolean }) {
  return (
    <div>
      <p
        className="text-3xl sm:text-4xl lg:text-5xl text-textColor leading-none mb-2 tabular-nums"
        style={{ fontFamily: 'var(--font-unbounded)' }}
        data-count={value}
      >
        {value}
      </p>
      <p
        className={`text-[10px] sm:text-xs uppercase text-grayText montserrat ${
          compact ? 'tracking-[0.15em] sm:tracking-[0.2em]' : 'tracking-[0.2em] sm:tracking-[0.35em]'
        }`}
      >
        {label}
      </p>
    </div>
  )
}
