'use client'

import { useEffect, useRef } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import { ArtistData } from '@/store/useArtistStore'
import { formatTextWithLineBreaksJSX } from '@/utils/functions'
import FirebaseImage from '@/components/common/FirebaseImage'

interface ArtistInfoSectionProps {
  artist: ArtistData
  interviewUrl?: string | null
  artitudeUrl?: string | null
}

export default function ArtistInfoSection({ artist, interviewUrl, artitudeUrl }: ArtistInfoSectionProps) {
  const { t } = useLanguageStore()

  const sectionRef = useRef<HTMLElement>(null)
  const separatorRef = useRef<HTMLDivElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    const initAnimations = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {

        // — Séparateur décoratif haut de section
        if (separatorRef.current) {
          const lines = separatorRef.current.querySelectorAll('.sep-line')
          const dots = separatorRef.current.querySelectorAll('.sep-dot')
          gsap.fromTo(
            lines,
            { scaleX: 0, opacity: 0 },
            {
              scaleX: 1,
              opacity: 1,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.1,
              transformOrigin: 'left',
              scrollTrigger: {
                trigger: separatorRef.current,
                start: 'top 88%',
                once: true,
              },
            }
          )
          gsap.fromTo(
            dots,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.4,
              ease: 'back.out(2)',
              stagger: 0.08,
              scrollTrigger: {
                trigger: separatorRef.current,
                start: 'top 88%',
                once: true,
              },
            }
          )
        }

        // — Colonne gauche : fade + slide-up séquentiel sur les enfants directs
        if (leftColRef.current) {
          const children = leftColRef.current.querySelectorAll(':scope > *')
          gsap.fromTo(
            children,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: 'power3.out',
              stagger: 0.12,
              scrollTrigger: {
                trigger: leftColRef.current,
                start: 'top 82%',
                once: true,
              },
            }
          )
        }

        // — Colonne droite : image + cadre décalé
        if (rightColRef.current) {
          const image = rightColRef.current.querySelector('.artist-img-main')
          const frame = rightColRef.current.querySelector('.artist-img-frame')

          if (frame) {
            gsap.fromTo(
              frame,
              { opacity: 0, x: -8, y: -8 },
              {
                opacity: 1,
                x: 0,
                y: 0,
                duration: 0.9,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: rightColRef.current,
                  start: 'top 80%',
                  once: true,
                },
              }
            )
          }

          if (image) {
            gsap.fromTo(
              image,
              { opacity: 0, x: 24, scale: 0.97 },
              {
                opacity: 1,
                x: 0,
                scale: 1,
                duration: 1,
                ease: 'power3.out',
                delay: 0.1,
                scrollTrigger: {
                  trigger: rightColRef.current,
                  start: 'top 80%',
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

  return (
    <section ref={sectionRef} className="relative pt-20 pb-20 lg:pt-28 lg:pb-28">

      {/* Séparateur décoratif haut de section */}
      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4">
        <div ref={separatorRef} className="flex items-center gap-4 mb-16 lg:mb-20">
          <div className="sep-line h-px flex-1 bg-borderColor origin-left" />
          <div className="sep-dot w-1.5 h-1.5 rounded-full bg-purpleColor flex-shrink-0" />
          <div className="sep-line h-px w-8 bg-purpleColor/50 flex-shrink-0 origin-left" />
          <div className="sep-dot w-1.5 h-1.5 rounded-full bg-purpleColor/30 flex-shrink-0" />
          <div className="sep-line h-px flex-1 bg-borderColor origin-left" />
        </div>
      </div>

      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Colonne gauche — Informations éditoriales */}
          <div ref={leftColRef} className="space-y-8">

            {/* Origine et année de naissance */}
            {(artist.birthYear || artist.countryName) && (
              <p className="text-grayText text-xs uppercase tracking-[0.18em] bricolage-grotesque font-medium">
                {artist.birthYear && (
                  <span>{t('artists.profile.bornIn')} {artist.birthYear}</span>
                )}
                {artist.birthYear && artist.countryName && (
                  <span className="mx-2 opacity-40">·</span>
                )}
                {artist.countryName && <span>{artist.countryName}</span>}
              </p>
            )}

            {/* Citation éditoriale — grande typographie */}
            <blockquote className="relative">
              {/* Guillemet décoratif inline — reste dans le flux du blockquote */}
              <span
                className="block text-5xl font-bold text-purpleColor/15 unbounded leading-none select-none pointer-events-none -mb-3"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-textColor bricolage-grotesque leading-tight">
                {formatTextWithLineBreaksJSX(artist.intro)}
              </h2>
            </blockquote>

            {/* Tags médium — pilules bordure purpleColor */}
            {artist.mediumTags && artist.mediumTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {artist.mediumTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-1.5 border border-purpleColor/40 text-purpleColor rounded-full text-xs font-semibold tracking-wide bricolage-grotesque bg-purpleColor/5 hover:bg-purpleColor/10 transition-colors duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="text-grayText text-sm lg:text-base leading-relaxed lg:leading-loose bricolage-grotesque space-y-4">
              {formatTextWithLineBreaksJSX(
                artist.description || t('artists.profile.certifiedArtist').replace('{name}', artist.name)
              )}
            </div>

            {/* CTAs interview & artitude */}
            {(interviewUrl || artitudeUrl) && (
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
                {interviewUrl && (
                  <a
                    href={interviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-6 py-3.5 border border-textColor/30 hover:border-textColor text-textColor rounded-full text-sm font-semibold bricolage-grotesque transition-all duration-250 hover:bg-textColor hover:text-backgroundColor"
                  >
                    <span>{t('artists.profile.readInterview').replace('{name}', artist.name)}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
                    </svg>
                  </a>
                )}
                {artitudeUrl && (
                  <a
                    href={artitudeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-3 px-6 py-3.5 border border-purpleColor/50 hover:border-purpleColor text-purpleColor rounded-full text-sm font-semibold bricolage-grotesque transition-all duration-250 hover:bg-purpleColor hover:text-white"
                  >
                    <span>{t('artists.profile.visitArtitude').replace('{name}', artist.name)}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Colonne droite — Photo secondaire avec cadre artistique */}
          <div ref={rightColRef} className="flex justify-center lg:justify-end">
            <div className="relative group max-w-sm w-full">
              {/* Cadre décoratif décalé */}
              <div
                className="artist-img-frame absolute inset-0 translate-x-4 translate-y-4 rounded-2xl border border-purpleColor/20 bg-purpleColor/5 pointer-events-none transition-transform duration-500 group-hover:translate-x-5 group-hover:translate-y-5"
                aria-hidden="true"
              />

              {/* Image principale */}
              <div className="artist-img-main relative rounded-2xl overflow-hidden shadow-2xl">
                <FirebaseImage
                  src={artist.secondaryImageUrl || artist.photo}
                  alt={`Photo de ${artist.name}`}
                  className="w-full"
                  imgClassName="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.02] transition-opacity duration-500"
                />
                {/* Overlay subtil au hover */}
                <div className="absolute inset-0 bg-purpleColor/0 group-hover:bg-purpleColor/5 transition-colors duration-500 pointer-events-none" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
