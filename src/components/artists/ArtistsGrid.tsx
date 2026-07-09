'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { ArtistData } from '@/actions/artistActions'
import { ArtistArtworkPreview } from '@/actions/presaleArtworkActions'
import ArtistsMosaic from './ArtistsMosaic'
import ArtistRosterWithPreview from './ArtistHoverPreview'

interface Props {
  initialArtists: ArtistData[]
  artworkPreviews: ArtistArtworkPreview[]
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

export default function ArtistsGrid({ initialArtists, artworkPreviews }: Props) {
  const { t, language } = useTranslation()

  // Build a map artistId → artwork imageUrls (max 3)
  const artworksByArtistId = useMemo(() => {
    const map = new Map<number, string[]>()
    for (const p of artworkPreviews) {
      const list = map.get(p.artistId) ?? []
      list.push(p.imageUrl)
      map.set(p.artistId, list)
    }
    return map
  }, [artworkPreviews])

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
        artworkImageUrls: artworksByArtistId.get(a.artistId) ?? [],
      })),
    [initialArtists, artworksByArtistId],
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

  const rosterArtists = useMemo(
    () => sortedArtists.map(a => ({
      slug: a.slug,
      fullName: a.fullName,
      surname: a.surname,
      pseudo: a.pseudo,
      imageUrl: a.imageUrl,
      artworkImageUrls: a.artworkImageUrls,
    })),
    [sortedArtists],
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

          <ArtistRosterWithPreview artists={rosterArtists} />
        </div>
      </section>

      {/* ── Section 3: Pont vers l'Agence ── */}
      {collaborationCount > 0 && (
        <section className="py-20 px-4 sm:px-10 bg-backgroundColor border-b border-borderColor">
          <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-grayText mb-3">
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
