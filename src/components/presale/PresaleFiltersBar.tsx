'use client'

import { useRef, useState, useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

export type SortValue = 'recent' | 'price_asc' | 'price_desc' | 'artist_az'
export type StatusValue = 'all' | 'available' | 'sold'
export type FormatValue = 'all' | 'small' | 'medium' | 'large'

export interface FiltersState {
  artist: string
  q: string
  sort: SortValue
  status: StatusValue
  format: FormatValue
  priceMin: number
  priceMax: number
}

interface PresaleFiltersBarProps {
  filters: FiltersState
  artists: string[]
  priceRange: { min: number; max: number }
  filteredCount: number
  onChange: (patch: Partial<FiltersState>) => void
}

// Underline button used for dropdown triggers
function FilterButton({
  active,
  open,
  onClick,
  children,
}: {
  active: boolean
  open: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      className={`flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] pb-1 border-b transition-colors duration-300 ${
        active
          ? 'text-[#b89c72] border-[#b89c72]'
          : 'text-textColor border-textColor hover:text-[#b89c72] hover:border-[#b89c72]'
      }`}
    >
      {children}
      <svg
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        className="flex-shrink-0 transition-transform duration-200"
        style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

// Generic dropdown panel
function DropdownPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute z-20 top-full mt-2 left-0 bg-backgroundColor border border-borderColor shadow-md">
      {children}
    </div>
  )
}

function DropdownItem({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      className={`w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-colors duration-200 border-t border-borderColor/40 first:border-t-0 ${
        active ? 'text-[#b89c72]' : 'text-textColor hover:text-[#b89c72]'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default function PresaleFiltersBar({
  filters,
  artists,
  priceRange,
  filteredCount,
  onChange,
}: PresaleFiltersBarProps) {
  const { t } = useTranslation()

  const [openDropdown, setOpenDropdown] = useState<'artist' | 'sort' | 'status' | 'format' | 'price' | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close on outside click / Escape
  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpenDropdown(null)
    }
    document.addEventListener('click', onOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('click', onOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const toggle = (name: typeof openDropdown) =>
    setOpenDropdown(prev => (prev === name ? null : name))

  const close = () => setOpenDropdown(null)

  const sortOptions: { value: SortValue; label: string }[] = [
    { value: 'recent',     label: t('presale.filters.sortRecent') },
    { value: 'price_asc',  label: t('presale.filters.sortPriceAsc') },
    { value: 'price_desc', label: t('presale.filters.sortPriceDesc') },
    { value: 'artist_az',  label: t('presale.filters.sortArtistAz') },
  ]

  const statusOptions: { value: StatusValue; label: string }[] = [
    { value: 'all',       label: t('presale.filters.statusAll') },
    { value: 'available', label: t('presale.filters.statusAvailable') },
    { value: 'sold',      label: t('presale.filters.statusSold') },
  ]

  const formatOptions: { value: FormatValue; label: string }[] = [
    { value: 'all',    label: t('presale.filters.formatAll') },
    { value: 'small',  label: t('presale.filters.formatSmall') },
    { value: 'medium', label: t('presale.filters.formatMedium') },
    { value: 'large',  label: t('presale.filters.formatLarge') },
  ]

  const hasActiveFilters =
    filters.artist !== '' ||
    filters.q !== '' ||
    filters.sort !== 'recent' ||
    filters.status !== 'all' ||
    filters.format !== 'all' ||
    filters.priceMin !== priceRange.min ||
    filters.priceMax !== priceRange.max

  const resetAll = () => {
    onChange({
      artist: '',
      q: '',
      sort: 'recent',
      status: 'all',
      format: 'all',
      priceMin: priceRange.min,
      priceMax: priceRange.max,
    })
  }

  const isPriceActive = filters.priceMin !== priceRange.min || filters.priceMax !== priceRange.max

  return (
    <div ref={containerRef} className="border-t border-borderColor pt-8 mb-12">
      {/* ── Row 1: filters ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-end gap-x-8 gap-y-4">

        {/* Search */}
        <div className="flex items-center gap-2 border-b border-borderColor pb-1 focus-within:border-[#b89c72] transition-colors duration-300 w-56">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-textColor/40 flex-shrink-0" aria-hidden="true">
            <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          </svg>
          <input
            value={filters.q}
            onChange={e => onChange({ q: e.target.value })}
            placeholder={t('presale.filters.searchPlaceholder')}
            className="bg-transparent outline-none text-[10px] uppercase tracking-[0.2em] placeholder-textColor/30 text-textColor flex-1 min-w-0 py-0"
          />
        </div>

        {/* Artist */}
        <div className="relative">
          <FilterButton active={!!filters.artist} open={openDropdown === 'artist'} onClick={() => toggle('artist')}>
            <span className="truncate max-w-[140px]">{filters.artist || t('presale.filters.allArtists')}</span>
          </FilterButton>
          {openDropdown === 'artist' && (
            <DropdownPanel>
              <DropdownItem active={filters.artist === ''} onClick={() => { onChange({ artist: '' }); close() }}>
                {t('presale.filters.allArtists')}
              </DropdownItem>
              <div className="max-h-56 overflow-y-auto">
                {artists.map(a => (
                  <DropdownItem key={a} active={filters.artist === a} onClick={() => { onChange({ artist: a }); close() }}>
                    {a}
                  </DropdownItem>
                ))}
              </div>
            </DropdownPanel>
          )}
        </div>

        {/* Status */}
        <div className="relative">
          <FilterButton active={filters.status !== 'all'} open={openDropdown === 'status'} onClick={() => toggle('status')}>
            {statusOptions.find(o => o.value === filters.status)?.label}
          </FilterButton>
          {openDropdown === 'status' && (
            <DropdownPanel>
              {statusOptions.map(opt => (
                <DropdownItem key={opt.value} active={filters.status === opt.value} onClick={() => { onChange({ status: opt.value }); close() }}>
                  {opt.label}
                </DropdownItem>
              ))}
            </DropdownPanel>
          )}
        </div>

        {/* Format */}
        <div className="relative">
          <FilterButton active={filters.format !== 'all'} open={openDropdown === 'format'} onClick={() => toggle('format')}>
            {formatOptions.find(o => o.value === filters.format)?.label}
          </FilterButton>
          {openDropdown === 'format' && (
            <DropdownPanel>
              {formatOptions.map(opt => (
                <DropdownItem key={opt.value} active={filters.format === opt.value} onClick={() => { onChange({ format: opt.value }); close() }}>
                  {opt.label}
                </DropdownItem>
              ))}
            </DropdownPanel>
          )}
        </div>

        {/* Price range */}
        {priceRange.max > 0 && (
          <div className="relative">
            <FilterButton active={isPriceActive} open={openDropdown === 'price'} onClick={() => toggle('price')}>
              {isPriceActive
                ? `${filters.priceMin.toLocaleString('fr-FR')}€ – ${filters.priceMax.toLocaleString('fr-FR')}€`
                : t('presale.filters.priceLabel')}
            </FilterButton>
            {openDropdown === 'price' && (
              <div className="absolute z-20 top-full mt-2 left-0 bg-backgroundColor border border-borderColor shadow-md p-5 w-64">
                <p className="text-[10px] uppercase tracking-[0.2em] text-textColor/60 mb-4">
                  {filters.priceMin.toLocaleString('fr-FR')}€ – {filters.priceMax.toLocaleString('fr-FR')}€
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.2em] text-textColor/50 block mb-1">
                      {t('presale.filters.priceMin')}
                    </label>
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={filters.priceMin}
                      onChange={e => {
                        const v = Number(e.target.value)
                        onChange({ priceMin: Math.min(v, filters.priceMax) })
                      }}
                      className="w-full accent-[#b89c72]"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.2em] text-textColor/50 block mb-1">
                      {t('presale.filters.priceMax')}
                    </label>
                    <input
                      type="range"
                      min={priceRange.min}
                      max={priceRange.max}
                      value={filters.priceMax}
                      onChange={e => {
                        const v = Number(e.target.value)
                        onChange({ priceMax: Math.max(v, filters.priceMin) })
                      }}
                      className="w-full accent-[#b89c72]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Sort */}
        <div className="relative ml-auto">
          <FilterButton active={filters.sort !== 'recent'} open={openDropdown === 'sort'} onClick={() => toggle('sort')}>
            {sortOptions.find(o => o.value === filters.sort)?.label}
          </FilterButton>
          {openDropdown === 'sort' && (
            <DropdownPanel>
              {sortOptions.map(opt => (
                <DropdownItem key={opt.value} active={filters.sort === opt.value} onClick={() => { onChange({ sort: opt.value }); close() }}>
                  {opt.label}
                </DropdownItem>
              ))}
            </DropdownPanel>
          )}
        </div>
      </div>

      {/* ── Row 2: count + reset ─────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-6">
        <p className="section-number !mb-0">
          {filteredCount}&nbsp;
          {filteredCount > 1 ? t('presale.filters.artworksFound') : t('presale.filters.artworkFound')}
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetAll}
            className="text-[10px] uppercase tracking-[0.25em] text-textColor/50 border-b border-textColor/30 pb-0.5 hover:text-[#b89c72] hover:border-[#b89c72] transition-colors duration-300"
          >
            {t('presale.filters.reset')}
          </button>
        )}
      </div>
    </div>
  )
}
