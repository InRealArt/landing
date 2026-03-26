'use client'

import { useEffect, useRef } from 'react'
import { useLanguageStore } from '@/store/languageStore'

interface ArtistProfileHeroProps {
  artist: {
    name: string
    surname?: string
    role: string
    intro: string
    description: string
    photo: string
    mediumTags?: string[]
    birthYear?: number | null
    countryCode?: string | null
    countryName?: string | null
  }
}

export default function ArtistProfileHero({ artist }: ArtistProfileHeroProps) {
  const { language } = useLanguageStore()

  const containerRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const specialtyRef = useRef<HTMLParagraphElement>(null)
  const quoteRef = useRef<HTMLParagraphElement>(null)

  // Split "Prénom Nom" — surname is the last word, firstName is everything before
  const nameParts = artist.name.trim().split(' ')
  const firstName = nameParts.slice(0, -1).join(' ') || artist.name
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    const initAnimations = async () => {
      const { gsap } = await import('gsap')

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        if (labelRef.current) {
          tl.fromTo(labelRef.current, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.5 })
        }

        if (nameRef.current) {
          const spans = nameRef.current.querySelectorAll('span')
          tl.fromTo(
            spans,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.9, ease: 'power4.out', stagger: 0.12 },
            '-=0.2'
          )
        }

        if (specialtyRef.current) {
          tl.fromTo(
            specialtyRef.current,
            { opacity: 0, x: -12 },
            { opacity: 1, x: 0, duration: 0.6 },
            '-=0.4'
          )
        }

        if (quoteRef.current) {
          tl.fromTo(
            quoteRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8 },
            '-=0.5'
          )
        }
      }, containerRef)
    }

    initAnimations()
    return () => ctx?.revert()
  }, [])

  return (
    <div
      ref={containerRef}
      id="artist-hero"
      className="w-full bg-backgroundColor border-b fixed left-0 right-0 top-16 md:top-[90px]"
      style={{
        zIndex: 39,
        borderColor: 'var(--border-color)',
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10 pt-6 pb-4 lg:pt-8 lg:pb-5">
        <div className="grid lg:grid-cols-12 gap-4 lg:gap-8 items-center">

          {/* Left — section label + name + specialty */}
          <div className="lg:col-span-7">
            <span
              ref={labelRef}
              className="section-number opacity-0"
            >
              {language === 'fr' ? 'Artiste résident' : 'Resident Artist'}
            </span>

            <h1
              ref={nameRef}
              className="leading-none mb-3"
            >
              <span className="block text-3xl md:text-4xl lg:text-5xl font-cormorant font-light text-textColor opacity-0">
                {firstName}
              </span>
              {lastName && (
                <span
                  className="block text-3xl md:text-4xl lg:text-5xl font-cormorant font-light italic opacity-0"
                  style={{ color: '#b89c72' }}
                >
                  {lastName}
                </span>
              )}
            </h1>

            <p
              ref={specialtyRef}
              className="text-[10px] uppercase tracking-[0.35em] text-gray-400 font-montserrat flex items-center gap-3 opacity-0"
            >
              <span className="w-6 h-px bg-gray-300 flex-shrink-0" aria-hidden="true" />
              {artist.role}
              {artist.countryName && (
                <>
                  <span className="opacity-40" aria-hidden="true">—</span>
                  <span>{artist.countryName}</span>
                </>
              )}
              {artist.birthYear && (
                <>
                  <span className="opacity-40" aria-hidden="true">·</span>
                  <span>
                    {language === 'fr' ? 'Né(e) en' : 'Born in'}{' '}
                    {artist.birthYear}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Right — editorial intro quote */}
          {artist.intro && (
            <div className="lg:col-span-5 hidden lg:block">
              <p
                ref={quoteRef}
                className="text-base lg:text-lg font-cormorant italic font-light leading-relaxed text-gray-500 opacity-0"
              >
                &laquo;&nbsp;{artist.intro}&nbsp;&raquo;
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
