'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Props {
  t: (key: string) => string
}

const CASES = ['case1', 'case2', 'case3'] as const

export default function AgenceCaseStudies({ t }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: headerRef.current, start: 'top 88%', once: true },
      })

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll<HTMLElement>('[data-case-card]')
        gsap.fromTo(cards, { opacity: 0, y: 36 }, {
          opacity: 1, y: 0, duration: 0.75, ease: 'power3.out', stagger: 0.13,
          scrollTrigger: { trigger: cardsRef.current, start: 'top 88%', once: true },
        })
      }
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="bg-backgroundColor border-y border-borderColor py-24 lg:py-32">
      <div className="max-w-screen-2xl mx-auto px-10">

        <div ref={headerRef} className="mb-20" style={{ opacity: 0 }}>
          <span className="section-number">{t('agence.caseStudies.eyebrow')}</span>
          <h2 className="serif text-5xl md:text-6xl xl:text-7xl font-light leading-none text-textColor mt-4">
            {t('agence.caseStudies.title')}{' '}
            <em className="not-italic italic text-gold-accent">
              {t('agence.caseStudies.titleAccent')}
            </em>
          </h2>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-px bg-borderColor">
          {CASES.map((caseKey) => (
            <div
              key={caseKey}
              data-case-card
              className="bg-backgroundColor p-10 flex flex-col gap-8"
              style={{ opacity: 0 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-gold-accent montserrat mb-1">
                    {t(`agence.caseStudies.${caseKey}.tag`)}
                  </p>
                  <h3 className="text-sm text-textColor montserrat font-medium">
                    {t(`agence.caseStudies.${caseKey}.brand`)}
                  </h3>
                  <p className="text-sm text-grayText montserrat mt-1">
                    {t(`agence.caseStudies.${caseKey}.campaign`)}
                  </p>
                </div>
              </div>

              <div className="w-full h-px bg-borderColor" />

              <div className="grid grid-cols-3 gap-4">
                {(['metric1', 'metric2', 'metric3'] as const).map((m) => (
                  <div key={m}>
                    <p
                      className="text-2xl text-textColor leading-none mb-1"
                      style={{ fontFamily: 'var(--font-unbounded)' }}
                    >
                      {t(`agence.caseStudies.${caseKey}.${m}.value`)}
                    </p>
                    <p className="text-xs uppercase tracking-[0.3em] text-grayText montserrat leading-snug">
                      {t(`agence.caseStudies.${caseKey}.${m}.label`)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
