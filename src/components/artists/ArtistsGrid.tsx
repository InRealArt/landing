'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useArtistStore } from '@/store/useArtistStore'
import { useLanguageStore } from '@/store/languageStore'
import ArtistCard from './ArtistCard'
import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs'

const PAGE_SIZE = 16 // 4 colonnes x 4 lignes

export function ArtistsGridSkeleton () {
  const skeletons = Array.from({ length: PAGE_SIZE })
  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10">
      <div className="flex items-center justify-between mb-6">
        <div className="h-9 w-40 rounded-full bg-backgroundColor/10 animate-pulse" />
        <div className="h-5 w-32 rounded bg-backgroundColor/10 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {skeletons.map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-cardBackground border border-white/10">
            <div className="h-52 md:h-64 w-full bg-backgroundColor/10 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-20 bg-backgroundColor/10 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-backgroundColor/10 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-backgroundColor/10 rounded animate-pulse" />
              <div className="pt-2">
                <div className="h-7 w-24 bg-backgroundColor/10 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function ArtistsGrid () {
  const { artists, isLoading } = useArtistStore()
  const { t } = useLanguageStore()

  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    nationality: parseAsString.withDefault(''),
    q: parseAsString.withDefault('')
  })

  // Les artistes sont chargés par la page parente

  const filtered = useMemo(() => {
    // Filtre nationalité
    const byNation = params.nationality
      ? artists.filter(a => {
          const code = params.nationality.toUpperCase()
          return (
            (a.countryCode || '').toUpperCase() === code ||
            (a.countryName || '').toLowerCase() === params.nationality.toLowerCase()
          )
        })
      : artists

    // Filtre par nom (insensible à la casse)
    const query = params.q.trim().toLowerCase()
    const byName = query
      ? byNation.filter(a => a.name.toLowerCase().includes(query))
      : byNation

    return byName
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

  // Dropdown état & gestion clic extérieur
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside (e: MouseEvent) {
      if (!dropdownRef.current) return
      if (!dropdownRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    function onKey (e: KeyboardEvent) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('click', onClickOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onClickOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  if (isLoading) return <ArtistsGridSkeleton />

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div ref={dropdownRef} className="relative inline-block">
          <button
            type="button"
            onClick={() => setIsOpen(o => !o)}
            className="inline-flex items-center gap-2 rounded-full bg-backgroundColor text-textColor px-5 py-2 shadow-sm hover:shadow transition"
          >
            <span>{t('artists.nationality')}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute z-20 mt-2 w-56 rounded-2xl bg-backgroundColor p-2 shadow-lg ring-1 ring-black/5">
              <button
                className={`w-full text-left px-3 py-2 rounded-lg ${params.nationality === '' ? 'bg-backgroundColor/5' : 'hover:bg-backgroundColor/5'} text-textColor`}
                onClick={() => { setParams({ nationality: '', page: 1 }); setIsOpen(false) }}
              >{t('artists.all')}</button>
              <div className="max-h-64 overflow-y-auto">
                {nationalities.map(n => (
                  <button
                    key={n.code}
                    className={`w-full text-left px-3 py-2 rounded-lg text-textColor ${params.nationality.toUpperCase() === n.code ? 'bg-backgroundColor/5' : 'hover:bg-backgroundColor/5'}`}
                    onClick={() => { setParams({ nationality: n.code, page: 1 }); setIsOpen(false) }}
                  >{n.label}</button>
                ))}
              </div>
            </div>
          )}
          </div>

          <span className="text-textColor/40 select-none">|</span>

          <div className="inline-flex items-center gap-2 rounded-full bg-backgroundColor text-textColor px-4 py-1.5 shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <input
              value={params.q}
              onChange={e => setParams({ q: e.target.value, page: 1 })}
              placeholder={t('artists.searchPlaceholder')}
              className="bg-transparent outline-none text-sm min-w-[220px] placeholder-black/40"
            />
          </div>
        </div>
        <div className="text-textColor/60 text-sm">{filtered.length} {t('artists.artistsFound')}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setParams({ page: page - 1 })}
            className="px-3 py-2 rounded-md bg-backgroundColor/10 text-textColor disabled:opacity-40"
          >{t('artists.previous')}</button>
          <div className="text-textColor/80">{t('artists.page')} {page} / {totalPages}</div>
          <button
            disabled={page === totalPages}
            onClick={() => setParams({ page: page + 1 })}
            className="px-3 py-2 rounded-md bg-backgroundColor/10 text-textColor disabled:opacity-40"
          >{t('artists.next')}</button>
        </div>
      )}
    </section>
  )
}


