'use client'

import { useMemo, useEffect, useRef } from 'react';
import ArtworkCard from '@/components/common/cards/ArtworkCardOrder';
import { useLanguageStore } from '@/store/languageStore';
import { useQueryStates, parseAsInteger } from 'nuqs';

const PAGE_SIZE = 9;

interface ArtistArtworksProps {
  artistName: string;
  artworks: Array<{
    id: string;
    name: string;
    price: number | null;
    image: {
      src: string;
    };
    isSold?: boolean;
  }>;
}

export default function ArtistArtworks({ artistName, artworks }: ArtistArtworksProps) {
  const { t } = useLanguageStore();

  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1)
  });

  const totalPages = Math.max(1, Math.ceil(artworks.length / PAGE_SIZE));
  const page = Math.min(params.page, totalPages);
  const start = (page - 1) * PAGE_SIZE;
  const currentArtworks = useMemo(
    () => artworks.slice(start, start + PAGE_SIZE),
    [artworks, start]
  );

  // Construire les numéros de pages à afficher (max 7 pages visibles)
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
  }, [page, totalPages]);

  const sectionRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  // Track which page was last animated to avoid re-animating on language change
  const lastAnimatedPageRef = useRef<number>(-1)

  // — Header : reveal une seule fois à l'entrée en viewport
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    const initHeaderAnimation = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        if (!headerRef.current) return

        const line = headerRef.current.querySelector('.artworks-line')
        const title = headerRef.current.querySelector('.artworks-title')
        const badge = headerRef.current.querySelector('.artworks-badge')
        const gradientLine = headerRef.current.querySelector('.artworks-gradient-line')

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
            once: true,
          },
        })

        if (line) {
          tl.fromTo(
            line,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power3.out', transformOrigin: 'center' }
          )
        }
        if (title) {
          tl.fromTo(
            title,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
            '-=0.3'
          )
        }
        if (badge) {
          tl.fromTo(
            badge,
            { opacity: 0, scale: 0.85 },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
            '-=0.2'
          )
        }
        if (gradientLine) {
          tl.fromTo(
            gradientLine,
            { scaleX: 0, opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.out', transformOrigin: 'center' },
            '-=0.2'
          )
        }
      }, sectionRef)
    }

    initHeaderAnimation()
    return () => ctx?.revert()
  }, [])

  // — Grille : stagger des cartes à chaque changement de page
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

    // Petit délai pour laisser React rendre les nouvelles cartes
    const id = window.setTimeout(() => {
      animateCards()
    }, 30)

    return () => {
      window.clearTimeout(id)
      ctx?.revert()
    }
  }, [page])

  return (
    <div ref={sectionRef} className="mt-20 lg:mt-28">

      {/* En-tête de section — style magazine */}
      <div ref={headerRef} className="mb-10 lg:mb-14">
        {/* Ligne décorative supérieure */}
        <div className="flex items-center gap-4 mb-8">
          <div className="artworks-line h-px flex-1 bg-borderColor origin-center" />
          <div className="w-1.5 h-1.5 rounded-full bg-purpleColor flex-shrink-0" aria-hidden="true" />
          <div className="artworks-line h-px flex-1 bg-borderColor origin-center" />
        </div>

        {/* Titre grand format */}
        <h2 className="artworks-title text-5xl md:text-7xl serif italic leading-tight text-center text-textColor mb-6">
          {t('artistPage.discover')}{' '}
          <span className="whitespace-nowrap text-purpleColor">{artistName}</span>
        </h2>

        {/* Compteur stylisé + ligne décorative inférieure */}
        <div className="flex flex-col items-center gap-4">
          {artworks.length > 0 && (
            <div className="artworks-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-borderColor bg-backgroundGrey">
              <span className="text-purpleColor font-bold text-sm bricolage-grotesque">
                {artworks.length}
              </span>
              <span className="text-grayText text-xs bricolage-grotesque">
                {artworks.length > 1 ? t('artistPage.artwork_plural') : t('artistPage.artwork_singular')}
              </span>
            </div>
          )}
          <div className="artworks-gradient-line h-px w-full max-w-xs bg-gradient-to-r from-transparent via-borderColor to-transparent origin-center" />
        </div>
      </div>

      {/* Grille des oeuvres */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
        {currentArtworks.map((item, index) => (
          <div key={`${item.name}-${index}`} className="artwork-card-item">
            <ArtworkCard {...item} artistName={artistName} />
          </div>
        ))}
      </div>

      {/* Pagination numérotée */}
      {totalPages > 1 && (
        <nav
          className="flex items-center justify-center gap-1 mt-12"
          aria-label={t('artistPage.pagination') || 'Pagination'}
        >
          {/* Bouton Précédent */}
          <button
            disabled={page === 1}
            onClick={() => setParams({ page: page - 1 })}
            aria-label={t('artists.previous') || 'Page précédente'}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-borderColor text-grayText disabled:opacity-30 hover:border-purpleColor/50 hover:text-purpleColor disabled:cursor-not-allowed transition-all duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          {/* Numéros de pages */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((p, idx) =>
              p === '...' ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-9 h-9 flex items-center justify-center text-grayText/50 text-sm select-none"
                  aria-hidden="true"
                >
                  &hellip;
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setParams({ page: p as number })}
                  aria-label={`Page ${p}`}
                  aria-current={p === page ? 'page' : undefined}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold bricolage-grotesque transition-all duration-200 ${
                    p === page
                      ? 'bg-purpleColor text-white shadow-md shadow-purpleColor/25 border border-purpleColor'
                      : 'border border-borderColor text-grayText hover:border-purpleColor/50 hover:text-purpleColor'
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>

          {/* Bouton Suivant */}
          <button
            disabled={page === totalPages}
            onClick={() => setParams({ page: page + 1 })}
            aria-label={t('artists.next') || 'Page suivante'}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-borderColor text-grayText disabled:opacity-30 hover:border-purpleColor/50 hover:text-purpleColor disabled:cursor-not-allowed transition-all duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </nav>
      )}
    </div>
  );
}
