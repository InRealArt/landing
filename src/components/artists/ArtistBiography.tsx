'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import { formatTextWithLineBreaksJSX } from '@/utils/functions'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

interface ArtistBiographyProps {
  artist: {
    id: number
    name: string
    biographyHeader1?: string | null
    biographyText1?: string | null
    biographyHeader2?: string | null
    biographyText2?: string | null
    biographyHeader3?: string | null
    biographyText3?: string | null
    biographyHeader4?: string | null
    biographyText4?: string | null
    imageArtistStudio?: string | null
  }
}

interface BiographySectionProps {
  index: number
  header: string
  text: string
  isExpanded: boolean
  onToggle: () => void
  maxLength?: number
  t: (key: string) => string
}

function BiographySection({ index, header, text, isExpanded, onToggle, maxLength = 300, t }: BiographySectionProps) {
  const shouldTruncate = text.length > maxLength
  const displayText = shouldTruncate && !isExpanded ? text.substring(0, maxLength) + '...' : text

  // Numéro de section formaté : 01, 02, 03, 04
  const sectionNumber = String(index).padStart(2, '0')

  return (
    <div className="bio-section group relative">
      {/* Header de section avec numérotation estompée */}
      <div className="relative mb-6">
        {/* Ligne décorative + titre + numéro décoratif aligné à droite */}
        <div className="flex items-start gap-4">
          {/* Barre verticale accentuée */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1 mt-1">
            <div className="w-0.5 h-5 bg-purpleColor rounded-full" />
            <div className="w-0.5 h-2 bg-purpleColor/30 rounded-full" />
          </div>

          <h3 className="flex-1 text-lg lg:text-xl font-bold text-textColor bricolage-grotesque leading-snug">
            {header}
          </h3>

          {/* Numéro estompé à droite — purement décoratif, ne chevauche rien */}
          <span
            className="flex-shrink-0 text-5xl lg:text-6xl font-bold unbounded text-textColor/5 leading-none select-none pointer-events-none"
            aria-hidden="true"
          >
            {sectionNumber}
          </span>
        </div>

        {/* Ligne décorative sous le titre */}
        <div className="mt-4 flex items-center gap-2">
          <div className="h-px w-6 bg-purpleColor/50" />
          <div className="h-px flex-1 bg-borderColor" />
        </div>
      </div>

      {/* Contenu du texte */}
      <div className="relative pl-4 border-l border-borderColor/50">
        <div className="text-grayText text-sm lg:text-[0.9rem] leading-relaxed lg:leading-loose bricolage-grotesque">
          {formatTextWithLineBreaksJSX(displayText)}
        </div>

        {/* Bouton "Voir plus/moins" */}
        {shouldTruncate && (
          <div className="mt-5">
            <button
              onClick={onToggle}
              className="inline-flex items-center gap-2 text-xs font-semibold text-purpleColor bricolage-grotesque tracking-wide uppercase hover:gap-3 transition-all duration-200 group/btn"
              aria-expanded={isExpanded}
            >
              {isExpanded ? (
                <>
                  <span>{t('biography.showLess')}</span>
                  <ChevronUpIcon
                    className="w-3.5 h-3.5 transition-transform duration-300"
                    aria-hidden="true"
                  />
                </>
              ) : (
                <>
                  <span>{t('biography.showMore')}</span>
                  <ChevronDownIcon
                    className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-y-0.5"
                    aria-hidden="true"
                  />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ArtistBiography({ artist }: ArtistBiographyProps) {
  const { t } = useLanguageStore()
  const [randomImage, setRandomImage] = useState<string>('')
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({})

  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const stickyImageRef = useRef<HTMLDivElement>(null)
  const bioColLeftRef = useRef<HTMLDivElement>(null)
  const bioColRightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (artist.imageArtistStudio) {
      setRandomImage(artist.imageArtistStudio)
    } else {
      const imageNumber = Math.floor(Math.random() * 5) + 1
      setRandomImage(`/images/artistBiography/artist_biography_${imageNumber}.webp`)
    }
  }, [artist.imageArtistStudio])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    const initAnimations = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {

        // — En-tête de section : titre + underline + ligne décorative
        if (headerRef.current) {
          const title = headerRef.current.querySelector('h2')
          const underline = headerRef.current.querySelector('.bio-underline')
          const separator = headerRef.current.querySelector('.bio-separator')

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: headerRef.current,
              start: 'top 85%',
              once: true,
            },
          })

          if (title) {
            tl.fromTo(
              title,
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }
            )
          }
          if (underline) {
            tl.fromTo(
              underline,
              { scaleX: 0, opacity: 0 },
              { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power3.out', transformOrigin: 'left' },
              '-=0.3'
            )
          }
          if (separator) {
            tl.fromTo(
              separator,
              { scaleX: 0, opacity: 0 },
              { scaleX: 1, opacity: 1, duration: 0.6, ease: 'power3.out', transformOrigin: 'left' },
              '-=0.4'
            )
          }
        }

        // — Image sticky : slide-in depuis la gauche + légère rotation initiale
        if (stickyImageRef.current) {
          gsap.fromTo(
            stickyImageRef.current,
            { opacity: 0, x: -32, rotate: -1 },
            {
              opacity: 1,
              x: 0,
              rotate: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: stickyImageRef.current,
                start: 'top 80%',
                once: true,
              },
            }
          )
        }

        // — Colonne gauche de biographie : sections en stagger
        if (bioColLeftRef.current) {
          const sections = bioColLeftRef.current.querySelectorAll('.bio-section')
          if (sections.length > 0) {
            gsap.fromTo(
              sections,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.18,
                scrollTrigger: {
                  trigger: bioColLeftRef.current,
                  start: 'top 82%',
                  once: true,
                },
              }
            )
          }
        }

        // — Colonne droite de biographie : sections en stagger (léger décalage par rapport à la gauche)
        if (bioColRightRef.current) {
          const sections = bioColRightRef.current.querySelectorAll('.bio-section')
          if (sections.length > 0) {
            gsap.fromTo(
              sections,
              { opacity: 0, y: 40 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.18,
                delay: 0.1,
                scrollTrigger: {
                  trigger: bioColRightRef.current,
                  start: 'top 82%',
                  once: true,
                },
              }
            )
          }
        }

      }, sectionRef)
    }

    initAnimations()
    return () => ctx?.revert()
  }, [])

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  const hasContent = artist.biographyHeader1 || artist.biographyText1 ||
    artist.biographyHeader2 || artist.biographyText2 ||
    artist.biographyHeader3 || artist.biographyText3 ||
    artist.biographyHeader4 || artist.biographyText4

  if (!hasContent) {
    return null
  }

  const getSectionContent = (sectionNumber: number) => {
    const headerKey = `biographyHeader${sectionNumber}` as keyof typeof artist
    const textKey = `biographyText${sectionNumber}` as keyof typeof artist

    const header = (artist[headerKey] as string) || ''
    const text = (artist[textKey] as string) || ''

    return { header, text }
  }

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-backgroundColor">
      <div className="max-w-7xl mx-auto px-4">

        {/* En-tête de section */}
        <div ref={headerRef} className="flex items-center gap-6 mb-16 lg:mb-20">
          <div className="flex-shrink-0">
            <h2 className="text-2xl lg:text-3xl font-bold text-textColor unbounded">
              {t('biography.title')}
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <div className="bio-underline h-0.5 w-10 bg-purpleColor rounded-full origin-left" />
              <div className="bio-underline h-0.5 w-4 bg-purpleColor/40 rounded-full origin-left" />
            </div>
          </div>
          <div className="bio-separator flex-1 h-px bg-borderColor hidden sm:block origin-left" />
        </div>

        {/* Layout : Image sticky à gauche + biographie en 2 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">

          {/* Image artiste — sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div ref={stickyImageRef} className="relative group">
                {/* Halo décoratif */}
                <div
                  className="absolute -inset-3 bg-gradient-to-br from-purpleColor/15 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  aria-hidden="true"
                />

                {/* Image */}
                <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-borderColor/50">
                  {randomImage && (
                    <img
                      src={randomImage}
                      alt={`Atelier de ${artist.name}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  )}
                  {/* Overlay dégradé bas */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"
                    aria-hidden="true"
                  />
                </div>

              </div>
            </div>
          </div>

          {/* Contenu biographie — 2 colonnes */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">

              {/* Colonne gauche — Sections 1 et 3 */}
              <div ref={bioColLeftRef} className="space-y-12">
                {(() => {
                  const { header, text } = getSectionContent(1)
                  return (header || text) && (
                    <BiographySection
                      index={1}
                      header={header || ''}
                      text={text || ''}
                      isExpanded={expandedSections.section1 || false}
                      onToggle={() => toggleSection('section1')}
                      maxLength={200}
                      t={t}
                    />
                  )
                })()}

                {(() => {
                  const { header, text } = getSectionContent(3)
                  return (header || text) && (
                    <BiographySection
                      index={3}
                      header={header || ''}
                      text={text || ''}
                      isExpanded={expandedSections.section3 || false}
                      onToggle={() => toggleSection('section3')}
                      maxLength={200}
                      t={t}
                    />
                  )
                })()}
              </div>

              {/* Colonne droite — Sections 2 et 4 */}
              <div ref={bioColRightRef} className="space-y-12">
                {(() => {
                  const { header, text } = getSectionContent(2)
                  return (header || text) && (
                    <BiographySection
                      index={2}
                      header={header || ''}
                      text={text || ''}
                      isExpanded={expandedSections.section2 || false}
                      onToggle={() => toggleSection('section2')}
                      maxLength={200}
                      t={t}
                    />
                  )
                })()}

                {(() => {
                  const { header, text } = getSectionContent(4)
                  return (header || text) && (
                    <BiographySection
                      index={4}
                      header={header || ''}
                      text={text || ''}
                      isExpanded={expandedSections.section4 || false}
                      onToggle={() => toggleSection('section4')}
                      maxLength={200}
                      t={t}
                    />
                  )
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
