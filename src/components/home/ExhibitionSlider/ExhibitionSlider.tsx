'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { useLanguageStore } from '@/store/languageStore'
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

// Hauteur par défaut appliquée avant que l'image soit mesurée et entre deux slides
const DEFAULT_HEIGHT = 'clamp(400px, 72vh, 860px)'

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface SlideImageProps {
  imageUrl: string | null
  name: string
  priority: boolean
  onImageLoaded: (height: number) => void
}

function SlideImage({ imageUrl, name, priority, onImageLoaded }: SlideImageProps) {
  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget
    const { naturalWidth, naturalHeight } = img
    if (naturalWidth && naturalHeight) {
      const ratio = naturalHeight / naturalWidth
      // Mesure la largeur réelle du conteneur parent (la <section> arrondie)
      const containerWidth = img.parentElement?.clientWidth ?? window.innerWidth
      const computedHeight = containerWidth * ratio
      // Clamper pour éviter des hauteurs absurdes sur des images très hautes ou très larges
      const clampedHeight = Math.max(320, Math.min(computedHeight, 920))
      onImageLoaded(clampedHeight)
    }
  }

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
      onLoad={handleLoad}
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

interface ExhibitionSliderProps {
  exhibitions: ExhibitionData[]
}

export default function ExhibitionSlider({ exhibitions }: ExhibitionSliderProps) {
  const { t, language } = useLanguageStore()

  const [current, setCurrent] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [animClass, setAnimClass] = useState('')

  // Hauteur adaptative : string pour alterner entre clamp() et une valeur px mesurée
  const [containerHeight, setContainerHeight] = useState<string>(DEFAULT_HEIGHT)

  const isAnimatingRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const total = exhibitions.length

  const goTo = useCallback(
    (index: number, dir: 'next' | 'prev') => {
      if (isAnimatingRef.current || total === 0) return
      isAnimatingRef.current = true
      // Réinitialiser à la hauteur par défaut avant que la nouvelle image se charge
      setContainerHeight(DEFAULT_HEIGHT)
      setAnimClass(dir === 'next' ? 'expo-slide-enter-next' : 'expo-slide-enter-prev')
      setCurrent(index)
      setTimeout(() => {
        isAnimatingRef.current = false
      }, 450)
    },
    [total]
  )

  const goNext = useCallback(() => {
    goTo((current + 1) % total, 'next')
  }, [current, goTo, total])

  const goPrev = useCallback(() => {
    goTo((current - 1 + total) % total, 'prev')
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

  const handleImageLoaded = (height: number) => {
    setContainerHeight(`${height}px`)
  }

  return (
    // Wrapper extérieur : apporte les marges horizontales et le padding vertical
    <div className="px-6 sm:px-12 lg:px-24 xl:px-32 pt-headerSize pb-6">
      <section
        className="relative w-full overflow-hidden"
        style={{
          height: containerHeight,
          transition: 'height 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
        }}
        aria-label={t('exhibitions.sliderAriaLabel')}
        aria-roledescription="carousel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Slide image layer — keyed on current so it remounts on change */}
        <div
          key={expo.id}
          className={`absolute inset-0 ${animClass}`}
          aria-live="polite"
          aria-atomic="true"
        >
          <SlideImage
            imageUrl={expo.imageUrl}
            name={expo.name}
            priority={current === 0}
            onImageLoaded={handleImageLoaded}
          />

          {/* Bottom gradient for text legibility */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.32) 45%, transparent 70%)',
            }}
            aria-hidden="true"
          />

          {/* Top gradient so arrows are readable */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, transparent 25%)',
            }}
            aria-hidden="true"
          />
        </div>

        {/* Navigation arrows */}
        {total > 1 && (
          <>
            <ArrowButton direction="prev" onClick={goPrev} label={t('exhibitions.prev')} />
            <ArrowButton direction="next" onClick={goNext} label={t('exhibitions.next')} />
          </>
        )}

        {/* Bottom overlay bar — text left, dots+counter right */}
        <div className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between px-8 md:px-14 pb-10 md:pb-14 gap-8">

          {/* ── Text block — bottom left ── */}
          <div className="flex flex-col gap-2 max-w-lg lg:max-w-2xl min-w-0">

            {/* Location line */}
            <span className="inline-flex items-center self-start gap-2 text-white/65 text-[10px] uppercase tracking-[0.25em]">
              <span
                className="block w-4 h-px shrink-0"
                style={{ backgroundColor: 'var(--gold-accent)' }}
                aria-hidden="true"
              />
              <span className="truncate">{expo.address}</span>
            </span>

            {/* Artist names — headline */}
            {artistNames && (
              <h2
                className="unbounded text-white uppercase font-bold leading-none tracking-tight"
                style={{ fontSize: 'clamp(1.4rem, 3.8vw, 3.25rem)' }}
                suppressHydrationWarning
              >
                {artistNames}
              </h2>
            )}

            {/* Exhibition name */}
            <p
              className="text-white/75 italic"
              style={{
                fontFamily: 'var(--font-bricolage), serif',
                fontSize: 'clamp(0.875rem, 1.4vw, 1.1rem)',
              }}
              suppressHydrationWarning
            >
              {expo.name}
            </p>

            {/* Dates */}
            <p
              className="text-white/50 text-[10px] uppercase tracking-[0.2em] mt-0.5"
              suppressHydrationWarning
            >
              {dateRange}
            </p>

          </div>

          {/* ── Dots + counter — bottom right ── */}
          <div className="flex flex-col items-end gap-3 shrink-0 pb-1">
            {/* Numeric counter */}
            <span className="unbounded text-white/40 text-xs tabular-nums" aria-hidden="true">
              <span className="text-white/90">{String(current + 1).padStart(2, '0')}</span>
              {' / '}
              {String(total).padStart(2, '0')}
            </span>

            {/* Dot pagination */}
            {total > 1 && (
              <div
                className="flex items-center gap-2"
                role="tablist"
                aria-label={t('exhibitions.pagination')}
              >
                {exhibitions.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    role="tab"
                    aria-selected={idx === current}
                    aria-label={`${t('exhibitions.slide')} ${idx + 1}`}
                    onClick={() => goTo(idx, idx > current ? 'next' : 'prev')}
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
          </div>
        </div>
      </section>
    </div>
  )
}
