'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Props {
  t: (key: string) => string
}

const CAMPAIGN_PACKAGES = [
  { key: 'nano_essential', recommended: false },
  { key: 'nano_premium', recommended: false },
  { key: 'micro_standard', recommended: true },
  { key: 'micro_premium', recommended: false },
  { key: 'full_mix', recommended: false },
] as const

const SUBSCRIPTION_TIERS = [
  { key: 'starter', highlighted: false },
  { key: 'business', highlighted: true },
  { key: 'enterprise', highlighted: false },
] as const

export default function AgencePricing({ t }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const packagesRef = useRef<HTMLDivElement>(null)
  const tiersRef = useRef<HTMLDivElement>(null)

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

      if (packagesRef.current) {
        const rows = packagesRef.current.querySelectorAll<HTMLElement>('[data-row]')
        gsap.fromTo(
          rows,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: { trigger: packagesRef.current, start: 'top 88%', once: true },
          }
        )
      }

      if (tiersRef.current) {
        const cards = tiersRef.current.querySelectorAll<HTMLElement>(':scope > div')
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: { trigger: tiersRef.current, start: 'top 88%', once: true },
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
        <div ref={headerRef} className="border-b border-borderColor pb-14 mb-20" style={{ opacity: 0 }}>
          <span className="section-number">
            {t('agence.pricing.eyebrow')}
          </span>
          <h2 className="serif text-5xl md:text-6xl xl:text-7xl font-light leading-none text-textColor">
            {t('agence.pricing.title')}{' '}
            <em className="italic text-gold-accent not-italic" style={{ fontStyle: 'italic' }}>
              {t('agence.pricing.titleAccent')}
            </em>
          </h2>
        </div>

        {/* ── Stream 1 — Campaign Packages ── */}
        <div className="mb-24">
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="text-[10px] uppercase tracking-[0.45em] text-textColor montserrat font-bold">
              {t('agence.pricing.stream1.title')}
            </h3>
            <span className="text-[10px] text-grayText montserrat tracking-widest">
              {t('agence.pricing.stream1.subtitle')}
            </span>
          </div>

          <div className="w-full h-px bg-borderColor mb-8" />

          {/* Column headers */}
          <div className="hidden md:grid grid-cols-9 gap-4 mb-4 px-4">
            <div className="col-span-3">
              <span className="text-[9px] uppercase tracking-[0.4em] text-grayText montserrat">Pack</span>
            </div>
            <div className="col-span-3 text-center">
              <span className="text-[9px] uppercase tracking-[0.4em] text-grayText montserrat">
                {t('agence.pricing.stream1.creators_label')}
              </span>
            </div>
            <div className="col-span-3 text-center">
              <span className="text-[9px] uppercase tracking-[0.4em] text-grayText montserrat">
                {t('agence.pricing.stream1.reach_label')}
              </span>
            </div>
          </div>

          <div ref={packagesRef} className="space-y-px">
            {CAMPAIGN_PACKAGES.map(({ key, recommended }) => (
              <div
                key={key}
                data-row
                className={[
                  'grid grid-cols-1 md:grid-cols-9 gap-4 items-center px-4 py-5 transition-colors duration-200',
                  recommended
                    ? 'bg-gold-accent/10 border border-gold-accent/30'
                    : 'bg-backgroundColor hover:bg-backgroundColor border border-borderColor hover:border-gold-accent/20',
                ].join(' ')}
                style={{ opacity: 0 }}
              >
                {/* Name + recommended badge */}
                <div className="md:col-span-3 flex items-center gap-3">
                  <h4 className="text-[12px] text-textColor montserrat font-medium">
                    {t(`agence.pricing.stream1.packages.${key}.name`)}
                  </h4>
                  {recommended && (
                    <span className="text-[8px] uppercase tracking-[0.3em] text-gold-accent border border-gold-accent/50 px-2 py-0.5 whitespace-nowrap">
                      {t('agence.pricing.stream1.recommended')}
                    </span>
                  )}
                </div>

                {/* Creators */}
                <div className="md:col-span-3 md:text-center">
                  <span className="text-[11px] text-grayText montserrat">
                    {t(`agence.pricing.stream1.packages.${key}.creators`)}
                  </span>
                </div>

                {/* Reach */}
                <div className="md:col-span-3 md:text-center">
                  <span
                    className="text-[13px] text-textColor"
                    style={{ fontFamily: 'var(--font-unbounded)' }}
                  >
                    {t(`agence.pricing.stream1.packages.${key}.reach`)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Stream 2 — Subscription Tiers ── */}
        <div>
          <div className="flex items-baseline justify-between mb-2">
            <h3 className="text-[10px] uppercase tracking-[0.45em] text-textColor montserrat font-bold">
              {t('agence.pricing.stream2.title')}
            </h3>
            <span className="text-[10px] text-grayText montserrat tracking-widest">
              {t('agence.pricing.stream2.subtitle')}
            </span>
          </div>

          <div className="w-full h-px bg-borderColor mb-8" />

          <div ref={tiersRef} className="grid md:grid-cols-3 gap-px bg-borderColor">
            {SUBSCRIPTION_TIERS.map(({ key, highlighted }) => (
              <div
                key={key}
                className={[
                  'p-8 lg:p-10 flex flex-col',
                  highlighted
                    ? 'bg-textColor text-backgroundColor'
                    : 'bg-backgroundColor hover:bg-backgroundGrey transition-colors duration-200',
                ].join(' ')}
                style={{ opacity: 0 }}
              >
                {/* Tier name */}
                <p
                  className={[
                    'text-[9px] uppercase tracking-[0.5em] mb-6 montserrat',
                    highlighted ? 'text-backgroundColor/50' : 'text-grayText',
                  ].join(' ')}
                >
                  {t(`agence.pricing.stream2.tiers.${key}.name`)}
                </p>

                <div className={['w-8 h-px mb-8', highlighted ? 'bg-gold-accent' : 'bg-gold-accent/40'].join(' ')} />

                {/* Features */}
                <ul className="space-y-4 flex-1">
                  {(['profiles', 'activations', 'support'] as const).map((feat) => (
                    <li key={feat} className="flex items-start gap-3">
                      <span
                        className={[
                          'mt-1 shrink-0',
                          highlighted ? 'text-gold-accent' : 'text-gold-accent/70',
                        ].join(' ')}
                        aria-hidden="true"
                      >
                        —
                      </span>
                      <span
                        className={[
                          'text-[12px] montserrat leading-relaxed',
                          highlighted ? 'text-backgroundColor' : 'text-grayText',
                        ].join(' ')}
                      >
                        {t(`agence.pricing.stream2.tiers.${key}.${feat}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
