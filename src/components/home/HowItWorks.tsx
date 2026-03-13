'use client'
import { useEffect, useRef } from 'react'
import { useLanguageStore } from '@/store/languageStore';
import { loadGsap } from '@/lib/gsap'

export default function HowItWorks() {
  const t = useLanguageStore(state => state.t);
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  const items = [
    {
      name: t('home.howItWorks.items.bridge.title'),
      description: t('home.howItWorks.items.bridge.description'),
      step: '01',
    },
    {
      name: t('home.howItWorks.items.token.title'),
      description: t('home.howItWorks.items.token.description'),
      step: '02',
    },
    {
      name: t('home.howItWorks.items.art.title'),
      description: t('home.howItWorks.items.art.description'),
      step: '03',
    },
  ]

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    const initAnimations = async () => {
      const { gsap, ScrollTrigger } = await loadGsap()

      ctx = gsap.context(() => {
        // Header fade-up
        if (headerRef.current) {
          gsap.fromTo(
            headerRef.current.children,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: 'power3.out',
              stagger: 0.1,
              scrollTrigger: {
                trigger: headerRef.current,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            }
          )
        }

        // Cards stagger with slight rotate for depth
        if (cardsRef.current) {
          const cards = cardsRef.current.querySelectorAll('.hiw-card')
          gsap.fromTo(
            cards,
            { opacity: 0, y: 80, rotateX: 8 },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.2,
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 80%',
                toggleActions: 'play none none none',
              },
            }
          )

          // Step number count-up
          const stepEls = cardsRef.current.querySelectorAll<HTMLElement>('.hiw-step')
          gsap.fromTo(
            stepEls,
            { opacity: 0, scale: 0.5 },
            {
              opacity: 0.12,
              scale: 1,
              duration: 0.6,
              ease: 'back.out(1.7)',
              stagger: 0.2,
              scrollTrigger: {
                trigger: cardsRef.current,
                start: 'top 80%',
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
    <section ref={sectionRef} className="w-full max-w-90 xl:max-w-screen-xl m-auto mt-36">
      <div ref={headerRef}>
        <h2 className="text-4xl sm:text-5xl md:text-7xl serif italic leading-tight text-center opacity-0">
          {t('home.howItWorks.title')}
        </h2>
        <label className="mt-4 block text-center opacity-0">
          {t('home.howItWorks.subtitle')}
        </label>
      </div>
      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-10" style={{ perspective: '1000px' }}>
        {items.map((item, index) => (
          <div
            key={index}
            className="hiw-card relative p-4 lg:p-8 border rounded-lg bg-cardBackground flex flex-col overflow-hidden opacity-0"
          >
            {/* Big step number in background */}
            <span className="hiw-step absolute -bottom-4 -right-2 text-[120px] font-bold unbounded leading-none select-none pointer-events-none opacity-0">
              {item.step}
            </span>
            <h3 className="text-2xl lg:text-3xl unbounded overflow-hidden text-ellipsis relative z-10">
              {item.name}
            </h3>
            <label className="my-4 block relative z-10">{item.description}</label>
          </div>
        ))}
      </div>
    </section>
  );
}
