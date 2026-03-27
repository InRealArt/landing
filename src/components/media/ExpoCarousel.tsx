'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import type { ExpoData } from '@/actions/expoActions'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const AUTOPLAY_MS = 5000
const CROSSFADE_MS = 700

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface ArrowButtonProps {
  direction: 'prev' | 'next'
  onClick: () => void
  label: string
}

function ArrowButton({ direction, onClick, label }: ArrowButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{ [direction === 'prev' ? 'left' : 'right']: '1rem' }}
      className="
        group absolute top-1/2 -translate-y-1/2 z-20
        flex items-center justify-center
        text-white/70 hover:text-white
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50
        select-none
      "
    >
      <span
        className="
          flex items-center justify-center
          w-9 h-9
          border border-white/25 group-hover:border-white/70
          transition-colors duration-200
        "
        aria-hidden="true"
      >
        {direction === 'prev' ? (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M8 1.5L3 6L8 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M4 1.5L9 6L4 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </button>
  )
}

// ---------------------------------------------------------------------------
// Skeleton export
// ---------------------------------------------------------------------------

export function ExpoCarouselSkeleton() {
  return (
    <section className="mb-16 md:mb-24 lg:mb-32">
      {/* Section header */}
      <div className="flex items-baseline gap-4 mb-8 md:mb-10">
        <div
          className="h-7 w-48 animate-pulse"
          style={{ background: 'var(--border-light)' }}
          aria-hidden="true"
        />
        <div
          className="h-px flex-grow animate-pulse"
          style={{ background: 'var(--border-light)' }}
          aria-hidden="true"
        />
      </div>
      <div
        className="w-full aspect-[3/2] sm:aspect-[16/9] lg:aspect-[21/9] animate-pulse"
        style={{ background: 'var(--border-light)' }}
        aria-hidden="true"
      />
    </section>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface ExpoCarouselProps {
  expos: ExpoData[]
}

export default function ExpoCarousel({ expos }: ExpoCarouselProps) {
  const { t } = useLanguageStore()

  const [current, setCurrent] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  const isTransitioningRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const total = expos.length

  const goTo = useCallback(
    (index: number) => {
      if (isTransitioningRef.current || total === 0 || index === current) return
      isTransitioningRef.current = true
      setCurrent(index)
      setTimeout(() => {
        isTransitioningRef.current = false
      }, CROSSFADE_MS)
    },
    [current, total]
  )

  const goNext = useCallback(() => goTo((current + 1) % total), [current, goTo, total])
  const goPrev = useCallback(() => goTo((current - 1 + total) % total), [current, goTo, total])

  // Autoplay — resets on every slide change or hover toggle
  useEffect(() => {
    if (isHovered || total <= 1) return
    timerRef.current = setTimeout(goNext, AUTOPLAY_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [current, isHovered, total, goNext])

  // Keyboard navigation — scoped to window, non-invasive (only when focused within)
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev])

  if (total === 0) return null

  const expo = expos[current]

  return (
    <section className="mb-16 md:mb-24 lg:mb-32">
      {/* ── Section header ── */}
      <div className="flex items-baseline gap-4 mb-8 md:mb-10">
        <h2
          className="serif text-2xl sm:text-3xl font-bold whitespace-nowrap"
          style={{ color: 'var(--text)' }}
        >
          {t('exhibitions.sectionTitle')}
        </h2>
        <div
          className="h-px flex-grow"
          style={{ background: 'var(--border-light)' }}
          aria-hidden="true"
        />
      </div>

      {/* ── Carousel ── */}
      <div
        className="relative w-full overflow-hidden aspect-[3/2] sm:aspect-[16/9] lg:aspect-[21/9]"
        role="region"
        aria-label={t('exhibitions.sliderAriaLabel')}
        aria-roledescription="carousel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Slide stack — crossfade via opacity */}
        {expos.map((e, idx) => {
          const isActive = idx === current
          return (
            <div
              key={e.href}
              aria-hidden={!isActive}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 1 : 0,
                transition: `opacity ${CROSSFADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                willChange: 'opacity',
              }}
            >
              {e.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={e.imageUrl}
                  alt={e.title}
                  fetchPriority={idx === 0 ? 'high' : 'auto'}
                  decoding={idx === 0 ? 'sync' : 'async'}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ background: 'var(--canvas-bg)' }}
                  aria-hidden="true"
                />
              )}
            </div>
          )
        })}

        {/* Bottom gradient — text legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            background:
              'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.88) 16%, rgba(0,0,0,0.70) 34%, rgba(0,0,0,0.38) 54%, rgba(0,0,0,0.12) 74%, transparent 92%)',
          }}
          aria-hidden="true"
        />

        {/* Top gradient — arrows legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, transparent 22%)',
          }}
          aria-hidden="true"
        />

        {/* Navigation arrows */}
        {total > 1 && (
          <>
            <ArrowButton direction="prev" onClick={goPrev} label={t('exhibitions.prev')} />
            <ArrowButton direction="next" onClick={goNext} label={t('exhibitions.next')} />
          </>
        )}

        {/* Bottom overlay — text + controls */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 sm:px-10 pb-6 sm:pb-10 flex flex-col gap-y-4 sm:gap-y-6">

          {/* Text block */}
          <div className="flex flex-col gap-y-1.5">
            {/* Location */}
            <span className="text-white/60 text-[10px] uppercase tracking-[0.35em] montserrat">
              {expo.location}
            </span>

            {/* Exhibition title — dominant element */}
            <p
              className="serif text-white font-bold leading-[1.05] w-full"
              style={{ fontSize: 'clamp(1.5rem, 4.5vw, 3rem)' }}
            >
              {expo.title}
            </p>

            {/* Date */}
            {expo.date && (
              <p className="text-white/50 text-[10px] uppercase tracking-[0.3em] montserrat">
                {expo.date}
              </p>
            )}
          </div>

          {/* Controls row — dots + counter + CTA */}
          <div className="flex items-center gap-5 flex-wrap">
            {/* Dot pagination */}
            {total > 1 && (
              <div
                className="flex items-center gap-2"
                role="tablist"
                aria-label={t('exhibitions.pagination')}
              >
                {expos.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={idx === current}
                    aria-label={`${t('exhibitions.slide')} ${idx + 1}`}
                    onClick={() => goTo(idx)}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 rounded-full"
                    style={{
                      display: 'block',
                      width: idx === current ? '22px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      backgroundColor:
                        idx === current ? 'var(--gold-accent)' : 'rgba(255,255,255,0.28)',
                      transition:
                        'width 0.35s cubic-bezier(0.19, 1, 0.22, 1), background-color 0.25s ease',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Numeric counter */}
            <span
              className="unbounded text-white/35 text-[10px] tabular-nums"
              aria-hidden="true"
            >
              <span className="text-white/80">{String(current + 1).padStart(2, '0')}</span>
              {' / '}
              {String(total).padStart(2, '0')}
            </span>

            {/* CTA — linked to the expo page */}
            <a
              href={expo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-mag inline-flex items-center min-h-[36px] ml-auto"
              style={{ color: 'rgba(255,255,255,0.85)', borderColor: 'rgba(255,255,255,0.3)' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--gold-accent)'
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--gold-accent)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.85)'
                ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.3)'
              }}
            >
              {t('exhibitions.readMore')}
            </a>
          </div>
        </div>

        {/* Accessible live region */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {expo.title}
        </div>
      </div>
    </section>
  )
}
