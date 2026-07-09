'use client'
import React, { useMemo, useTransition, useState } from 'react'
import PresaleHero from "@/components/presale/PresaleHero";
import ArtworkCard from "@/components/common/cards/ArtworkCardOrder";
import PresaleFiltersBar, { FiltersState, FormatValue, SortValue, StatusValue } from '@/components/presale/PresaleFiltersBar';
import { useTranslation } from '@/hooks/useTranslation';
import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs'
import { Download } from "lucide-react";
import { useLazyRecaptcha } from '@/hooks/useLazyRecaptcha'
import { toast } from 'sonner'
import { downloadCatalog } from '@/actions/catalogActions'
import CatalogSuccessModal from '@/components/common/SuccessModal'
import LeasingCTA from '@/components/presale/LeasingCTA'
import { PresaleArtworkData } from '@/actions/presaleArtworkActions';

const PAGE_SIZE = 12

export default function PresaleClient({ children, initialArtworks }: { children?: React.ReactNode, initialArtworks: PresaleArtworkData[] }) {
  const { t, language } = useTranslation();

  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { executeRecaptcha } = useLazyRecaptcha({ preloadOnInteraction: true, interactionTarget: 'form' })

  // All filter + sort state via nuqs (URL-persistent)
  const [params, setParams] = useQueryStates({
    page:     parseAsInteger.withDefault(1),
    artist:   parseAsString.withDefault(''),
    q:        parseAsString.withDefault(''),
    sort:     parseAsString.withDefault('recent'),
    status:   parseAsString.withDefault('all'),
    format:   parseAsString.withDefault('all'),
    priceMin: parseAsInteger.withDefault(-1),
    priceMax: parseAsInteger.withDefault(-1),
  })

  // Price range derived from data
  const priceRange = useMemo(() => {
    const prices = initialArtworks.map(a => a.price).filter((p): p is number => p !== null)
    if (prices.length === 0) return { min: 0, max: 0 }
    return { min: Math.min(...prices), max: Math.max(...prices) }
  }, [initialArtworks])

  // Resolve sentinel -1 to actual bounds
  const resolvedPriceMin = params.priceMin === -1 ? priceRange.min : params.priceMin
  const resolvedPriceMax = params.priceMax === -1 ? priceRange.max : params.priceMax

  const filters: FiltersState = {
    artist:   params.artist,
    q:        params.q,
    sort:     params.sort as SortValue,
    status:   params.status as StatusValue,
    format:   params.format as FormatValue,
    priceMin: resolvedPriceMin,
    priceMax: resolvedPriceMax,
  }

  const handleFilterChange = (patch: Partial<FiltersState>) => {
    const update: Record<string, string | number> = { page: 1 }
    if (patch.artist   !== undefined) update.artist   = patch.artist
    if (patch.q        !== undefined) update.q        = patch.q
    if (patch.sort     !== undefined) update.sort     = patch.sort
    if (patch.status   !== undefined) update.status   = patch.status
    if (patch.format   !== undefined) update.format   = patch.format
    if (patch.priceMin !== undefined) update.priceMin = patch.priceMin
    if (patch.priceMax !== undefined) update.priceMax = patch.priceMax
    setParams(update as Parameters<typeof setParams>[0])
  }

  // Unique sorted artist list
  const artists = useMemo(() => {
    const unique = Array.from(new Set(initialArtworks.map(a => `${a.artist.name} ${a.artist.surname}`)))
    return unique.sort()
  }, [initialArtworks])

  // Filter + sort
  const filtered = useMemo(() => {
    let result = initialArtworks

    // Artist
    if (params.artist) {
      result = result.filter(a =>
        `${a.artist.name} ${a.artist.surname}`.toLowerCase().includes(params.artist.toLowerCase())
      )
    }

    // Search
    const q = params.q.trim().toLowerCase()
    if (q) {
      result = result.filter(a =>
        a.name.toLowerCase().includes(q) ||
        `${a.artist.name} ${a.artist.surname}`.toLowerCase().includes(q)
      )
    }

    // Status
    if (params.status === 'available') result = result.filter(a => !a.isSold)
    else if (params.status === 'sold')  result = result.filter(a =>  a.isSold)

    // Format (based on max dimension)
    if (params.format !== 'all') {
      result = result.filter(a => {
        const dim = Math.max(a.width ?? 0, a.height ?? 0)
        if (params.format === 'small')  return dim > 0 && dim < 50
        if (params.format === 'medium') return dim >= 50 && dim <= 100
        if (params.format === 'large')  return dim > 100
        return true
      })
    }

    // Price range
    if (priceRange.max > 0) {
      const pMin = resolvedPriceMin
      const pMax = resolvedPriceMax
      if (pMin !== priceRange.min || pMax !== priceRange.max) {
        result = result.filter(a => {
          if (a.price === null) return true // no price → always show
          return a.price >= pMin && a.price <= pMax
        })
      }
    }

    // Sort
    const sorted = [...result]
    if (params.sort === 'price_asc')  sorted.sort((a, b) => (a.price ?? Infinity)  - (b.price ?? Infinity))
    if (params.sort === 'price_desc') sorted.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity))
    if (params.sort === 'artist_az')  sorted.sort((a, b) =>
      `${a.artist.name} ${a.artist.surname}`.toLowerCase()
        .localeCompare(`${b.artist.name} ${b.artist.surname}`.toLowerCase())
    )

    return sorted
  }, [initialArtworks, params.artist, params.q, params.status, params.format, params.sort, resolvedPriceMin, resolvedPriceMax, priceRange])

  // Pagination
  const { paginatedArtworks, totalPages, page, startIndex } = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const page = Math.min(params.page, totalPages)
    const start = (page - 1) * PAGE_SIZE
    return { paginatedArtworks: filtered.slice(start, start + PAGE_SIZE), totalPages, page, startIndex: start }
  }, [filtered, params.page])

  const scrollToGrid = () => {
    const grid = document.querySelector('#presale-grid') as HTMLElement | null
    if (!grid) return
    const headerEl = document.querySelector('header')
    const headerHeight = headerEl?.offsetHeight ?? 90
    window.scrollTo({ top: grid.getBoundingClientRect().top + window.scrollY - headerHeight - 16, behavior: 'smooth' })
  }

  const handleCatalogDownload = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const recaptchaToken = await executeRecaptcha('catalog_download')
        if (!recaptchaToken) { toast.error('reCAPTCHA non disponible. Veuillez réessayer.'); return }
        formData.append('recaptchaToken', recaptchaToken)
        const result = await downloadCatalog(formData)
        if (result.success) { setEmail(''); setShowSuccessModal(true) }
        else toast.error(result.message)
      } catch (error) {
        console.error('Erreur lors du téléchargement du catalogue:', error)
        toast.error("Une erreur inattendue s'est produite.")
      }
    })
  }

  const artworkImages = paginatedArtworks.map(artwork => ({
    image: { src: artwork.imageUrl },
    name: artwork.name,
    price: artwork.price,
    order: artwork.order,
    artistName: `${artwork.artist.name} ${artwork.artist.surname}`,
    artistSlug: artwork.artist.slug ?? null,
    isSold: artwork.isSold || false
  }))

  return (
    <>
      <PresaleHero totalCount={initialArtworks.length} />

      <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-10">

        <PresaleFiltersBar
          filters={filters}
          artists={artists}
          priceRange={priceRange}
          filteredCount={filtered.length}
          onChange={handleFilterChange}
        />

        {/* ── Artwork grid ─────────────────────────────────────────────── */}
        <div id="presale-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {artworkImages.map((item, index) => (
            <ArtworkCard key={`${item.name}-${startIndex + index}`} {...item} />
          ))}
        </div>

        {/* ── Pagination ───────────────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-8 mt-24">
            <button
              disabled={page === 1}
              onClick={() => { setParams({ page: page - 1 }); scrollToGrid() }}
              className="text-xs uppercase tracking-[0.25em] text-textColor border-b border-transparent hover:border-textColor pb-0.5 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t('pagination.previous')}
            </button>
            <span className="section-number !mb-0">{page}&nbsp;/&nbsp;{totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => { setParams({ page: page + 1 }); scrollToGrid() }}
              className="text-xs uppercase tracking-[0.25em] text-textColor border-b border-transparent hover:border-textColor pb-0.5 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {t('pagination.next')}
            </button>
          </div>
        )}

        <LeasingCTA />

        {/* ── Catalog download form ────────────────────────────────────── */}
        <div className="mt-32 mb-16 max-w-xl mx-auto border-t border-borderColor pt-16">
          <span className="section-number">{t('presale.onDemand')}</span>
          <h2 className="serif font-light text-3xl italic text-textColor mb-4">
            {t('presale.intro.buttons.catalog')}
          </h2>
          <p className="text-xs uppercase tracking-[0.3em] text-textColor/50 mb-10 leading-relaxed">
            {language === 'en'
              ? 'Enter your email to download our catalog'
              : 'Entrez votre email pour télécharger notre catalogue'}
          </p>
          <form action={handleCatalogDownload} className="space-y-8">
            <input type="hidden" name="language" value={language} />
            <div className="flex items-center gap-3 border-b-2 border-borderColor focus-within:border-[#b89c72] transition-colors duration-300 pb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-textColor/30 flex-shrink-0" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M2 8l10 6 10-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input
                type="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t('presale.intro.form.emailPlaceholder')}
                disabled={isPending}
                className="flex-1 bg-transparent outline-none text-sm text-textColor placeholder-textColor/30 py-1"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="btn-cta !flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="text-[0.6rem] uppercase tracking-[0.25em]">
                {isPending ? t('presale.intro.form.downloadingButton') : t('presale.intro.form.downloadButton')}
              </span>
              <Download size={14} />
            </button>
          </form>
        </div>

      </div>

      {children}

      <CatalogSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={t('presale.intro.successPopup.title')}
        subtitle={t('presale.intro.successPopup.subtitle')}
        message={t('presale.intro.successPopup.message')}
        closeButtonText={t('presale.intro.successPopup.closeButton')}
      />
    </>
  );
}
