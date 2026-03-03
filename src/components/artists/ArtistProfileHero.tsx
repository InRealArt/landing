'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'

interface ArtistProfileHeroProps {
  artist: {
    name: string
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
  const { t, language } = useLanguageStore()
  const [backgroundImage, setBackgroundImage] = useState('')

  const containerRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const tagsRef = useRef<HTMLDivElement>(null)
  const roleRef = useRef<HTMLParagraphElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const metaRef = useRef<HTMLParagraphElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const randomImageNumber = Math.floor(Math.random() * 5) + 1
    setBackgroundImage(`/images/artistProfile/artiste_profile_${randomImageNumber}.webp`)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    const initAnimations = async () => {
      const { gsap } = await import('gsap')

      ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        // 1. Photo portrait — fade-in depuis la gauche
        if (photoRef.current) {
          tl.fromTo(
            photoRef.current,
            { opacity: 0, x: -20 },
            { opacity: 1, x: 0, duration: 0.9 }
          )
        }

        // 2. Tags médium — fade-in depuis le haut avec stagger
        if (tagsRef.current) {
          const tags = tagsRef.current.children
          if (tags.length > 0) {
            tl.fromTo(
              tags,
              { opacity: 0, y: -10 },
              { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
              '+=0.2'
            )
          }
        }

        // 3. Role / Statut — fade-in depuis le bas
        if (roleRef.current) {
          tl.fromTo(
            roleRef.current,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6 },
            '-=0.3'
          )
        }

        // 4 & 5. H1 — firstName puis lastName avec stagger
        if (nameRef.current) {
          const spans = nameRef.current.querySelectorAll('span')
          if (spans.length > 0) {
            tl.fromTo(
              spans,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.7, ease: 'power4.out', stagger: 0.1 },
              '-=0.3'
            )
          }
        }

        // 6. Ligne décorative — scaleX depuis la gauche
        if (dividerRef.current) {
          tl.fromTo(
            dividerRef.current,
            { opacity: 0, scaleX: 0 },
            { opacity: 1, scaleX: 1, duration: 0.5, transformOrigin: 'left' },
            '-=0.2'
          )
        }

        // 7. Infos naissance/pays — fade-in depuis le bas
        if (metaRef.current) {
          tl.fromTo(
            metaRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5 },
            '-=0.2'
          )
        }

        // 8. Badge InRealArt — fade-in avec rebond
        if (badgeRef.current) {
          tl.fromTo(
            badgeRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.4)' },
            '-=0.3'
          )
        }
      }, containerRef)
    }

    initAnimations()

    return () => ctx?.revert()
  }, [])

  const nameParts = artist.name.split(' ')
  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(' ')

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden bg-[#0c0c0c]">

      {/* Couche décorative : image de fond estompée — plein écran, derrière tout */}
      {backgroundImage && (
        <div className="absolute inset-0 opacity-15 scale-105">
          <OptimizedBackgroundImage
            src={backgroundImage}
            alt=""
            width={1920}
            height={1080}
            className="w-full h-full"
            overlay={false}
          />
        </div>
      )}

      {/* Contenu centré avec max-w — même convention que le reste du site */}
      <div className="relative z-10 max-w-90 xl:max-w-screen-xl mx-auto px-4 py-16 lg:py-20">

        {/* Split 50/50 : photo à gauche, texte à droite */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-16">

          {/* Colonne gauche — Portrait */}
          <div className="relative">
            {/* Photo portrait avec ratio fixe */}
            <div ref={photoRef} className="relative overflow-hidden rounded-xl aspect-[3/4] opacity-0">
              <img
                src={artist.photo}
                alt={`Portrait de ${artist.name}`}
                className="w-full h-full object-cover object-top"
              />

              {/* Dégradé de fusion vers la droite (desktop) — fond sombre */}
              <div className="hidden lg:block absolute inset-y-0 right-0 w-24 bg-gradient-to-r from-transparent to-[#0c0c0c]" />

              {/* Dégradé de fusion vers le bas (mobile) */}
              <div className="lg:hidden absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0c0c0c] to-transparent" />
            </div>

            {/* Tags médium — glassmorphism flottants sur la photo */}
            {artist.mediumTags && artist.mediumTags.length > 0 && (
              <div
                ref={tagsRef}
                className="absolute top-4 left-4 flex flex-wrap gap-2"
              >
                {artist.mediumTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-xs font-medium tracking-wide opacity-0"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Colonne droite — Informations artiste */}
          <div className="relative flex flex-col justify-center pt-8 lg:pt-0">

            {/* Ligne décorative verticale (desktop) — séparateur subtil */}
            <div className="hidden lg:block absolute left-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />

            <div className="lg:pl-4">

              {/* Role / Statut */}
              <p
                ref={roleRef}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-purpleColor mb-5 bricolage-grotesque opacity-0"
              >
                {artist.role}
              </p>

              {/* Nom de l'artiste — h1 SEO */}
              <h1 ref={nameRef} className="text-white leading-none mb-6">
                <span className="block text-4xl lg:text-5xl xl:text-6xl font-bold unbounded opacity-0">
                  {firstName}
                </span>
                {lastName && (
                  <span className="block text-4xl lg:text-5xl xl:text-6xl font-bold unbounded text-white/80 opacity-0">
                    {lastName}
                  </span>
                )}
              </h1>

              {/* Ligne décorative sous le nom */}
              <div ref={dividerRef} className="flex items-center gap-3 mb-6 opacity-0">
                <div className="h-px w-10 bg-purpleColor" />
                <div className="h-px flex-1 max-w-[120px] bg-white/10" />
              </div>

              {/* Origine et année de naissance */}
              {(artist.birthYear || artist.countryName) && (
                <p
                  ref={metaRef}
                  className="text-white/50 text-sm bricolage-grotesque mb-5 tracking-wide opacity-0"
                >
                  {artist.birthYear && (
                    <span>
                      {t('artistPage.bornIn')} <span className="text-white/70">{artist.birthYear}</span>
                    </span>
                  )}
                  {artist.birthYear && artist.countryName && (
                    <span className="mx-2 opacity-40">—</span>
                  )}
                  {artist.countryName && (
                    <span className="text-white/70">{artist.countryName}</span>
                  )}
                </p>
              )}

              {/* Badge InRealArt */}
              <div
                ref={badgeRef}
                className="inline-flex flex-col gap-1 px-4 py-3 bg-white/5 border border-purpleColor/30 rounded-xl backdrop-blur-sm opacity-0"
              >
                <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/80 bricolage-grotesque">
                  <span className="text-purpleColor">✦</span>
                  {language === 'fr' ? 'Artiste certifié InRealArt' : 'InRealArt Certified Artist'}
                </span>
                <span className="text-[10px] text-white/40 bricolage-grotesque tracking-wide">
                  {language === 'fr' ? 'Œuvres authentifiées' : 'Authenticated artworks'}
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
