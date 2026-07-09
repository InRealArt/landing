'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Props {
  t: (key: string) => string
}

const STREAMS = ['stream1', 'stream2', 'stream3', 'stream4'] as const

export default function AgenceStreams({ t }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 88%', once: true },
        }
      )

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll<HTMLElement>(':scope > div')
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: { trigger: gridRef.current, start: 'top 88%', once: true },
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
    <section ref={sectionRef} className="bg-backgroundColor py-24 lg:py-32">
      <div className="max-w-screen-2xl mx-auto px-10">

        {/* Section header */}
        <div ref={headerRef} className="border-b border-borderColor pb-14 mb-20" style={{ opacity: 0 }}>
          <span className="section-number">
            {t('agence.streams.eyebrow')}
          </span>
          <h2 className="serif text-5xl md:text-6xl xl:text-7xl font-light leading-none text-textColor">
            {t('agence.streams.title')}
          </h2>
        </div>

        {/* Stream cards */}
        <div ref={gridRef} className="grid md:grid-cols-2 gap-px bg-borderColor">
          {STREAMS.map((key) => {
            const badge = t(`agence.streams.${key}.badge`)
            const isComingSoon = badge.length > 0

            return (
              <div
                key={key}
                className={[
                  'relative p-10 lg:p-14 bg-backgroundColor border-t border-borderColor',
                  'group transition-colors duration-300',
                  isComingSoon ? 'opacity-60 hover:opacity-80' : 'hover:bg-backgroundGrey',
                ].join(' ')}
                style={{ opacity: 0 }}
              >
                {/* Coming soon badge */}
                {isComingSoon && (
                  <span className="absolute top-8 right-8 text-xs uppercase tracking-[0.4em] border border-gold-accent/50 text-gold-accent/70 px-3 py-1 montserrat">
                    {badge}
                  </span>
                )}

                {/* Stream number */}
                <p
                  className="text-textColor/10 leading-none mb-6 select-none"
                  style={{
                    fontFamily: 'var(--font-unbounded)',
                    fontSize: 'clamp(3rem, 5vw, 5rem)',
                  }}
                  aria-hidden="true"
                >
                  {t(`agence.streams.${key}.number`)}
                </p>

                {/* Label */}
                <p className="text-xs uppercase tracking-[0.45em] text-gold-accent montserrat mb-4">
                  {t(`agence.streams.${key}.label`)}
                </p>

                {/* Title */}
                <h3 className="serif text-3xl md:text-4xl italic font-light text-textColor leading-snug mb-6">
                  {t(`agence.streams.${key}.title`)}
                </h3>

                {/* Separator */}
                <div className="w-8 h-px bg-gold-accent/40 mb-6 group-hover:w-16 group-hover:bg-gold-accent transition-all duration-500" />

                {/* Description */}
                <p className="text-sm text-grayText leading-loose montserrat">
                  {t(`agence.streams.${key}.description`)}
                </p>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
