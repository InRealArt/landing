'use client'

import Link from 'next/link'
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

function getStatus(startIso: string, endIso: string): 'current' | 'upcoming' | 'past' {
  const now = Date.now()
  const start = new Date(startIso).getTime()
  const end = new Date(endIso).getTime()
  if (now < start) return 'upcoming'
  if (now > end) return 'past'
  return 'current'
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

export function ExhibitionSliderSkeleton() {
  return (
    <section className="py-24 lg:py-32 bg-backgroundColor border-y border-borderColor">
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10">
        <div className="h-6 w-48 bg-backgroundGrey animate-pulse mb-16" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-backgroundColor">
              <div className="aspect-[4/5] bg-backgroundGrey animate-pulse" />
              <div className="p-6 space-y-3">
                <div className="h-3 w-16 bg-backgroundGrey animate-pulse" />
                <div className="h-5 w-3/4 bg-backgroundGrey animate-pulse" />
                <div className="h-3 w-1/2 bg-backgroundGrey animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

interface ExhibitionCardProps {
  exhibition: ExhibitionData
  priority: boolean
  language: string
  t: (key: string) => string
}

function ExhibitionCard({ exhibition, priority, language, t }: ExhibitionCardProps) {
  const status = getStatus(exhibition.startDate, exhibition.endDate)
  const artistNames = formatArtistNames(exhibition)
  const dateRange = formatDateRange(exhibition.startDate, exhibition.endDate, language)

  const statusLabel = {
    current: t('exhibitions.status.current'),
    upcoming: t('exhibitions.status.upcoming'),
    past: t('exhibitions.status.past'),
  }[status]

  const statusColor = {
    current: 'text-gold-accent border-gold-accent/40',
    upcoming: 'text-textColor border-borderColor',
    past: 'text-grayText border-borderColor',
  }[status]

  const inner = (
    <article className="group flex flex-col h-full bg-backgroundColor">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-backgroundGrey">
        {exhibition.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={exhibition.imageUrl}
            alt={exhibition.name}
            fetchPriority={priority ? 'high' : 'auto'}
            loading={priority ? 'eager' : 'lazy'}
            decoding={priority ? 'sync' : 'async'}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-backgroundGrey" aria-hidden="true" />
        )}

        {/* Status badge */}
        <div className="absolute top-4 left-4">
          <span
            className={`text-[9px] uppercase tracking-[0.4em] montserrat px-3 py-1.5 border bg-backgroundColor/90 backdrop-blur-sm ${statusColor}`}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-2 p-6 flex-1">
        {/* Artists */}
        {artistNames && (
          <p className="text-[10px] uppercase tracking-[0.35em] text-gold-accent montserrat leading-none">
            {artistNames}
          </p>
        )}

        {/* Title */}
        <h3 className="serif text-xl font-light text-textColor leading-snug group-hover:text-gold-accent transition-colors duration-300">
          {exhibition.name}
        </h3>

        {/* Location */}
        {exhibition.address && (
          <p className="text-[11px] text-grayText montserrat">
            {exhibition.address}
          </p>
        )}

        {/* Dates */}
        <p className="text-[10px] uppercase tracking-[0.25em] text-grayText/60 montserrat mt-auto pt-4">
          {dateRange}
        </p>
      </div>

      {/* Bottom border accent on hover */}
      <div className="h-px bg-gold-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </article>
  )

  if (exhibition.linkToEvent) {
    return (
      <Link href={exhibition.linkToEvent} target="_blank" rel="noopener noreferrer" className="flex flex-col">
        {inner}
      </Link>
    )
  }

  return <div className="flex flex-col">{inner}</div>
}

// ---------------------------------------------------------------------------
// Main grid
// ---------------------------------------------------------------------------

interface ExhibitionSliderProps {
  exhibitions: ExhibitionData[]
}

export default function ExhibitionSlider({ exhibitions }: ExhibitionSliderProps) {
  const { t, language } = useTranslation()

  if (exhibitions.length === 0) return null

  // Sort: current first, then upcoming, then past
  const sorted = [...exhibitions].sort((a, b) => {
    const order = { current: 0, upcoming: 1, past: 2 }
    return order[getStatus(a.startDate, a.endDate)] - order[getStatus(b.startDate, b.endDate)]
  })

  return (
    <section
      className="py-24 lg:py-32 bg-backgroundColor border-y border-borderColor"
      aria-label={t('exhibitions.gridAriaLabel')}
    >
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-16 pb-6 border-b border-borderColor">
          <div>
            <span className="section-number">{t('exhibitions.eyebrow')}</span>
            <h2 className="serif text-4xl md:text-5xl font-light leading-none text-textColor mt-3">
              {t('exhibitions.sectionTitle')}
            </h2>
          </div>
          <span className="unbounded text-[10px] text-grayText tabular-nums hidden sm:block">
            {String(sorted.length).padStart(2, '0')}
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {sorted.map((exhibition, i) => (
            <ExhibitionCard
              key={exhibition.id}
              exhibition={exhibition}
              priority={i < 3}
              language={language}
              t={t}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
