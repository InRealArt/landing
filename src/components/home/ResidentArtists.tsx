'use client'
import { useEffect, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { loadGsap } from '@/lib/gsap'
import Link from 'next/link'
import FirebaseImage from '@/components/common/FirebaseImage'

interface ResidentArtist {
  id: number
  slug: string
  name: string
  surname: string
  pseudo: string
  imageUrl: string
  mediumTags?: string[]
}

interface ResidentArtistsProps {
  artists: ResidentArtist[]
}

export default function ResidentArtists({ artists }: ResidentArtistsProps) {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    const initAnimations = async () => {
      const { gsap } = await loadGsap()

      ctx = gsap.context(() => {
        if (headerRef.current) {
          const headerElements = headerRef.current.querySelectorAll('.section-number, h2')
          gsap.fromTo(
            headerElements,
            { opacity: 0, y: 24 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.12,
              scrollTrigger: {
                trigger: headerRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          )
        }

        if (cardsRef.current) {
          const cards = cardsRef.current.querySelectorAll('.artist-card')
          gsap.fromTo(
            cards,
            { opacity: 0, y: 48 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.15,
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 82%',
                toggleActions: 'play none none none',
              },
            }
          )
        }
      }, sectionRef)
    }

    initAnimations()
    return () => ctx?.revert()
  }, [])

  const getDisplayName = (artist: ResidentArtist) => {
    if (artist.pseudo) return artist.pseudo
    return `${artist.name} ${artist.surname}`.trim()
  }

  const getCategory = (artist: ResidentArtist) => {
    if (artist.mediumTags && artist.mediumTags.length > 0) {
      return artist.mediumTags[0]
    }
    return 'Artiste Résident'
  }

  return (
    <section
      ref={sectionRef}
      className="w-full bg-backgroundGrey py-28 lg:py-40"
    >
      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4">

        {/* Header */}
        <div ref={headerRef} className="text-center mb-24">
          <span className="section-number" suppressHydrationWarning>
            {t('home.residentArtists.eyebrow')}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl serif italic text-textColor break-words" suppressHydrationWarning>
            {t('home.residentArtists.title')}
          </h2>
        </div>

        {/* Artist Cards */}
        <div ref={cardsRef} className="grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-8 md:gap-x-12 gap-y-12 sm:gap-y-16 md:gap-y-20">
          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artists/${artist.slug}`}
              className="artist-card group cursor-pointer opacity-0"
            >
              <div className="aspect-[3/4] overflow-hidden mb-8 bg-cardBackground grayscale group-hover:grayscale-0 transition-all duration-1000">
                <FirebaseImage
                  src={artist.imageUrl}
                  alt={getDisplayName(artist)}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="text-center">
                <h4 className="text-sm uppercase tracking-[0.3em] font-medium text-textColor" suppressHydrationWarning>
                  {getDisplayName(artist)}
                </h4>
                <p className="text-[10px] text-grayText uppercase tracking-widest mt-2 italic serif" suppressHydrationWarning>
                  {getCategory(artist)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-20">
          <Link href="/artists" className="text-[10px] border-b border-borderColor pb-1 uppercase tracking-[0.3em] hover:opacity-50 text-textColor" suppressHydrationWarning>
            {t('home.residentArtists.cta')}
          </Link>
        </div>

      </div>
    </section>
  )
}
