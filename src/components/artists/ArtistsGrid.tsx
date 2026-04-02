'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { ArtistData } from '@/actions/artistActions'
import ArtistsMosaic from './ArtistsMosaic'

interface Props {
  initialArtists: ArtistData[]
}

/*
 * Sort key: surname, falling back to pseudo if surname is absent.
 * Defined at module scope so useMemo dependency arrays don't need to include it.
 */
function sortKey(a: { surname: string; pseudo: string }): string {
  return (a.surname?.trim() || a.pseudo?.trim() || '').toLowerCase()
}

/*
 * Skeleton — mirrors the two-section layout:
 *   1. A tall mosaic placeholder (shimmer blocks)
 *   2. The alphabetical-list placeholder (text-line rows)
 */
export function ArtistsGridSkeleton() {
  const listRows = Array.from({ length: 24 })
  return (
    <>
      {/* Mosaic skeleton */}
      <section className="bg-backgroundColor border-b border-borderColor">
        <div className="grid grid-cols-12 grid-rows-3 gap-px bg-borderColor" style={{ minHeight: '80vh' }}>
          {/* A — tall left (col 1–3, rows 1–2) */}
          <div className="col-span-3 row-span-2 bg-textColor/10 animate-pulse" />
          {/* B — wide top-center */}
          <div className="col-span-4 bg-textColor/10 animate-pulse" />
          {/* C — wide top-right */}
          <div className="col-span-5 bg-textColor/10 animate-pulse" />
          {/* D — tall center (col 4–6, rows 2–3) */}
          <div className="col-span-3 row-span-2 bg-textColor/10 animate-pulse" />
          {/* E — landscape */}
          <div className="col-span-3 bg-textColor/10 animate-pulse" />
          {/* F — landscape right */}
          <div className="col-span-3 bg-textColor/10 animate-pulse" />
          {/* G — cinematic bottom-left */}
          <div className="col-span-6 bg-textColor/10 animate-pulse" />
        </div>
      </section>

      {/* Alphabetical list skeleton */}
      <section className="py-24 px-4 sm:px-10 bg-backgroundGrey border-y border-borderColor">
        <div className="max-w-screen-xl mx-auto">
          <div className="h-3 w-40 bg-textColor/10 animate-pulse mb-16" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
            {listRows.map((_, i) => (
              <div key={i} className="py-3 border-b border-borderColor">
                <div
                  className="h-2.5 bg-textColor/10 animate-pulse"
                  style={{ width: `${50 + (i % 5) * 10}%` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default function ArtistsGrid({ initialArtists }: Props) {
  const { t, language } = useTranslation()

  /*
   * Build enriched artist records client-side so language switching works
   * without a refetch. Names are not translated.
   */
  const artists = useMemo(
    () =>
      initialArtists.map(a => ({
        slug: a.slug,
        fullName: `${a.name} ${a.surname}`.trim(),
        surname: a.surname,
        pseudo: a.pseudo,
        imageUrl: a.imageUrl,
        hasImage: Boolean(a.imageUrl),
        isTopArtist: a.isTopArtist ?? false,
      })),
    [initialArtists],
  )

  /*
   * Mosaic: only artists flagged as top artists, with an image.
   * DB order is preserved (curated editorial ordering).
   */
  const featuredArtists = useMemo(
    () => artists.filter(a => a.isTopArtist && a.hasImage),
    [artists],
  )

  const sortedArtists = useMemo(
    () =>
      [...artists].sort((a, b) =>
        sortKey(a).localeCompare(sortKey(b), language, { sensitivity: 'base' }),
      ),
    [artists, language],
  )

  return (
    <>
      {/* ── Section 1: Featured mosaic (top artists only) ── */}
      {featuredArtists.length > 0 && (
        <ArtistsMosaic
          artists={featuredArtists.map(a => ({
            slug: a.slug,
            name: a.fullName,
            imageUrl: a.imageUrl,
          }))}
        />
      )}

      {/* ── Section 2: Alphabetical roster ── */}
      <section
        aria-label={t('artists.roster.label')}
        className="py-24 px-4 sm:px-10 bg-backgroundGrey border-y border-borderColor"
      >
        <div className="max-w-screen-xl mx-auto">

          {/* Section header */}
          <div className="flex items-baseline justify-between pb-12 mb-12 border-b border-borderColor">
            <span className="section-number !mb-0 font-bold">{t('artists.roster.label')}</span>
          </div>

          {/* Flat alphabetical list — two equal columns */}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
            {sortedArtists.map(artist => (
              <li key={artist.slug}>
                <Link
                  href={`/artists/${artist.slug}`}
                  className="group flex items-center py-2.5 pr-4 text-textColor hover:text-gold-accent transition-colors duration-200 focus-visible:outline-none focus-visible:text-gold-accent"
                >
                  <span className="text-sm uppercase tracking-[0.2em] bricolage-grotesque leading-snug font-bold">
                    {artist.fullName}
                  </span>
                  {/* Subtle arrow — appears on hover */}
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="ml-2 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 flex-shrink-0 text-gold-accent"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
