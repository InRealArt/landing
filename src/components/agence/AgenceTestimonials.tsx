'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { UgcTopArtistData } from '@/actions/ugcActions'
import { getImageUrl } from '@/lib/cloufare/r2/url'

interface Props {
  t: (key: string) => string
  artists: UgcTopArtistData[]
}

// Static testimonials — one per artist slot (matched by index)
const TESTIMONIALS = [
  {
    quote: "Travailler avec In Real Art, c'est accéder à des marques qui respectent ta vision. Pas de brief toxique — juste de la co-création.",
    context: "Collaboration brand content · 2024",
  },
  {
    quote: "J'ai livré 8 assets en deux semaines. Le pipeline est fluide, le brief est clair. C'est ça, un partenariat qui scale.",
    context: "Campagne Artistique · Q4 2024",
  },
  {
    quote: "Mes reels pour la marque ont overperformé de 340 %. In Real Art sait exactement à qui confier quel type de contenu.",
    context: "Activation social media · 2025",
  },
  {
    quote: "Enfin une agence qui traite les créateurs comme des partenaires stratégiques et non comme des prestataires.",
    context: "Ambassade long terme · 2024–2025",
  },
]

function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

export default function AgenceTestimonials({ t, artists }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<{ artist: UgcTopArtistData; testimonial: typeof TESTIMONIALS[0] }[]>([])

  // Pick random artists once on mount
  useEffect(() => {
    if (!artists.length) return
    const pool = artists.map((a, i) => ({ artist: a, testimonial: TESTIMONIALS[i % TESTIMONIALS.length] }))
    setSelected(pickRandom(pool, Math.min(3, pool.length)))
  }, [artists])

  useEffect(() => {
    if (!selected.length) return
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.9,
          ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
          scrollTrigger: { trigger: headerRef.current, start: 'top 88%', once: true },
        }
      )

      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll<HTMLElement>('[data-card]')
        gsap.fromTo(
          cards,
          { opacity: 0, y: 48, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.85,
            ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
            stagger: 0.14,
            scrollTrigger: { trigger: cardsRef.current, start: 'top 86%', once: true },
          }
        )
      }
    }, sectionRef)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [selected])

  if (!selected.length) return null

  return (
    <section ref={sectionRef} className="bg-backgroundColor py-24 lg:py-32 overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-10">

        {/* Header */}
        <div ref={headerRef} className="mb-20" style={{ opacity: 0 }}>
          <span className="section-number">{t('agence.testimonials.eyebrow')}</span>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mt-4 pb-14 border-b border-borderColor">
            <h2 className="serif text-4xl md:text-5xl font-light leading-tight text-textColor max-w-xl">
              {t('agence.testimonials.title')}{' '}
              <em className="not-italic text-gold-accent">{t('agence.testimonials.titleAccent')}</em>
            </h2>
            <p className="text-[13px] text-grayText leading-loose montserrat max-w-sm">
              {t('agence.testimonials.subtitle')}
            </p>
          </div>
        </div>

        {/* Cards */}
        <div
          ref={cardsRef}
          className={`grid gap-px bg-borderColor ${selected.length === 2 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}
        >
          {selected.map(({ artist, testimonial }, i) => {
            const name = artist.profile.pseudo || [artist.profile.name, artist.profile.surname].filter(Boolean).join(' ') || 'Créateur'
            const img = getImageUrl(artist.profile.profileImageUrl)

            return (
              <div
                key={artist.id}
                data-card
                className="group bg-backgroundGrey hover:bg-backgroundColor transition-colors duration-500 p-10 lg:p-12 flex flex-col gap-8"
                style={{ opacity: 0 }}
              >
                {/* Opening mark */}
                <span
                  className="text-gold-accent/30 leading-none group-hover:text-gold-accent/60 transition-colors duration-500"
                  aria-hidden="true"
                  style={{ fontFamily: 'var(--font-cormorant)', fontSize: 'clamp(56px, 6vw, 80px)', lineHeight: 0.7 }}
                >
                  "
                </span>

                {/* Quote */}
                <blockquote className="flex-1">
                  <p
                    className="text-textColor leading-relaxed"
                    style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 'clamp(17px, 1.5vw, 21px)' }}
                  >
                    {testimonial.quote}
                  </p>
                </blockquote>

                {/* Context tag */}
                <p className="text-[9px] uppercase tracking-[0.35em] text-grayText montserrat">
                  {testimonial.context}
                </p>

                {/* Divider */}
                <div className="w-8 h-px bg-gold-accent/50 group-hover:bg-gold-accent transition-colors duration-500" />

                {/* Artist identity */}
                <div className="flex items-center gap-4">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-backgroundGrey border border-borderColor shrink-0">
                    {img ? (
                      <Image
                        src={img}
                        alt={name}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        sizes="128px"
                      />
                    ) : (
                      <span
                        className="absolute inset-0 flex items-center justify-center text-gold-accent/60 text-sm"
                        style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic' }}
                      >
                        {name[0]}
                      </span>
                    )}
                  </div>
                  <div>
                    <p
                      className="text-gold-accent leading-none"
                      style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 'clamp(15px, 1.2vw, 18px)' }}
                    >
                      {name}
                    </p>
                    {artist.profile.title && (
                      <p className="text-[9px] uppercase tracking-[0.3em] text-grayText montserrat mt-1">
                        {artist.profile.title}
                      </p>
                    )}
                  </div>

                  {/* Index */}
                  <span
                    className="ml-auto text-gold-accent/20 group-hover:text-gold-accent/40 transition-colors duration-500 leading-none"
                    aria-hidden="true"
                    style={{ fontFamily: 'var(--font-cormorant)', fontStyle: 'italic', fontSize: 'clamp(36px, 4vw, 56px)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
