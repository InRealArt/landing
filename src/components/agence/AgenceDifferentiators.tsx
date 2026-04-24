'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Props {
  t: (key: string) => string
}

const DIFF_KEYS = ['curation', 'rights', 'support', 'premium'] as const

export default function AgenceDifferentiators({ t }: Props) {
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
          { opacity: 0, x: -24 },
          {
            opacity: 1, x: 0, duration: 0.7, ease: 'power3.out',
            stagger: 0.1,
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
    <section ref={sectionRef} className="bg-backgroundGrey border-y border-borderColor py-24 lg:py-32">
      <div className="max-w-screen-2xl mx-auto px-10">

        {/* Section header */}
        <div ref={headerRef} className="grid lg:grid-cols-12 gap-8 mb-20" style={{ opacity: 0 }}>
          <div className="lg:col-span-5">
            <span className="section-number">
              {t('agence.differentiators.eyebrow')}
            </span>
            <h2 className="serif text-5xl md:text-6xl xl:text-7xl font-light leading-none text-textColor">
              {t('agence.differentiators.title')}
            </h2>
          </div>
          <div className="lg:col-span-7 lg:flex lg:items-end">
            <p className="text-[12px] uppercase tracking-[0.25em] text-grayText montserrat leading-relaxed max-w-lg">
              {t('agence.differentiators.subtitle')}
            </p>
          </div>
        </div>

        {/* 4 differentiator cards */}
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-borderColor">
          {DIFF_KEYS.map((key, i) => (
            <div
              key={key}
              className="bg-backgroundColor p-8 lg:p-10 group hover:bg-backgroundGrey transition-colors duration-300"
              style={{ opacity: 0 }}
            >
              {/* Index number */}
              <p
                className="text-gold-accent/40 text-5xl font-light leading-none mb-8 group-hover:text-gold-accent/70 transition-colors duration-300"
                style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic' }}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, '0')}
              </p>

              <div className="w-6 h-px bg-gold-accent mb-6" />

              <h3 className="text-[10px] uppercase tracking-[0.4em] text-textColor montserrat font-bold mb-4">
                {t(`agence.differentiators.items.${key}.title`)}
              </h3>

              <p className="text-[13px] text-grayText leading-loose montserrat">
                {t(`agence.differentiators.items.${key}.description`)}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
