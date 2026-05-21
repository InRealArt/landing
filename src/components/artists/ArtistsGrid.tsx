'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { ArtistData } from '@/actions/artistActions'
import ArtistsMosaic from './ArtistsMosaic'

interface Props {
  initialArtists: ArtistData[]
}

function sortKey(a: { surname: string; pseudo: string }): string {
  return (a.surname?.trim() || a.pseudo?.trim() || '').toLowerCase()
}

export function ArtistsGridSkeleton() {
  const listRows = Array.from({ length: 24 })
  return (
    <>
      <section className="bg-backgroundColor border-b border-borderColor">
        <div className="grid grid-cols-12 grid-rows-3 gap-px bg-borderColor" style={{ minHeight: '80vh' }}>
          <div className="col-span-3 row-span-2 bg-textColor/10 animate-pulse" />
          <div className="col-span-4 bg-textColor/10 animate-pulse" />
          <div className="col-span-5 bg-textColor/10 animate-pulse" />
          <div className="col-span-3 row-span-2 bg-textColor/10 animate-pulse" />
          <div className="col-span-3 bg-textColor/10 animate-pulse" />
          <div className="col-span-3 bg-textColor/10 animate-pulse" />
          <div className="col-span-6 bg-textColor/10 animate-pulse" />
        </div>
      </section>

      <section className="py-24 px-4 sm:px-10 bg-backgroundGrey border-y border-borderColor">
        <div className="max-w-screen-xl mx-auto">
          <div className="h-3 w-40 bg-textColor/10 animate-pulse mb-16" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
            {listRows.map((_, i) => (
              <div key={i} className="py-3 border-b border-borderColor">
                <div className="h-2.5 bg-textColor/10 animate-pulse" style={{ width: `${50 + (i % 5) * 10}%` }} />
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
        ugcSlug: a.ugcSlug ?? null,
      })),
    [initialArtists],
  )

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

  const collaborationCount = useMemo(
    () => artists.filter(a => a.ugcSlug).length,
    [artists],
  )

  return (
    <>
      {/* ── Section 1: Featured mosaic ── */}
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
          <div className="flex items-baseline justify-between pb-12 mb-12 border-b border-borderColor">
            <span className="section-number !mb-0 font-bold">{t('artists.roster.label')}</span>
          </div>

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

      {/* ── Section 3: Pont vers l'Agence ── */}
      {collaborationCount > 0 && (
        <section className="py-20 px-4 sm:px-10 bg-backgroundColor border-b border-borderColor">
          <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.4em] text-grayText mb-3">
                {t('artists.hub.agenceBridgeEyebrow')}
              </p>
              <p className="text-lg font-bold uppercase tracking-[0.1em] bricolage-grotesque text-textColor">
                {t('artists.hub.agenceBridgeTitle')}
              </p>
              <p className="text-sm text-grayText mt-2 max-w-md">
                {t('artists.hub.agenceBridgeDescription')}
              </p>
            </div>
            <Link
              href="/agence"
              className="flex-shrink-0 px-8 py-3 border border-gold-accent text-gold-accent text-xs uppercase tracking-[0.2em] font-bold hover:bg-gold-accent hover:text-black transition-colors duration-200"
            >
              {t('artists.hub.agenceBridgeCta')}
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
