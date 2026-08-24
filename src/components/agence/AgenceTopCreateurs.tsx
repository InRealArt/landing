'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { UgcTopArtistData } from '@/actions/ugcActions'
import { getImageUrl } from '@/lib/cloufare/r2/url'

type Vertical = 'all' | 'luxury' | 'lifestyle' | 'cultural' | 'institutional'

const VERTICAL_FILTERS: Vertical[] = ['all', 'luxury', 'lifestyle', 'cultural', 'institutional']

// Temporary static mapping slug → vertical until DB field is available
const VERTICAL_MAP: Record<string, Vertical> = {}

function getVertical(artist: UgcTopArtistData): Vertical {
  return VERTICAL_MAP[artist.profile.slug] ?? 'lifestyle'
}

interface Props {
  t: (key: string) => string
  artists: UgcTopArtistData[]
}

function displayName(profile: UgcTopArtistData['profile']): string {
  if (profile.pseudo) return profile.pseudo
  const parts = [profile.name, profile.surname].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : '—'
}

export default function AgenceTopCreateurs({ t, artists }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState<Vertical>('all')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
          scrollTrigger: { trigger: headerRef.current, start: 'top 88%', once: true },
        }
      )

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll<HTMLElement>('[data-creator-card]')
        gsap.fromTo(
          cards,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
            stagger: 0.12,
            scrollTrigger: { trigger: cardsRef.current, start: 'top 88%', once: true },
          }
        )
      }
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [])

  const filteredArtists = activeFilter === 'all'
    ? artists
    : artists.filter((a) => getVertical(a) === activeFilter)

  if (artists.length === 0) return null

  return (
    <section ref={sectionRef} className="bg-backgroundGrey border-y border-borderColor py-14 sm:py-16 lg:py-24">
      <div className="max-w-screen-2xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* Section header */}
        <div ref={headerRef} className="mb-10 sm:mb-12" style={{ opacity: 0 }}>
          <span className="section-number">{t('agence.topCreateurs.eyebrow')}</span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-8 mt-4 pb-8 sm:pb-12 lg:pb-14 border-b border-borderColor">
            <h2 className="serif text-3xl sm:text-4xl md:text-5xl font-light leading-tight text-textColor max-w-lg">
              {t('agence.topCreateurs.title')}{' '}
              <em className="not-italic text-gold-accent">{t('agence.topCreateurs.titleAccent')}</em>
            </h2>
            <p className="text-sm text-grayText leading-relaxed sm:leading-loose montserrat max-w-sm">
              {t('agence.topCreateurs.subtitle')}
            </p>
          </div>
        </div>

        {/* Vertical filter */}
        <div className="flex flex-nowrap sm:flex-wrap gap-2 sm:gap-3 mb-10 sm:mb-12 overflow-x-auto no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 sm:overflow-visible">
          {VERTICAL_FILTERS.map((v) => (
            <button
              key={v}
              onClick={() => setActiveFilter(v)}
              className={[
                'text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.35em] montserrat px-4 sm:px-5 py-2.5 border transition-colors duration-200 whitespace-nowrap shrink-0',
                activeFilter === v
                  ? 'border-gold-accent bg-gold-accent text-white'
                  : 'border-borderColor text-grayText hover:border-gold-accent/50 hover:text-textColor',
              ].join(' ')}
            >
              {t(`agence.topCreateurs.filters.${v}`)}
            </button>
          ))}
        </div>

        {/* Artists grid */}
        {filteredArtists.length === 0 ? (
          <p className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-grayText montserrat py-12">
            {t('agence.topCreateurs.noResults')}
          </p>
        ) : null}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"
        >
          {filteredArtists.map((artist) => {
            const name = displayName(artist.profile)
            const href = `/agence/artists/${artist.profile.slug}`

            return (
              <div
                key={artist.id}
                data-creator-card
                className="group relative flex flex-col"
                style={{ opacity: 0 }}
              >
                {/* Image wrapper */}
                <div className="relative aspect-[3/4] overflow-hidden bg-cardBackground">
                  {artist.profile.profileImageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={getImageUrl(artist.profile.profileImageUrl) ?? artist.profile.profileImageUrl}
                      alt={name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-backgroundGrey" />
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Tags on hover */}
                  {artist.profile.tags.length > 0 && (
                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      {artist.profile.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs uppercase tracking-[0.3em] text-white/90 montserrat bg-black/40 backdrop-blur-sm px-2 py-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Order number badge */}
                  <div className="absolute top-4 left-4">
                    <span className="text-xs uppercase tracking-[0.4em] text-white/60 montserrat">
                      {String(artist.order).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-col flex-1 pt-5 pb-6 border-b border-borderColor">
                  <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.35em] text-grayText montserrat mb-1">
                    {artist.profile.title ?? t('agence.topCreateurs.defaultTitle')}
                  </p>
                  <h3 className="serif text-xl font-light text-textColor leading-tight mb-4">
                    {name}
                  </h3>

                  <Link
                    href={href}
                    className="mt-auto inline-flex items-center gap-2 text-[11px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] montserrat border border-gold-accent text-textColor px-4 py-2.5 hover:bg-gold-accent hover:text-white transition-all duration-300 self-start"
                  >
                    {t('agence.topCreateurs.cta')}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Section footer link */}
        <div className="mt-12 sm:mt-16 flex justify-start sm:justify-end">
          <Link
            href="/agence/artists"
            className="text-[11px] sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.4em] montserrat text-grayText hover:text-gold-accent transition-colors duration-300 inline-flex items-center gap-3"
          >
            {t('agence.topCreateurs.seeAll')}
            <span className="w-8 h-px bg-current" />
          </Link>
        </div>

      </div>
    </section>
  )
}
