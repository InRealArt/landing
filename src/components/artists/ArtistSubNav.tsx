'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

interface ArtistSubNavProps {
  hasArtworks?: boolean
  hasExhibitions?: boolean
  hasInterview?: boolean
}

export default function ArtistSubNav({ hasArtworks = false, hasExhibitions = false, hasInterview = false }: ArtistSubNavProps) {
  const { t } = useTranslation()
  const [activeId, setActiveId] = useState<string>('')
  const [topOffset, setTopOffset] = useState<number>(0)
  const [spacerHeight, setSpacerHeight] = useState<number>(0)
  const navRef = useRef<HTMLElement>(null)

  // Items filtrés dynamiquement selon les blocs existants
  const navItems = [
    { id: 'artist-description', labelKey: 'artistPage.subnav.description', always: true },
    { id: 'artist-artworks',    labelKey: 'artistPage.subnav.artworks',    always: hasArtworks },
    { id: 'artist-exhibitions', labelKey: 'artistPage.subnav.exhibitions', always: hasExhibitions },
    { id: 'artist-related-posts', labelKey: 'artistPage.subnav.interview', always: hasInterview },
  ].filter(item => item.always)

  // Calcul dynamique du top = header + hero, et spacer total
  useEffect(() => {
    const hero = document.getElementById('artist-hero')

    const computeTop = () => {
      const headerEl = document.querySelector('header')
      const headerHeight = headerEl?.offsetHeight ?? parseInt(
        getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '90'
      )
      const heroHeight = hero?.offsetHeight ?? 0
      const newTop = headerHeight + heroHeight
      setTopOffset(newTop)
      const navH = navRef.current?.offsetHeight ?? 48
      setSpacerHeight(newTop + navH)
    }

    // ResizeObserver sur le hero : recalcule dès que sa hauteur change (animations GSAP incluses)
    const ro = new ResizeObserver(computeTop)
    if (hero) ro.observe(hero)

    // Premier calcul immédiat + après layout stable
    computeTop()
    const raf = requestAnimationFrame(computeTop)
    window.addEventListener('resize', computeTop)

    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', computeTop)
    }
  }, [])

  const scrollTo = (id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    const navHeight = navRef.current?.offsetHeight ?? 48
    const offset = topOffset + navHeight + 16
    const top = target.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }

  // Observer — section active pendant le scroll
  useEffect(() => {
    const sections = navItems
      .map(item => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    const activeObserver = new IntersectionObserver(
      (entries) => {
        let best: IntersectionObserverEntry | null = null
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (!best || entry.intersectionRatio > best.intersectionRatio) {
              best = entry
            }
          }
        }
        if (best) {
          setActiveId((best.target as HTMLElement).id)
        }
      },
      {
        rootMargin: '-146px 0px -35% 0px',
        threshold: [0, 0.1, 0.25, 0.5],
      }
    )

    sections.forEach(section => activeObserver.observe(section))
    return () => activeObserver.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasArtworks, hasExhibitions, hasInterview])

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Navigation de la page artiste"
        style={{
          position: 'fixed',
          top: topOffset > 0 ? `${topOffset}px` : '220px',
          left: 0,
          right: 0,
          zIndex: 40,
          backgroundColor: 'var(--background)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        {/* Ligne dorée décorative en haut */}
        <div
          className="h-px w-full"
          style={{ backgroundColor: 'var(--gold-accent, #b89c72)', opacity: 0.25 }}
          aria-hidden="true"
        />

        <div className="max-w-screen-2xl mx-auto sm:px-6 lg:px-10">
          <ul
            className="flex items-stretch overflow-x-auto"
            role="list"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
          >
            {navItems.map(({ id, labelKey }, index) => {
              const isActive = activeId === id
              const isLast = index === navItems.length - 1

              return (
                <li key={id} className="flex items-stretch flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => scrollTo(id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={[
                      'relative py-3 sm:py-5 px-4 sm:px-6 lg:px-8',
                      'text-xs sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.4em] font-light bricolage-grotesque',
                      'transition-colors duration-300 cursor-pointer whitespace-nowrap',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset',
                      isActive ? 'text-textColor' : 'text-grayText hover:text-textColor',
                    ].join(' ')}
                    style={
                      isActive
                        ? ({ '--tw-ring-color': 'var(--gold-accent, #b89c72)' } as React.CSSProperties)
                        : undefined
                    }
                  >
                    {t(labelKey)}

                    {/* Indicateur actif — barre dorée en bas du bouton */}
                    <span
                      className={[
                        'absolute bottom-0 left-4 sm:left-6 lg:left-8 right-4 sm:right-6 lg:right-8 h-px',
                        'transition-all duration-300 ease-out',
                        isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0',
                      ].join(' ')}
                      style={{
                        backgroundColor: 'var(--gold-accent, #b89c72)',
                        transformOrigin: 'left center',
                      }}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Séparateur vertical entre items (pas après le dernier) */}
                  {!isLast && (
                    <span
                      className="hidden sm:block self-center w-px h-4 flex-shrink-0"
                      style={{ backgroundColor: 'var(--border-color)' }}
                      aria-hidden="true"
                    />
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {/* Spacer compensant hero fixe + sous-menu fixe */}
      {spacerHeight > 0 && (
        <div aria-hidden="true" style={{ height: `${spacerHeight}px` }} />
      )}
    </>
  )
}
