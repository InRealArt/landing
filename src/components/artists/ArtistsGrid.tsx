'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import { ArtistData } from '@/actions/artistActions'
import ArtistCard from './ArtistCard'
import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs'
import { EXTERNAL_URLS } from '@/constants/constants'

const PAGE_SIZE = 16 // 4 colonnes x 4 lignes

interface Props {
  initialArtists: ArtistData[]
}

export function ArtistsGridSkeleton() {
  const skeletons = Array.from({ length: PAGE_SIZE })
  return (
    <section className="py-32 px-4 sm:px-10 bg-backgroundColor">
      <div className="max-w-screen-xl mx-auto">
        {/* Filter bar skeleton */}
        <div className="flex items-end justify-between pb-6 mb-16 border-b border-borderColor">
          <div className="h-4 w-32 bg-textColor/10 animate-pulse" />
          <div className="h-3 w-24 bg-textColor/10 animate-pulse" />
        </div>

        {/* Grid skeleton — aspect-[3/4] cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 sm:gap-x-12 gap-y-16 sm:gap-y-20">
          {skeletons.map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] w-full bg-textColor/10 animate-pulse mb-6" />
              <div className="space-y-2 text-center">
                <div className="h-3 w-3/4 mx-auto bg-textColor/10 animate-pulse" />
                <div className="h-3 w-1/2 mx-auto bg-textColor/10 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function ArtistsGrid({ initialArtists }: Props) {
  const { t, language } = useLanguageStore()

  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    nationality: parseAsString.withDefault(''),
    q: parseAsString.withDefault(''),
  })

  // Resolve translations client-side — no re-fetch on language switch
  const artists = useMemo(() =>
    initialArtists.map(a => ({
      slug: a.slug,
      name: `${a.name} ${a.surname}`,
      role: a.translations?.artworkStyle?.[language] || a.artworkStyle || 'Artiste',
      photo: a.imageUrl,
      countryCode: a.countryCode ?? null,
      countryName: a.countryName ?? null,
      mediumTags: (a.mediumTags as string[] | undefined) ?? [],
    })),
    [initialArtists, language]
  )

  const filtered = useMemo(() => {
    const byNation = params.nationality
      ? artists.filter(a => {
          const code = params.nationality.toUpperCase()
          return (
            (a.countryCode || '').toUpperCase() === code ||
            (a.countryName || '').toLowerCase() === params.nationality.toLowerCase()
          )
        })
      : artists

    const query = params.q.trim().toLowerCase()
    return query
      ? byNation.filter(a => a.name.toLowerCase().includes(query))
      : byNation
  }, [artists, params.nationality, params.q])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const page = Math.min(params.page, totalPages)
  const start = (page - 1) * PAGE_SIZE
  const current = filtered.slice(start, start + PAGE_SIZE)

  const nationalities = useMemo(() => {
    const set = new Map<string, string>()
    artists.forEach(a => {
      if (a.countryCode || a.countryName) {
        const code = (a.countryCode || a.countryName || '').toUpperCase()
        const label = a.countryName || a.countryCode || ''
        if (!set.has(code)) set.set(code, label)
      }
    })
    return Array.from(set, ([code, label]) => ({ code, label }))
  }, [artists])

  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!dropdownRef.current) return
      if (!dropdownRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('click', onClickOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClickOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  return (
    <section className="py-32 px-4 sm:px-10 bg-backgroundColor">
      <div className="max-w-screen-xl mx-auto">

        {/* ── Controls bar ── */}
        <div className="border-b border-borderColor pb-6 mb-16 flex flex-col sm:flex-row sm:items-end gap-6">

          {/* Left cluster: filter + search */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end flex-1">

            {/* Nationality filter — borderless dropdown trigger */}
            <div ref={dropdownRef} className="relative">
              <button
                type="button"
                onClick={() => setIsOpen(o => !o)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className="inline-flex items-center gap-2 pb-1.5 border-b border-textColor/30 hover:border-textColor text-textColor transition-colors duration-200 montserrat text-[10px] uppercase tracking-[0.25em] focus:outline-none"
              >
                <span className="truncate max-w-[140px] sm:max-w-none">
                  {params.nationality
                    ? nationalities.find(n => n.code === params.nationality.toUpperCase())?.label ?? params.nationality
                    : t('artists.nationality')}
                </span>
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-shrink-0 transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {isOpen && (
                <div
                  role="listbox"
                  className="absolute z-20 top-full mt-2 w-52 bg-cardBackground border border-borderColor shadow-xl py-2"
                >
                  <button
                    role="option"
                    aria-selected={params.nationality === ''}
                    className={`w-full text-left px-4 py-2 montserrat text-[10px] uppercase tracking-[0.2em] transition-colors duration-150 ${
                      params.nationality === ''
                        ? 'text-gold-accent'
                        : 'text-textColor hover:text-gold-accent'
                    }`}
                    onClick={() => { setParams({ nationality: '', page: 1 }); setIsOpen(false) }}
                  >
                    {t('artists.all')}
                  </button>
                  <div className="max-h-56 overflow-y-auto">
                    {nationalities.map(n => (
                      <button
                        key={n.code}
                        role="option"
                        aria-selected={params.nationality.toUpperCase() === n.code}
                        className={`w-full text-left px-4 py-2 montserrat text-[10px] uppercase tracking-[0.2em] transition-colors duration-150 ${
                          params.nationality.toUpperCase() === n.code
                            ? 'text-gold-accent'
                            : 'text-textColor hover:text-gold-accent'
                        }`}
                        onClick={() => { setParams({ nationality: n.code, page: 1 }); setIsOpen(false) }}
                      >
                        {n.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search bar — border-bottom style */}
            <div className="relative flex items-center gap-2 pb-1.5 border-b border-textColor/30 focus-within:border-textColor transition-colors duration-200 flex-1 max-w-xs">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-grayText flex-shrink-0"
              >
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              </svg>
              <input
                value={params.q}
                onChange={e => setParams({ q: e.target.value, page: 1 })}
                placeholder={t('artists.searchPlaceholder')}
                className="bg-transparent outline-none montserrat text-[10px] uppercase tracking-[0.2em] placeholder-grayText text-textColor flex-1 min-w-0"
              />
            </div>
          </div>

          {/* Right: results count */}
          <p className="section-number !mb-0 text-right shrink-0">
            {filtered.length} {t('artists.artistsFound')}
          </p>
        </div>

        {/* ── Artists grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 sm:gap-x-12 gap-y-16 sm:gap-y-20">
          {current.map(a => (
            <ArtistCard
              key={a.slug}
              name={a.name}
              role={a.role}
              countryName={a.countryName}
              imageUrl={a.photo}
              slug={a.slug}
              mediumTags={a.mediumTags}
              showFollowButton={false}
            />
          ))}

          {/* "Vous ?" join card — first page only */}
          {page === 1 && (
            <div className="group cursor-pointer">
              <a
                href={EXTERNAL_URLS.CALENDLY_MEETING}
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="calendly-artists-grid-click"
                className="block"
              >
                {/* Same aspect ratio as artist portraits */}
                <div className="aspect-[3/4] overflow-hidden mb-6 border border-borderColor bg-backgroundGrey flex flex-col items-center justify-center gap-4 transition-colors duration-500 group-hover:border-gold-accent/50">
                  <span className="text-6xl serif italic text-gold-accent font-light leading-none select-none">
                    +
                  </span>
                  <h3 className="text-2xl serif italic font-light text-textColor text-center px-4">
                    {t('artists.joinCard.title')}
                  </h3>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-grayText uppercase tracking-widest bricolage-grotesque">
                    {t('artists.joinCard.description')}
                  </p>
                  <span className="btn-cta !mt-4">
                    {t('artists.joinCard.cta')}
                  </span>
                </div>
              </a>
            </div>
          )}
        </div>

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-8 mt-24">
            <button
              disabled={page === 1}
              onClick={() => setParams({ page: page - 1 })}
              aria-label={t('artists.previous')}
              className="montserrat text-[10px] uppercase tracking-[0.25em] text-textColor border-b border-textColor/30 pb-1 hover:border-textColor transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t('artists.previous')}
            </button>

            <span className="section-number !mb-0">
              {t('artists.page')} {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setParams({ page: page + 1 })}
              aria-label={t('artists.next')}
              className="montserrat text-[10px] uppercase tracking-[0.25em] text-textColor border-b border-textColor/30 pb-1 hover:border-textColor transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t('artists.next')}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
