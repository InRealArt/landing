'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Props {
  t: (key: string) => string
}

const ACTIVATION_TYPES = [
  'product_launch',
  'event_activation',
  'brand_collab',
  'ambassador',
  'brand_trip',
  'social_campaign',
  'seeding',
  'retail',
  'art_direction',
  'hospitality',
] as const

const FORMAT_ROWS = [
  { key: 'product_launch' },
  { key: 'event_activation' },
  { key: 'brand_collab' },
  { key: 'ambassador' },
] as const

export default function AgencePricing({ t }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const tagsRef = useRef<HTMLDivElement>(null)
  const formatsRef = useRef<HTMLDivElement>(null)
  const assetsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const ease = 'cubic-bezier(0.19, 1, 0.22, 1)'

      gsap.fromTo(headerRef.current, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.9, ease,
        scrollTrigger: { trigger: headerRef.current, start: 'top 88%', once: true },
      })

      if (tagsRef.current) {
        const tags = tagsRef.current.querySelectorAll<HTMLElement>('[data-tag]')
        gsap.fromTo(tags, { opacity: 0, y: 12 }, {
          opacity: 1, y: 0, duration: 0.5, ease, stagger: 0.06,
          scrollTrigger: { trigger: tagsRef.current, start: 'top 88%', once: true },
        })
      }

      if (formatsRef.current) {
        const rows = formatsRef.current.querySelectorAll<HTMLElement>('[data-row]')
        gsap.fromTo(rows, { opacity: 0, y: 18 }, {
          opacity: 1, y: 0, duration: 0.6, ease, stagger: 0.09,
          scrollTrigger: { trigger: formatsRef.current, start: 'top 88%', once: true },
        })
      }

      gsap.fromTo(assetsRef.current, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.8, ease,
        scrollTrigger: { trigger: assetsRef.current, start: 'top 88%', once: true },
      })
    }, sectionRef)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  return (
    <section ref={sectionRef} className="bg-backgroundGrey border-y border-borderColor py-16 sm:py-24 lg:py-32">
      <div className="max-w-screen-2xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* ── Header ── */}
        <div ref={headerRef} className="border-b border-borderColor pb-8 sm:pb-12 lg:pb-14 mb-12 sm:mb-16 lg:mb-20" style={{ opacity: 0 }}>
          <span className="section-number">{t('agence.pricing.eyebrow')}</span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-8 mt-4">
            <h2 className="serif text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-light leading-tight lg:leading-none text-textColor">
              {t('agence.pricing.title')}{' '}
              <em className="not-italic text-gold-accent" style={{ fontStyle: 'italic' }}>
                {t('agence.pricing.titleAccent')}
              </em>
            </h2>
            <p className="text-sm text-grayText leading-relaxed sm:leading-loose montserrat max-w-sm lg:text-right">
              {t('agence.pricing.tagline')}
            </p>
          </div>
        </div>

        {/* ── Block 1 — Collaborations Marques ── */}
        <div className="mb-16 sm:mb-20 lg:mb-24">
          <SectionLabel title={t('agence.pricing.collabs.title')} subtitle={t('agence.pricing.collabs.subtitle')} />

          <p className="text-sm text-grayText montserrat leading-relaxed sm:leading-loose max-w-3xl mb-8 sm:mb-12">
            {t('agence.pricing.collabs.description')}
          </p>

          {/* Activation type tags */}
          <div ref={tagsRef} className="flex flex-wrap gap-2 sm:gap-3">
            {ACTIVATION_TYPES.map((key) => (
              <span
                key={key}
                data-tag
                className="text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.3em] montserrat border border-borderColor text-grayText px-3 sm:px-4 py-2 hover:border-gold-accent/50 hover:text-textColor transition-colors duration-300 cursor-default"
                style={{ opacity: 0 }}
              >
                {t(`agence.pricing.collabs.types.${key}`)}
              </span>
            ))}
          </div>
        </div>

        {/* ── Block 2 — Campagnes & Activations (formats table) ── */}
        <div className="mb-16 sm:mb-20 lg:mb-24">
          <SectionLabel title={t('agence.pricing.formats.title')} subtitle={t('agence.pricing.formats.subtitle')} />

          {/* Column headers */}
          <div className="hidden md:grid grid-cols-10 gap-4 mb-4 px-4">
            <div className="col-span-3">
              <span className="text-xs uppercase tracking-[0.4em] text-grayText montserrat">{t('agence.pricing.formats.col_format')}</span>
            </div>
            <div className="col-span-4">
              <span className="text-xs uppercase tracking-[0.4em] text-grayText montserrat">{t('agence.pricing.formats.col_ideal')}</span>
            </div>
            <div className="col-span-3">
              <span className="text-xs uppercase tracking-[0.4em] text-grayText montserrat">{t('agence.pricing.formats.col_includes')}</span>
            </div>
          </div>

          <div ref={formatsRef} className="space-y-px">
            {FORMAT_ROWS.map(({ key }) => (
              <div
                key={key}
                data-row
                className="grid grid-cols-1 md:grid-cols-10 gap-2 md:gap-4 items-start px-4 sm:px-5 py-5 bg-backgroundColor border border-borderColor hover:border-gold-accent/20 transition-colors duration-200"
                style={{ opacity: 0 }}
              >
                <div className="md:col-span-3 flex items-center gap-3">
                  <span className="w-1 h-1 rounded-full bg-gold-accent shrink-0" aria-hidden="true" />
                  <h4 className="text-sm text-textColor montserrat font-medium">
                    {t(`agence.pricing.formats.rows.${key}.name`)}
                  </h4>
                </div>
                <div className="md:col-span-4">
                  <span className="text-sm text-grayText montserrat">
                    {t(`agence.pricing.formats.rows.${key}.ideal`)}
                  </span>
                </div>
                <div className="md:col-span-3">
                  <span className="text-sm text-grayText montserrat">
                    {t(`agence.pricing.formats.rows.${key}.includes`)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.3em] text-grayText/50 montserrat">
            {t('agence.pricing.formats.note')}
          </p>
        </div>

        {/* ── Block 4 — Production & Assets ── */}
        <div ref={assetsRef} style={{ opacity: 0 }}>
          <SectionLabel title={t('agence.pricing.assets.title')} subtitle={t('agence.pricing.assets.subtitle')} />

          <div className="bg-backgroundColor border border-borderColor p-6 sm:p-10 lg:p-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-10">
            <div className="max-w-2xl">
              <p className="text-sm text-grayText montserrat leading-relaxed sm:leading-loose mb-6">
                {t('agence.pricing.assets.description')}
              </p>
              <p className="text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.3em] text-gold-accent montserrat">
                {t('agence.pricing.assets.rights')}
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-3 border border-gold-accent text-textColor px-6 sm:px-8 py-4 text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.4em] montserrat hover:bg-gold-accent hover:text-white transition-all duration-300 sm:whitespace-nowrap shrink-0 text-center"
            >
              {t('agence.pricing.assets.cta')}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2.5 7h9M7 2.5l4.5 4.5-4.5 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}

function SectionLabel({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 mb-2">
      <h3 className="text-[11px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.45em] text-textColor montserrat font-bold">{title}</h3>
      <span className="text-[11px] sm:text-xs text-grayText montserrat tracking-wide sm:tracking-widest">{subtitle}</span>
    </div>
  )
}

// Divider is rendered via CSS border-b on the wrapper — no component needed
