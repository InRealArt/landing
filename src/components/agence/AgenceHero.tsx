'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import type { AgencyEventData } from '@/actions/agencyEventActions'
import AgenceHeroEvents from './AgenceHeroEvents'

gsap.registerPlugin(ScrollTrigger, SplitText)

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
  const sectionRef = useRef<HTMLElement>(null)
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
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {}, sectionRef)
    let cancelled = false

    const revealed = [eyebrowRef, titleLineRef, titleAccentRef, subtitleRowRef, ctaRef, statsRef, eventsRef]
      .map((ref) => ref.current)
      .filter(Boolean)

    // Sans animation, les éléments masqués par défaut doivent tout de même apparaître
    if (prefersReduced) {
      ctx.add(() => gsap.set(revealed, { opacity: 1 }))
      return () => ctx.revert()
    }

    // Le découpage du titre attend les polices pour mesurer les bons mots
    document.fonts.ready.then(() => {
      if (cancelled) return
      ctx.add(() => {
        const words = [titleLineRef.current, titleAccentRef.current].flatMap((el) =>
          el ? SplitText.create(el, { type: 'words', wordsClass: 'inline-block will-change-transform' }).words : [],
        )
        const counters = gsap.utils.toArray<HTMLElement>('[data-count]')
        const plate = eventsRef.current
        const q = plate ? gsap.utils.selector(plate) : null

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        tl.fromTo(eyebrowRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 })
          .set([titleLineRef.current, titleAccentRef.current], { opacity: 1 }, 0.1)
          .fromTo(
            words,
            { yPercent: 70, opacity: 0, rotate: 3, filter: 'blur(14px)' },
            { yPercent: 0, opacity: 1, rotate: 0, filter: 'blur(0px)', duration: 1.1, stagger: 0.07, ease: 'expo.out' },
            0.15,
          )
          .fromTo(goldBarRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'expo.inOut' }, 0.75)
          .fromTo(subtitleRowRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 0.8)
          .fromTo(ctaRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, 0.95)
          .fromTo(statsRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 }, 1.1)

        counters.forEach((el) => {
          const counter = { value: 0 }
          const end = Number(el.dataset.count)
          el.textContent = '0'
          tl.to(
            counter,
            {
              value: end,
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: () => void (el.textContent = String(Math.round(counter.value))),
            },
            1.15,
          )
        })

        if (plate && q) {
          // Vernissage : le filet se trace, le rideau or monte puis se retire,
          // l'œuvre se dézoome et un reflet traverse la vitre
          tl.set(plate, { opacity: 1 }, 0.4)
            .fromTo(q('[data-plate-aura]'), { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 2.2, ease: 'power2.out' }, 0.5)
            .fromTo(
              q('[data-plate-frame] rect'),
              { strokeDasharray: 1, strokeDashoffset: 1 },
              { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' },
              0.4,
            )
            .set(q('[data-plate-media]'), { opacity: 0 }, 0)
            .fromTo(
              q('[data-plate-curtain]'),
              { scaleY: 0, transformOrigin: '50% 100%' },
              { scaleY: 1, duration: 0.7, ease: 'power4.inOut' },
              0.7,
            )
            .set(q('[data-plate-media]'), { opacity: 1 })
            .set(q('[data-plate-curtain]'), { transformOrigin: '50% 0%' })
            .to(q('[data-plate-curtain]'), { scaleY: 0, duration: 0.9, ease: 'power4.inOut' })
            .fromTo(q('[data-plate-media]'), { scale: 1.35 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, '<0.1')
            .fromTo(
              q('[data-hero-cartel] > *'),
              { opacity: 0, y: 14 },
              { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
              '<0.3',
            )
            .fromTo(
              q('[data-plate-glint]'),
              { xPercent: 0, opacity: 1 },
              { xPercent: 400, duration: 1.2, ease: 'power2.inOut' },
              '-=0.5',
            )
            .set(q('[data-plate-glint]'), { opacity: 0 })
        }

        // CTA magnétique (souris uniquement)
        const link = ctaLinkRef.current
        if (link && window.matchMedia('(pointer: fine)').matches) {
          const moveX = gsap.quickTo(link, 'x', { duration: 0.5, ease: 'power3' })
          const moveY = gsap.quickTo(link, 'y', { duration: 0.5, ease: 'power3' })
          const onMove = (e: PointerEvent) => {
            const rect = link.getBoundingClientRect()
            moveX((e.clientX - rect.left - rect.width / 2) * 0.25)
            moveY((e.clientY - rect.top - rect.height / 2) * 0.35)
          }
          const onLeave = () => {
            moveX(0)
            moveY(0)
          }
          link.addEventListener('pointermove', onMove)
          link.addEventListener('pointerleave', onLeave)
          return () => {
            link.removeEventListener('pointermove', onMove)
            link.removeEventListener('pointerleave', onLeave)
          }
        }
      })

      // Parallaxe au scroll : l'œuvre et le titre se séparent légèrement (desktop)
      ctx.add(() => {
        const mm = gsap.matchMedia()
        mm.add('(min-width: 1024px)', () => {
          const scrollTrigger = { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: true }
          if (eventsRef.current) gsap.to(eventsRef.current, { yPercent: -12, ease: 'none', scrollTrigger })
          gsap.to(titleRef.current, { yPercent: 18, ease: 'none', scrollTrigger })
        })
      })
    })

    return () => {
      cancelled = true
      ctx.revert()
    }
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

      {/* Gold vertical bar — far left decorative */}
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-accent/40 to-transparent" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-5 sm:px-8 lg:px-10 pt-headerSize pb-16 sm:pb-20 lg:pb-24 w-full">
        <div className={`grid lg:grid-cols-12 items-end ${hasEvents ? 'gap-14 lg:gap-12 xl:gap-16' : 'gap-10 lg:gap-8'}`}>
          <div className={hasEvents ? 'lg:col-span-7' : 'lg:col-span-8'}>
            <span
              ref={eyebrowRef}
              className="section-number mb-8"
              style={{ opacity: 0 }}
            >
              {t('agence.hero.eyebrow')}
            </span>

            <h1
              ref={titleRef}
              className="serif font-light leading-[1.05] mb-6 sm:mb-8 break-words"
              style={{ fontSize: hasEvents ? 'clamp(2.5rem, 6.5vw, 6.75rem)' : 'clamp(2.5rem, 9vw, 8rem)' }}
            >
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
              className="flex items-center gap-4 mb-8 sm:mb-10"
              style={{ opacity: 0 }}
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

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4" style={{ opacity: 0 }}>
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
                style={{ opacity: 0 }}
              >
                {STATS.map((stat) => (
                  <StatFigure key={stat.labelKey} value={stat.value} label={t(stat.labelKey)} compact />
                ))}
              </div>
            )}
          </div>

          {hasEvents ? (
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div ref={eventsRef} className="w-full max-w-md sm:max-w-lg lg:max-w-[400px] xl:max-w-[440px]" style={{ opacity: 0 }}>
                <AgenceHeroEvents t={t} events={events} />
              </div>
            </div>
          ) : (
            /* Right column — vertical stat strip */
            <div
              ref={statsRef}
              className="lg:col-span-4 flex flex-row lg:flex-col justify-start gap-10 sm:gap-12 lg:gap-0 pt-8 lg:pt-0 border-t lg:border-t-0 lg:border-l border-borderColor lg:pl-10"
              style={{ opacity: 0 }}
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
