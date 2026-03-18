'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import { formatTextWithLineBreaksJSX } from '@/utils/functions'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'
import FirebaseImage from '@/components/common/FirebaseImage'

interface ArtistBiographyProps {
  artist: {
    id: number
    name: string
    surname?: string
    intro?: string
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

interface BiographyEntryProps {
  index: number
  header: string
  text: string
  isExpanded: boolean
  onToggle: () => void
  maxLength?: number
  t: (key: string) => string
}

function BiographyEntry({
  index,
  header,
  text,
  isExpanded,
  onToggle,
  maxLength = 280,
  t,
}: BiographyEntryProps) {
  const shouldTruncate = text.length > maxLength
  const displayText =
    shouldTruncate && !isExpanded ? text.substring(0, maxLength) + '…' : text

  // Pad index to two digits for display
  const sectionNumber = String(index).padStart(2, '0')

  return (
    <div className="bio-entry group">
      {/* Title row: serif italic header left, index number right */}
      <div className="flex justify-between items-baseline mb-4 gap-6">
        <span className="text-2xl lg:text-3xl font-cormorant italic font-light text-textColor leading-snug">
          {header}
        </span>
        <span
          className="text-[10px] uppercase tracking-widest text-gray-400 font-montserrat flex-shrink-0"
          aria-hidden="true"
        >
          {sectionNumber}
        </span>
      </div>

      {/* Divider line — changes to gold on group hover */}
      <div
        className="h-px w-full transition-colors duration-700"
        style={{ backgroundColor: '#eeeeee' }}
        onMouseEnter={e => {
          ;(e.currentTarget as HTMLDivElement).style.backgroundColor = '#b89c72'
        }}
        onMouseLeave={e => {
          ;(e.currentTarget as HTMLDivElement).style.backgroundColor = '#eeeeee'
        }}
        aria-hidden="true"
      />

      {/* Expandable text body */}
      {text && (
        <div className="mt-5">
          <div className="text-[11px] uppercase tracking-[0.3em] text-gray-500 font-montserrat leading-relaxed">
            {formatTextWithLineBreaksJSX(displayText)}
          </div>
          {shouldTruncate && (
            <button
              onClick={onToggle}
              className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-montserrat transition-colors duration-200"
              style={{ color: '#b89c72' }}
              aria-expanded={isExpanded}
            >
              {isExpanded ? (
                <>
                  <span>{t('biography.showLess')}</span>
                  <ChevronUpIcon className="w-3 h-3" aria-hidden="true" />
                </>
              ) : (
                <>
                  <span>{t('biography.showMore')}</span>
                  <ChevronDownIcon className="w-3 h-3" aria-hidden="true" />
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function ArtistBiography({ artist }: ArtistBiographyProps) {
  const { t } = useLanguageStore()
  const [randomImage, setRandomImage] = useState<string>('')
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({})

  const sectionRef = useRef<HTMLElement>(null)
  const leftPanelRef = useRef<HTMLDivElement>(null)
  const entriesRef = useRef<HTMLDivElement>(null)

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

        // Left sticky panel
        if (leftPanelRef.current) {
          const children = leftPanelRef.current.querySelectorAll(':scope > *')
          gsap.fromTo(
            children,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.1,
              scrollTrigger: {
                trigger: leftPanelRef.current,
                start: 'top 85%',
                once: true,
              },
            }
          )
        }

        // Right bio entries
        if (entriesRef.current) {
          const entries = entriesRef.current.querySelectorAll('.bio-entry')
          gsap.fromTo(
            entries,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.15,
              scrollTrigger: {
                trigger: entriesRef.current,
                start: 'top 82%',
                once: true,
              },
            }
          )
        }

      }, sectionRef)
    }

    initAnimations()
    return () => ctx?.revert()
  }, [])

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  const getSectionContent = (sectionNumber: number) => {
    const headerKey = `biographyHeader${sectionNumber}` as keyof typeof artist
    const textKey = `biographyText${sectionNumber}` as keyof typeof artist
    return {
      header: (artist[headerKey] as string) || '',
      text: (artist[textKey] as string) || '',
    }
  }

  const hasContent =
    artist.biographyHeader1 || artist.biographyText1 ||
    artist.biographyHeader2 || artist.biographyText2 ||
    artist.biographyHeader3 || artist.biographyText3 ||
    artist.biographyHeader4 || artist.biographyText4

  // Build the list of sections that have content
  const sections = [1, 2, 3, 4]
    .map(n => ({ n, ...getSectionContent(n) }))
    .filter(s => s.header || s.text)

  const artistDisplayName = artist.name

  return (
    <>
      {/* EXPOSITIONS & CV */}
      {hasContent && (
        <section
          ref={sectionRef}
          className="py-24 lg:py-48 bg-backgroundColor border-t"
          style={{ borderColor: '#eeeeee' }}
        >
          <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-12 gap-16 lg:gap-20">

              {/* Left sticky panel */}
              <div className="lg:col-span-4">
                <div ref={leftPanelRef} className="lg:sticky lg:top-40 space-y-6">
                  <span className="block text-[10px] uppercase tracking-[0.5em] text-gray-400 font-montserrat">
                    {t('artistPage.biographyLabel')}
                  </span>

                  <h2 className="text-4xl lg:text-5xl font-cormorant font-light italic text-textColor leading-tight">
                    {t('artistPage.biographyTitle')}
                  </h2>

                  {/* Studio image */}
                  {randomImage && (
                    <div className="mt-8 aspect-[3/4] overflow-hidden">
                      <FirebaseImage
                        src={randomImage}
                        alt={`Atelier de ${artistDisplayName}`}
                        className="w-full h-full"
                        imgClassName="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-[filter] duration-700"
                        loading="lazy"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Right — biography entries as exhibition list */}
              <div className="lg:col-span-8">
                <div ref={entriesRef} className="space-y-12 lg:space-y-16">
                  {sections.map(s => (
                    <BiographyEntry
                      key={s.n}
                      index={s.n}
                      header={s.header}
                      text={s.text}
                      isExpanded={expandedSections[`section${s.n}`] || false}
                      onToggle={() => toggleSection(`section${s.n}`)}
                      maxLength={280}
                      t={t}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      {/* CTA CONTACT — full black section */}
      <section
        className="py-24 lg:py-40 px-6 lg:px-10 text-center"
        style={{ backgroundColor: '#000000', color: '#ffffff' }}
      >
        <div className="max-w-4xl mx-auto">
          <span
            className="block text-[10px] uppercase tracking-[0.5em] font-montserrat mb-6 italic"
            style={{ color: '#555555' }}
          >
            {t('artistPage.ctaLabel')}
          </span>

          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-cormorant font-light italic leading-tight mb-10"
          >
            {t('artistPage.ctaTitle')}{' '}
            <span style={{ color: '#b89c72' }}>{artistDisplayName}</span>{' '}
            {t('artistPage.ctaTitleSuffix')}
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
            {/* Primary CTA — white border */}
            <a
              href="/contact"
              className="inline-block px-8 py-4 text-[10px] uppercase tracking-[0.25em] font-montserrat border border-white transition-all duration-500 hover:bg-white hover:text-black"
            >
              {t('artistPage.ctaCatalog')}
            </a>

            {/* Secondary CTA — gold border */}
            <a
              href="/contact"
              className="inline-block px-8 py-4 text-[10px] uppercase tracking-[0.25em] font-montserrat border transition-all duration-500"
              style={{ borderColor: '#b89c72', color: '#b89c72' }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.backgroundColor = '#b89c72'
                el.style.color = '#ffffff'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.backgroundColor = 'transparent'
                el.style.color = '#b89c72'
              }}
            >
              {t('artistPage.ctaContact')}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
