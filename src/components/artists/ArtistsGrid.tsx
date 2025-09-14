'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useArtistStore } from '@/store/useArtistStore'
import { useLanguageStore } from '@/store/languageStore'
import ArtistCard from './ArtistCard'
import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs'
import Button from '@/components/common/Button'
import { Calendar } from 'lucide-react'

const PAGE_SIZE = 16 // 4 colonnes x 4 lignes

export function ArtistsGridSkeleton() {
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

export default function ArtistsGrid() {
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

  if (isLoading) return <ArtistsGridSkeleton />

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10">
      <div className="space-y-4 mb-6">
        {/* Top row: Filter button and results count */}
        <div className="flex items-center justify-between w-full">
          <div ref={dropdownRef} className="relative inline-block">
            <button
              type="button"
              onClick={() => setIsOpen(o => !o)}
              className="inline-flex items-center gap-2 rounded-full bg-cardBackground text-textColor px-4 py-2 shadow-md hover:shadow-lg border border-borderColor transition-all duration-200 bricolage-grotesque font-medium text-sm"
            >
              <span className="truncate max-w-[140px] sm:max-w-none">{t('artists.nationality')}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-200 flex-shrink-0" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute z-20 mt-2 w-48 sm:w-56 rounded-2xl bg-cardBackground p-2 shadow-xl ring-1 ring-borderColor border border-borderColor right-0 sm:right-auto">
                <button
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 bricolage-grotesque font-medium text-sm ${params.nationality === ''
                      ? 'bg-purpleColor/20 text-purpleColor'
                      : 'text-textColor hover:bg-backgroundGrey'
                    }`}
                  onClick={() => { setParams({ nationality: '', page: 1 }); setIsOpen(false) }}
                >{t('artists.all')}</button>
                <div className="max-h-48 sm:max-h-64 overflow-y-auto">
                  {nationalities.map(n => (
                    <button
                      key={n.code}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 bricolage-grotesque font-medium text-sm ${params.nationality.toUpperCase() === n.code
                          ? 'bg-purpleColor/20 text-purpleColor'
                          : 'text-textColor hover:bg-backgroundGrey'
                        }`}
                      onClick={() => { setParams({ nationality: n.code, page: 1 }); setIsOpen(false) }}
                    >{n.label}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="text-grayText text-sm bricolage-grotesque font-medium">
            {filtered.length} {t('artists.artistsFound')}
          </div>
        </div>

        {/* Bottom row: Search bar */}
        <div className="w-full">
          <div className="inline-flex items-center gap-3 rounded-full bg-cardBackground text-textColor px-4 py-2 shadow-md border border-borderColor focus-within:ring-2 focus-within:ring-purpleColor focus-within:border-transparent transition-all duration-200 w-full max-w-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-grayText flex-shrink-0">
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            </svg>
            <input
              value={params.q}
              onChange={e => setParams({ q: e.target.value, page: 1 })}
              placeholder={t('artists.searchPlaceholder')}
              className="bg-transparent outline-none text-sm placeholder-grayText text-textColor bricolage-grotesque font-medium flex-1 min-w-0"
            />
          </div>
        </div>
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

        {/* Carte "Vous ?" - seulement sur la première page */}
        {page === 1 && (
          <div className="rounded-xl overflow-hidden bg-cardBackground border border-white/10 hover:border-purpleColor/30 transition-all duration-300 group">
            <div className="h-52 md:h-64 w-full bg-gradient-to-br from-purpleColor/10 to-purpleColor/5 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="text-6xl md:text-7xl font-bold text-white mb-2 bricolage-grotesque">
                  +
                </div>
                <h3 className="text-3xl md:text-4xl font-bold text-textColor mb-2 bricolage-grotesque">
                  {t('artists.joinCard.title')}
                </h3>
                {/* <div className="w-16 h-16 mx-auto mb-4 bg-purpleColor/20 rounded-full flex items-center justify-center group-hover:bg-purpleColor/30 transition-colors duration-300">
                  <Calendar className="w-8 h-8 text-purpleColor" />
                </div> */}
              </div>
            </div>
            <div className="p-4">
              <Button
                text={t('artists.joinCard.cta')}
                link="https://calendly.com/teaminrealart/plus-de-visibilite-plus-de-ventes"
                target="_blank"
                additionalClassName="bg-purpleColor text-white w-full justify-center hover:bg-purpleColor/90 transition-colors duration-200"
                icon={<Calendar className="w-4 h-4" />}
                iconBefore
              />
            </div>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setParams({ page: page - 1 })}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors duration-200 bricolage-grotesque font-medium"
          >{t('artists.previous')}</button>
          <div className="text-gray-600 dark:text-gray-400 px-4 bricolage-grotesque font-medium">{t('artists.page')} {page} / {totalPages}</div>
          <button
            disabled={page === totalPages}
            onClick={() => setParams({ page: page + 1 })}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600 transition-colors duration-200 bricolage-grotesque font-medium"
          >{t('artists.next')}</button>
        </div>
      )}
    </section>
  )
}


