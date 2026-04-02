'use client'

import { useMemo, useEffect, useRef, useState } from 'react'
import ArtworkCard from '@/components/common/cards/ArtworkCardOrder'
import { useTranslation } from '@/hooks/useTranslation'
import { useQueryStates, parseAsInteger } from 'nuqs'

const PAGE_SIZE = 9

interface ArtistArtworksProps {
  artistName: string
  artworks: Array<{
    id: string
    name: string
    price: number | null
    image: {
      src: string
    }
    isSold?: boolean
  }>
}

export default function ArtistArtworks({ artistName, artworks }: ArtistArtworksProps) {
  const { t } = useTranslation()

  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
  })

  // Filter state — "all" by default; extend with real medium filters if data becomes available
  const [activeFilter, setActiveFilter] = useState<'all' | 'available' | 'sold'>('all')

  const filteredArtworks = useMemo(() => {
    if (activeFilter === 'available') return artworks.filter(a => !a.isSold)
    if (activeFilter === 'sold') return artworks.filter(a => a.isSold)
    return artworks
  }, [artworks, activeFilter])

  const totalPages = Math.max(1, Math.ceil(filteredArtworks.length / PAGE_SIZE))
  const page = Math.min(params.page, totalPages)
  const start = (page - 1) * PAGE_SIZE
  const currentArtworks = useMemo(
    () => filteredArtworks.slice(start, start + PAGE_SIZE),
    [filteredArtworks, start]
  )

  // Pagination number calculation (max 7 visible)
  const pageNumbers = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }
    const delta = 2
    const left = page - delta
    const right = page + delta
    const pages: (number | '...')[] = []

    if (left > 2) {
      pages.push(1, '...')
    } else {
      for (let i = 1; i < left; i++) pages.push(i)
    }
    for (let i = Math.max(1, left); i <= Math.min(totalPages, right); i++) {
      pages.push(i)
    }
    if (right < totalPages - 1) {
      pages.push('...', totalPages)
    } else {
      for (let i = right + 1; i <= totalPages; i++) pages.push(i)
    }
    return pages
  }, [page, totalPages])

  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const lastAnimatedPageRef = useRef<number>(-1)

  // Header reveal — once on scroll into view
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    const initHeaderAnimation = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        if (!headerRef.current) return

        const children = headerRef.current.querySelectorAll(':scope > *')
        gsap.fromTo(
          children,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        )
      }, sectionRef)
    }

    initHeaderAnimation()
    return () => ctx?.revert()
  }, [])

  // Grid cards — stagger on each page change
  useEffect(() => {
    if (lastAnimatedPageRef.current === page) return
    lastAnimatedPageRef.current = page

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    const animateCards = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        if (!gridRef.current) return
        const cards = gridRef.current.querySelectorAll('.artwork-card-item')
        if (cards.length === 0) return

        gsap.fromTo(
          cards,
          { opacity: 0, y: 36, scale: 0.97 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.65,
            ease: 'power3.out',
            stagger: 0.07,
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 88%',
              once: true,
            },
          }
        )
      }, gridRef)
    }

    const id = window.setTimeout(() => {
      animateCards()
    }, 30)

    return () => {
      window.clearTimeout(id)
      ctx?.revert()
    }
  }, [page])

  const scrollToSection = () => {
    const section = document.getElementById('artist-artworks')
    if (!section) return
    const headerEl = document.querySelector('header')
    const headerHeight = headerEl?.offsetHeight ?? 90
    const top = section.getBoundingClientRect().top + window.scrollY - headerHeight - 16
    window.scrollTo({ top, behavior: 'smooth' })
  }

  const filters = [
    { key: 'all' as const, label: t('artists.all') || 'Toutes' },
    { key: 'available' as const, label: t('artists.profile.available') || 'Disponibles' },
    { key: 'sold' as const, label: t('artists.profile.sold') || 'Vendues' },
  ]

  return (
    <div
      ref={sectionRef}
      id="artist-artworks"
      className="py-20 lg:py-32 border-t border-b"
      style={{ backgroundColor: 'var(--background-grey)', borderColor: 'var(--border-color)' }}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">

        {/* Section header */}
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row justify-between items-end mb-16 lg:mb-24 gap-8"
        >
          <div>
            <span className="block text-[10px] uppercase tracking-[0.5em] text-grayText font-montserrat mb-4">
              {t('artistPage.artworksLabel')}
            </span>
            <h2 className="text-5xl lg:text-6xl font-cormorant font-light italic text-textColor leading-tight">
              {t('artistPage.artworksTitle')}
            </h2>
            {artworks.length > 0 && (
              <p className="mt-3 text-[11px] uppercase tracking-widest text-grayText font-montserrat">
                {artworks.length}{' '}
                {artworks.length > 1
                  ? t('artistPage.artwork_plural')
                  : t('artistPage.artwork_singular')}
                {' '}— {artistName}
              </p>
            )}
          </div>

          {/* Filter buttons */}
          <div className="flex gap-3 flex-wrap">
            {filters.map(filter => (
              <button
                key={filter.key}
                onClick={() => {
                  setActiveFilter(filter.key)
                  setParams({ page: 1 })
                }}
                className="px-5 py-2.5 text-[9px] uppercase tracking-widest font-montserrat border transition-colors duration-300"
                style={
                  activeFilter === filter.key
                    ? { borderColor: 'var(--text)', backgroundColor: 'var(--text)', color: 'var(--background)' }
                    : { borderColor: 'var(--border-color)', backgroundColor: 'var(--background)', color: 'var(--text)' }
                }
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Artworks grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 lg:gap-x-12 lg:gap-y-24"
        >
          {currentArtworks.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="artwork-card-item group cursor-pointer"
            >
              <ArtworkCard {...item} artistName={artistName} />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            className="flex items-center justify-center gap-1 mt-16"
            aria-label={t('artistPage.pagination') || 'Pagination'}
          >
            {/* Previous */}
            <button
              disabled={page === 1}
              onClick={() => { setParams({ page: page - 1 }); scrollToSection() }}
              aria-label={t('pagination.previous') || 'Page précédente'}
              className="flex items-center justify-center w-9 h-9 border text-grayText disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 hover:border-textColor hover:text-textColor"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {pageNumbers.map((p, idx) =>
                p === '...' ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="w-9 h-9 flex items-center justify-center text-grayText text-sm select-none font-montserrat"
                    aria-hidden="true"
                  >
                    &hellip;
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => { setParams({ page: p as number }); scrollToSection() }}
                    aria-label={`Page ${p}`}
                    aria-current={p === page ? 'page' : undefined}
                    className="w-9 h-9 flex items-center justify-center text-sm font-montserrat border transition-colors duration-200"
                    style={
                      p === page
                        ? { backgroundColor: 'var(--text)', color: 'var(--background)', borderColor: 'var(--text)' }
                        : { backgroundColor: 'transparent', color: 'var(--gray-text)', borderColor: 'var(--border-color)' }
                    }
                  >
                    {p}
                  </button>
                )
              )}
            </div>

            {/* Next */}
            <button
              disabled={page === totalPages}
              onClick={() => { setParams({ page: page + 1 }); scrollToSection() }}
              aria-label={t('pagination.next') || 'Page suivante'}
              className="flex items-center justify-center w-9 h-9 border text-grayText disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-200 hover:border-textColor hover:text-textColor"
              style={{ borderColor: 'var(--border-color)' }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </nav>
        )}

      </div>
    </div>
  )
}
