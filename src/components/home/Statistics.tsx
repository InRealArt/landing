'use client'
import { useEffect, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { loadGsap } from '@/lib/gsap'

const Statistics = () => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  const stats = [
    {
      key: 'artworks',
      index: '01.',
      number: t('home.statistics.items.artworks.number'),
      label: t('home.statistics.items.artworks.label')
    },
    {
      key: 'artists',
      index: '02.',
      number: t('home.statistics.items.artists.number'),
      label: t('home.statistics.items.artists.label')
    },
    {
      key: 'museum',
      index: '03.',
      number: t('home.statistics.items.museum.number'),
      label: t('home.statistics.items.museum.label')
    },
    {
      key: 'creators',
      index: '04.',
      number: t('home.statistics.items.creators.number'),
      label: t('home.statistics.items.creators.label')
    },
  ]

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    const initAnimations = async () => {
      const { gsap, ScrollTrigger } = await loadGsap()

      ctx = gsap.context(() => {
        // Header reveal
        if (headerRef.current) {
          const headerChildren = headerRef.current.querySelectorAll('.header-reveal')
          gsap.fromTo(
            headerChildren,
            { opacity: 0, y: 30 },
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

        // Cards stagger reveal
        if (cardsRef.current) {
          const cards = cardsRef.current.querySelectorAll('.stat-card')
          gsap.fromTo(
            cards,
            { opacity: 0, y: 60, scale: 0.98 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: 'power2.out',
              stagger: 0.15,
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          )

          // Gold rule width reveal — staggered after cards
          const rules = cardsRef.current.querySelectorAll('.stat-rule')
          gsap.fromTo(
            rules,
            { scaleX: 0, transformOrigin: 'left center' },
            {
              scaleX: 1,
              duration: 0.6,
              ease: 'power2.out',
              stagger: 0.15,
              delay: 0.3,
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          )

          // Number counter animation
          const numberEls = cardsRef.current.querySelectorAll<HTMLElement>('.stat-number')
          numberEls.forEach((el) => {
            const raw = el.dataset.raw ?? ''
            const numeric = parseFloat(raw.replace(/[^\d.]/g, ''))
            const suffix = raw.replace(/^[\d.]+/, '')
            if (!isNaN(numeric) && numeric > 0) {
              ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter: () => {
                  const obj = { val: 0 }
                  gsap.to(obj, {
                    val: numeric,
                    duration: 1.8,
                    ease: 'power2.out',
                    onUpdate: () => {
                      el.textContent = Math.round(obj.val).toLocaleString() + suffix
                    },
                  })
                },
              })
            }
          })
        }
      }, sectionRef)
    }

    initAnimations()

    return () => ctx?.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="w-full bg-backgroundGrey py-24 lg:py-36 border-t border-borderColor"
    >
      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4">

        {/* Section header */}
        <div ref={headerRef} className="grid lg:grid-cols-12 gap-8 mb-20 lg:mb-28">
          <div className="lg:col-span-7">
            {/* Eyebrow */}
            <span className="header-reveal block text-[0.6rem] uppercase tracking-[0.5em] text-grayText mb-6 opacity-0" suppressHydrationWarning>
              {t('home.statistics.description')}
            </span>
            {/* Title */}
            <h2 className="header-reveal bricolage-grotesque text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight text-textColor opacity-0" suppressHydrationWarning>
              {t('home.statistics.title')}
            </h2>
          </div>
        </div>

        {/* Stats grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.key}
              className="stat-card group border-t border-borderColor pt-10 pb-10 md:pb-12 md:pr-12 opacity-0"
            >
              {/* Sequential index — gold, large, italic */}
              <span className="bricolage-grotesque text-4xl italic font-light text-gold-accent mb-8 block leading-none">
                {stat.index}
              </span>

              {/* Stat number — editorial scale, gold, light weight */}
              <p
                className="stat-number bricolage-grotesque text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light leading-none text-gold-accent mb-6"
                data-raw={stat.number}
                suppressHydrationWarning
              >
                {stat.number}
              </p>

              {/* Gold rule — expands on hover */}
              <div className="stat-rule w-8 h-px bg-gold-accent mb-5 transition-all duration-500 ease-out group-hover:w-16" />

              {/* Label — small uppercase tracking */}
              <p className="text-sm uppercase tracking-[0.4em] text-grayText leading-relaxed max-w-full" suppressHydrationWarning>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Statistics;
