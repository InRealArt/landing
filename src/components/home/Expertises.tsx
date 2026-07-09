'use client'
import { useEffect, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { loadGsap } from '@/lib/gsap'

const items = [
  {
    key: 'galerie',
    number: '01.',
    subtitleKey: 'home.expertises.items.galerie.subtitle',
    titleKey: 'home.expertises.items.galerie.title',
    descriptionKey: 'home.expertises.items.galerie.description',
    ctaKey: 'home.expertises.items.galerie.cta',
    link: '/presale',
  },
  {
    key: 'capital',
    number: '02.',
    subtitleKey: 'home.expertises.items.capital.subtitle',
    titleKey: 'home.expertises.items.capital.title',
    descriptionKey: 'home.expertises.items.capital.description',
    ctaKey: 'home.expertises.items.capital.cta',
    link: '/usecase',
  },
  {
    key: 'agence',
    number: '03.',
    subtitleKey: 'home.expertises.items.agence.subtitle',
    titleKey: 'home.expertises.items.agence.title',
    descriptionKey: 'home.expertises.items.agence.description',
    ctaKey: 'home.expertises.items.agence.cta',
    link: '/agence',
  },
  {
    key: 'media',
    number: '04.',
    subtitleKey: 'home.expertises.items.media.subtitle',
    titleKey: 'home.expertises.items.media.title',
    descriptionKey: 'home.expertises.items.media.description',
    ctaKey: 'home.expertises.items.media.cta',
    link: '/media',
  },
]

export default function Expertises() {
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
          const cards = cardsRef.current.querySelectorAll('.expertise-card')
          gsap.fromTo(
            cards,
            { opacity: 0, y: 48 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.18,
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 90%',
                toggleActions: 'play none none none',
                onEnter: () => gsap.set(cards, { opacity: 1, y: 0 }),
              },
            }
          )
          // Sécurité : si les cards sont déjà visibles au montage, on les affiche directement
          const rect = cardsRef.current.getBoundingClientRect()
          if (rect.top < window.innerHeight) {
            gsap.set(cards, { opacity: 1, y: 0 })
          }
        }
      }, sectionRef)
    }

    initAnimations()
    return () => ctx?.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full bg-backgroundGrey border-y border-borderColor py-28 lg:py-40"
    >
      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4">

        {/* Header */}
        <div ref={headerRef} className="grid lg:grid-cols-12 gap-10 mb-24">
          <div className="lg:col-span-6">
            <span className="section-number !text-textColor" suppressHydrationWarning>
              {t('home.expertises.eyebrow')}
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-7xl serif italic leading-tight text-textColor break-words" suppressHydrationWarning>
              {t('home.expertises.title')}
              <br />
              <em className="not-italic text-gold-accent" suppressHydrationWarning>
                {t('home.expertises.titleAccent')}
              </em>
            </h2>
          </div>
        </div>

        {/* Cards */}
        <div ref={cardsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {items.map((item) => (
            <div key={item.key} className="expertise-card flex flex-col border-t border-borderColor pt-12">
              {/* Number + subtitle row */}
              <div className="flex items-center gap-4 mb-8">
                <span className="serif text-4xl italic text-gold-accent leading-none w-12 shrink-0">
                  {item.number}
                </span>
                <h3 className="text-xs uppercase tracking-[0.4em] font-bold text-textColor" suppressHydrationWarning>
                  {t(item.subtitleKey)}
                </h3>
              </div>

              {/* Title */}
              <h4 className="text-3xl serif mb-6 italic text-textColor min-h-[7rem]" suppressHydrationWarning>
                {t(item.titleKey)}
              </h4>

              {/* Gold rule */}
              <div className="w-8 h-px bg-gold-accent mb-6" />

              {/* Description */}
              <p className="text-sm text-grayText leading-loose" suppressHydrationWarning>
                {t(item.descriptionKey)}
              </p>

              <div className="mt-auto pt-10">
                <a href={item.link} className="btn-cta w-full min-h-[56px]" suppressHydrationWarning>
                  {t(item.ctaKey)}
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
