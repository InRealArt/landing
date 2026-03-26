'use client'

import { useEffect, useRef } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import { TransformedArtistData } from '@/types/artist'
import { formatTextWithLineBreaksJSX } from '@/utils/functions'
import FirebaseImage from '@/components/common/FirebaseImage'

interface ArtistInfoSectionProps {
  artist: TransformedArtistData
  interviewUrl?: string | null
  artitudeUrl?: string | null
}

export default function ArtistInfoSection({ artist, interviewUrl, artitudeUrl }: ArtistInfoSectionProps) {
  const { t, language } = useLanguageStore()

  const sectionRef = useRef<HTMLElement>(null)
  const photoColRef = useRef<HTMLDivElement>(null)
  const textColRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    const initAnimations = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {

        // Photo column: slide in from left
        if (photoColRef.current) {
          gsap.fromTo(
            photoColRef.current,
            { opacity: 0, x: -32 },
            {
              opacity: 1,
              x: 0,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: photoColRef.current,
                start: 'top 82%',
                once: true,
              },
            }
          )
        }

        // Text column: stagger children
        if (textColRef.current) {
          const children = textColRef.current.querySelectorAll(':scope > *')
          gsap.fromTo(
            children,
            { opacity: 0, y: 28 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: 'power3.out',
              stagger: 0.1,
              scrollTrigger: {
                trigger: textColRef.current,
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

  const hasCta = interviewUrl || artitudeUrl

  return (
    <section ref={sectionRef} id="artist-description" className="py-24 lg:py-40 bg-backgroundColor">
      <div className="max-w-screen-2xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-20">

          {/* Left — portrait photo */}
          <div ref={photoColRef} className="lg:col-span-5">
            <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative">
              <FirebaseImage
                src={artist.photo}
                alt={`Portrait de ${artist.name}`}
                className="w-full h-full"
                imgClassName="absolute inset-0 w-full h-full object-cover object-top grayscale hover:grayscale-0 transition-[filter] duration-700"
                loading="eager"
              />
            </div>

            {/* Meta below portrait */}
            {(artist.birthYear || artist.countryName) && (
              <div className="mt-8 flex justify-between items-start">
                {artist.birthYear && (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-textColor font-montserrat">
                      {language === 'fr' ? 'Née en' : 'Born'}
                    </p>
                    <p className="text-lg font-cormorant italic font-light text-gray-500 mt-1">
                      {artist.birthYear}
                    </p>
                  </div>
                )}
                {artist.countryName && (
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest font-semibold text-textColor font-montserrat">
                      {language === 'fr' ? 'Origine' : 'Origin'}
                    </p>
                    <p className="text-lg font-cormorant italic font-light text-gray-500 mt-1">
                      {artist.countryName}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Medium tags */}
            {artist.mediumTags && artist.mediumTags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {artist.mediumTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 border text-[10px] uppercase tracking-widest font-montserrat transition-colors duration-300 hover:bg-textColor hover:text-backgroundColor"
                    style={{ borderColor: '#eeeeee', color: '#888888' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right — editorial biography */}
          <div
            ref={textColRef}
            className="lg:col-span-6 lg:col-start-7 flex flex-col justify-center space-y-8"
          >
            <span className="block text-[10px] uppercase tracking-[0.5em] text-gray-400 font-montserrat">
              {language === 'fr' ? 'La Démarche' : 'The Approach'}
            </span>

            {/* Section h2 */}
            <h2 className="text-4xl lg:text-5xl font-cormorant font-light text-textColor leading-tight">
              {t('artistPage.whoIs')}
              <span className="italic" style={{ color: '#b89c72' }}>
                {artist.name}
              </span>
            </h2>

            {/* Biography text */}
            <div className="space-y-6 text-gray-500 leading-loose text-sm font-light font-montserrat">
              {artist.description ? (
                <div>
                  {formatTextWithLineBreaksJSX(
                    artist.description || t('artists.profile.certifiedArtist').replace('{name}', artist.name)
                  )}
                </div>
              ) : null}
            </div>

            {/* Italic quote from InRealArt */}
            {artist.quoteFromInRealArt && (
              <p className="text-xl font-cormorant italic font-light text-textColor leading-relaxed">
                &ldquo;{artist.quoteFromInRealArt}&rdquo;
              </p>
            )}

            {/* CTAs */}
            {hasCta && (
              <div className="pt-8 border-t flex flex-col sm:flex-row gap-4" style={{ borderColor: '#eeeeee' }}>
                {interviewUrl && (
                  <a
                    href={interviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-7 py-4 border text-[10px] uppercase tracking-[0.25em] font-montserrat transition-all duration-500 hover:bg-textColor hover:text-backgroundColor"
                    style={{ borderColor: '#000000' }}
                  >
                    {t('artists.profile.readInterview').replace('{name}', '')}
                  </a>
                )}
                {artitudeUrl && (
                  <a
                    href={artitudeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-7 py-4 border text-[10px] uppercase tracking-[0.25em] font-montserrat transition-all duration-500"
                    style={{ borderColor: '#b89c72', color: '#b89c72' }}
                    onMouseEnter={e => {
                      ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = '#b89c72'
                      ;(e.currentTarget as HTMLAnchorElement).style.color = '#ffffff'
                    }}
                    onMouseLeave={e => {
                      ;(e.currentTarget as HTMLAnchorElement).style.backgroundColor = 'transparent'
                      ;(e.currentTarget as HTMLAnchorElement).style.color = '#b89c72'
                    }}
                  >
                    {t('artists.profile.visitArtitude').replace('{name}', '')}
                  </a>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
