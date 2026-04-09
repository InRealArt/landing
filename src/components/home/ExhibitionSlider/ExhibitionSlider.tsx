'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import type { ExhibitionData } from '@/actions/exhibitionActions'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDateRange(startIso: string, endIso: string, locale: string): string {
  const start = new Date(startIso)
  const end = new Date(endIso)
  const fmt = new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return `${fmt.format(start)} — ${fmt.format(end)}`
}

function formatArtistNames(exhibition: ExhibitionData): string {
  return exhibition.artists
    .map((a) => `${a.name} ${a.surname}`.trim())
    .filter(Boolean)
    .join(', ')
}

// Hauteur par défaut affichée pendant la phase de mesure initiale
const DEFAULT_HEIGHT = 'clamp(400px, 72vh, 860px)'

// ---------------------------------------------------------------------------
// Image measurement utilities
// ---------------------------------------------------------------------------

interface ImageDimensions {
  width: number
  height: number
}

/**
 * Charge une image et retourne ses dimensions naturelles.
 * Résout à null si l'URL est null ou si le chargement échoue.
 */
function measureImage(url: string): Promise<ImageDimensions | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => resolve(null)
    img.src = url
  })
}

/**
 * Charge toutes les images en parallèle et retourne la hauteur du conteneur
 * correspondant à la plus petite image, en px, clamped entre 320 et 920.
 *
 * Stratégie : pour chaque image on calcule la hauteur qu'elle occuperait si
 * elle remplissait la largeur du conteneur (ratio-préservé). La hauteur retenue
 * est le minimum de toutes ces hauteurs calculées — ce qui force le conteneur
 * à la taille de l'image la plus contraignante (la plus basse en ratio H/W).
 */
