'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from '@/hooks/useTranslation'

export default function UseCaseFiscalStats() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

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
      if (statsRef.current) {
        const items = statsRef.current.querySelectorAll<HTMLElement>('[data-stat]')
        gsap.fromTo(items, { opacity: 0, y: 32 }, {
          opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: statsRef.current, start: 'top 88%', once: true },
        })
      }
    }, sectionRef)

    return () => { ctx.revert() }
  }, [])

  const stats = [
    { valueKey: 'usecase.fiscal.stat1.value', labelKey: 'usecase.fiscal.stat1.label' },
    { valueKey: 'usecase.fiscal.stat2.value', labelKey: 'usecase.fiscal.stat2.label' },
    { valueKey: 'usecase.fiscal.stat3.value', labelKey: 'usecase.fiscal.stat3.label' },
  ]

  return (
    <section
      ref={sectionRef}
      className="section-dark-premium py-24 lg:py-32 px-4 sm:px-6 lg:px-10"
    >
      <div className="max-w-screen-2xl mx-auto">
        <div ref={headerRef} className="text-center mb-20" style={{ opacity: 0 }}>
          <span className="section-number" style={{ color: 'var(--gold-accent)' }}>
            {t('usecase.fiscal.eyebrow')}
          </span>
          <h2 className="serif text-4xl md:text-5xl lg:text-6xl font-light leading-none mt-4 text-white">
            {t('usecase.fiscal.title')}
          </h2>
          <p className="text-[11px] uppercase tracking-[0.3em] section-dark-muted mt-6 max-w-xl mx-auto leading-relaxed montserrat">
            {t('usecase.fiscal.subtitle')}
          </p>
        </div>

        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
          {stats.map(({ valueKey, labelKey }, i) => (
            <div
              key={i}
              data-stat
              className="bg-black/20 px-10 py-14 text-center"
              style={{ opacity: 0 }}
            >
              <p
                className="serif text-[clamp(3rem,7vw,4.5rem)] leading-none mb-4"
                style={{ color: 'var(--gold-accent)' }}
              >
                {t(valueKey)}
              </p>
              <p className="text-[10px] uppercase tracking-[0.35em] section-dark-muted montserrat leading-relaxed max-w-[180px] mx-auto">
                {t(labelKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
