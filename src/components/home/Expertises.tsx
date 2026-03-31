'use client'
import { useEffect, useRef } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import { loadGsap } from '@/lib/gsap'

const items = [
  {
    key: 'media',
    number: '01.',
    subtitleKey: 'home.expertises.items.media.subtitle',
    titleKey: 'home.expertises.items.media.title',
    descriptionKey: 'home.expertises.items.media.description',
    ctaKey: 'home.expertises.items.media.cta',
    link: '/media',
  },
  {
    key: 'curate',
    number: '02.',
    subtitleKey: 'home.expertises.items.curate.subtitle',
    titleKey: 'home.expertises.items.curate.title',
    descriptionKey: 'home.expertises.items.curate.description',
    ctaKey: 'home.expertises.items.curate.cta',
    link: '/presale',
  },
  {
    key: 'capital',
    number: '03.',
    subtitleKey: 'home.expertises.items.capital.subtitle',
    titleKey: 'home.expertises.items.capital.title',
    descriptionKey: 'home.expertises.items.capital.description',
    ctaKey: 'home.expertises.items.capital.cta',
    link: '/simulators/loa',
  },
  {
    key: 'studio',
    number: '04.',
    subtitleKey: 'home.expertises.items.studio.subtitle',
    titleKey: 'home.expertises.items.studio.title',
    descriptionKey: 'home.expertises.items.studio.description',
    ctaKey: 'home.expertises.items.studio.cta',
    link: '/media',
  },
]

export default function Expertises() {
  const t = useLanguageStore((state) => state.t)
  // Subscribe to language to trigger re-renders on language change
  useLanguageStore((state) => state.language)
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

  return (
    <section
      ref={sectionRef}
      className="w-full bg-backgroundGrey border-y border-borderColor py-28 lg:py-40"
    >
      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4">

        {/* Header */}
        <div ref={headerRef} className="grid lg:grid-cols-12 gap-10 mb-24">
          <div className="lg:col-span-6">
            <span className="section-number" suppressHydrationWarning>
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
            <div key={item.key} className="expertise-card border-t border-borderColor pt-12 opacity-0">
              {/* Number + subtitle row */}
              <div className="flex items-center gap-4 mb-8">
                <span className="serif text-4xl italic text-gold-accent leading-none">
                  {item.number}
                </span>
                <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-textColor" suppressHydrationWarning>
                  {t(item.subtitleKey)}
                </h3>
              </div>

              {/* Title */}
              <h4 className="text-3xl serif mb-6 italic text-textColor" suppressHydrationWarning>
                {t(item.titleKey)}
              </h4>

              {/* Gold rule */}
              <div className="w-8 h-px bg-gold-accent mb-6" />

              {/* Description */}
              <p className="text-[13px] text-grayText leading-loose mb-10" suppressHydrationWarning>
                {t(item.descriptionKey)}
              </p>

              <a href={item.link} className="btn-cta" suppressHydrationWarning>
                {t(item.ctaKey)}
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