async function computeMinContainerHeight(
  urls: (string | null)[],
  containerWidth: number,
): Promise<number> {
  const validUrls = urls.filter((u): u is string => Boolean(u))
  if (validUrls.length === 0) return 500

  const results = await Promise.all(validUrls.map(measureImage))
  const dimensions = results.filter((d): d is ImageDimensions => d !== null)

  if (dimensions.length === 0) return 500

  const heights = dimensions.map((d) => (d.height / d.width) * containerWidth)
  const minHeight = Math.min(...heights)

  return Math.max(320, Math.min(minHeight, 920))
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface SlideImageProps {
  imageUrl: string | null
  name: string
  priority: boolean
}

function SlideImage({ imageUrl, name, priority }: SlideImageProps) {
  if (!imageUrl) {
    return <div className="absolute inset-0 bg-backgroundGrey" aria-hidden="true" />
  }

  // Cloudflare URLs are not in next.config.ts remotePatterns, so we use <img>.
  // This mirrors the pattern in the existing expoActions.ts.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={name}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding={priority ? 'sync' : 'async'}
      loading={priority ? 'eager' : 'lazy'}
      className="absolute inset-0 w-full h-full object-cover"
    />
  )
}

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
      suppressHydrationWarning
      style={{ [direction === 'prev' ? 'left' : 'right']: '1.5rem' }}
      className="
        group absolute top-1/2 -translate-y-1/2 z-20
        flex items-center justify-center
        text-white/80 hover:text-white
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60
        select-none
      "
    >
      <span
        className="
          flex items-center justify-center
          w-10 h-10
          border border-white/30 group-hover:border-white/80
          transition-colors duration-200
        "
        aria-hidden="true"
      >
        {direction === 'prev' ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M9 2L4 7L9 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M5 2L10 7L5 12"
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
// Skeleton — reprend les mêmes marges externes que le slider
// ---------------------------------------------------------------------------

export function ExhibitionSliderSkeleton() {
  return (
    <div className="px-6 sm:px-12 lg:px-24 xl:px-32 pt-headerSize pb-6">
      <div
        className="w-full bg-backgroundGrey animate-pulse"
        style={{ height: DEFAULT_HEIGHT }}
        aria-hidden="true"
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const AUTOPLAY_MS = 5000
// Durée du crossfade en ms — doit correspondre à la valeur CSS ci-dessous
const CROSSFADE_MS = 700

interface ExhibitionSliderProps {
  exhibitions: ExhibitionData[]
}

export default function ExhibitionSlider({ exhibitions }: ExhibitionSliderProps) {
  const { t, language } = useTranslation()

  const [current, setCurrent] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  // containerHeight est null pendant la phase de mesure initiale,
  // puis fixé en px pour toute la durée de vie du composant.
  const [containerHeight, setContainerHeight] = useState<number | null>(null)

  const sectionRef = useRef<HTMLElement>(null)
  const isTransitioningRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const total = exhibitions.length

  // Au montage : pré-charger toutes les images, mesurer leurs dimensions naturelles,
  // retenir la hauteur correspondant à la plus petite image (ratio le plus bas).
  useEffect(() => {
    const urls = exhibitions.map((e) => e.imageUrl)
    const containerWidth = sectionRef.current?.clientWidth ?? window.innerWidth

    computeMinContainerHeight(urls, containerWidth).then((height) => {
      setContainerHeight(height)
    })
    // On ne veut exécuter ce calcul qu'une seule fois au montage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  const goNext = useCallback(() => {
    goTo((current + 1) % total)
  }, [current, goTo, total])

  const goPrev = useCallback(() => {
    goTo((current - 1 + total) % total)
  }, [current, goTo, total])

  // Autoplay
  useEffect(() => {
    if (isHovered || total <= 1) return
    timerRef.current = setTimeout(goNext, AUTOPLAY_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [current, isHovered, total, goNext])

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev])

  if (total === 0) return null

  const expo = exhibitions[current]
  const artistNames = formatArtistNames(expo)
  const dateRange = formatDateRange(expo.startDate, expo.endDate, language)

  // Pendant la mesure initiale on utilise DEFAULT_HEIGHT ; une fois mesuré, on fixe en px.
  const resolvedHeight = containerHeight !== null ? `${containerHeight}px` : DEFAULT_HEIGHT

  return (
    // Wrapper extérieur : apporte les marges horizontales et le padding vertical
    <div className="px-6 sm:px-12 lg:px-24 xl:px-32 pt-headerSize pb-6">
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden"
        style={{ height: resolvedHeight }}
        aria-label={t('exhibitions.sliderAriaLabel')}
        suppressHydrationWarning
        aria-roledescription="carousel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/*
          Crossfade layer stack — toutes les slides sont montées simultanément,
          empilées en absolute inset-0. Seule la slide active a opacity:1.
          La transition opacity de 700ms garantit un fondu enchaîné sans flash.
          Le z-index actif est légèrement supérieur pour que le texte (z-10)
          reste toujours au-dessus de la slide sortante.
        */}
        {exhibitions.map((exhibition, idx) => {
          const isActive = idx === current
          return (
            <div
              key={exhibition.id}
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
              <SlideImage
                imageUrl={exhibition.imageUrl}
                name={exhibition.name}
                priority={idx === 0}
              />
            </div>
          )
        })}

        {/* Gradients — au-dessus de toutes les slides (z-2), sous le texte (z-10) */}
        {/* Bottom gradient for text legibility — couvre ~95% de la hauteur */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            background:
              'linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.92) 18%, rgba(0,0,0,0.78) 38%, rgba(0,0,0,0.50) 58%, rgba(0,0,0,0.20) 78%, rgba(0,0,0,0.04) 92%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Top gradient so arrows are readable */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 2,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 25%)',
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

        {/* Bottom overlay — texte pleine largeur, dots en dessous */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col px-10 md:px-16 pb-10 md:pb-14 gap-y-6 md:gap-y-8">

          {/* ── Text block — full width ── */}
          <div className="flex flex-col gap-y-3 w-full">

            {/* Location line */}
            <span
              className="inline-flex items-center self-start gap-2 text-white/70 text-[10px] uppercase tracking-[0.35em]"
            >
              <span>{expo.address}</span>
            </span>

            {/* Exhibition name — élément dominant, pleine largeur */}
            <p
              className="unbounded text-white uppercase font-black leading-[0.82] tracking-tight w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[5.5rem]"
              suppressHydrationWarning
            >
              {expo.name}
            </p>

            {/* Artist names — sous le nom de l'exposition */}
            {artistNames && (
              <h2
                className="unbounded text-white/85 uppercase font-medium tracking-[0.18em]"
                style={{ fontSize: 'clamp(0.45rem, 0.7vw, 0.6rem)' }}
                suppressHydrationWarning
              >
                {artistNames}
              </h2>
            )}

            {/* Dates */}
            <p
              className="text-white/50 text-[10px] uppercase tracking-[0.3em]"
              suppressHydrationWarning
            >
              {dateRange}
            </p>

          </div>

          {/* ── Dots + counter — ligne séparée sous le texte ── */}
          <div className="flex items-center gap-4">
            {/* Dot pagination */}
            {total > 1 && (
              <div
                className="flex items-center gap-2"
                role="tablist"
                aria-label={t('exhibitions.pagination')}
                suppressHydrationWarning
              >
                {exhibitions.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={idx === current}
                    aria-label={`${t('exhibitions.slide')} ${idx + 1}`}
                    suppressHydrationWarning
                    onClick={() => goTo(idx)}
                    className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-full"
                    style={{
                      display: 'block',
                      width: idx === current ? '24px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      backgroundColor:
                        idx === current ? 'var(--gold-accent)' : 'rgba(255,255,255,0.3)',
                      transition:
                        'width 0.35s cubic-bezier(0.19, 1, 0.22, 1), background-color 0.25s ease',
                    }}
                  />
                ))}
              </div>
            )}

            {/* Numeric counter */}
            <span className="unbounded text-white/40 text-xs tabular-nums" aria-hidden="true">
              <span className="text-white/90">{String(current + 1).padStart(2, '0')}</span>
              {' / '}
              {String(total).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Live region pour l'accessibilité — annonce les changements de slide */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {expo.name}
        </div>
      </section>
    </div>
  )
}
