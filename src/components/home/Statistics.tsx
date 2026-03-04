'use client'
import { useEffect, useRef } from 'react'
import { useLanguageStore } from "@/store/languageStore";

const Statistics = () => {
  const t = useLanguageStore(state => state.t);
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  const stats = [
    {
      key: 'artists',
      number: t('home.statistics.items.artists.number'),
      label: t('home.statistics.items.artists.label')
    },
    {
      key: 'works',
      number: t('home.statistics.items.works.number'),
      label: t('home.statistics.items.works.label')
    },
    {
      key: 'ranking',
      number: t('home.statistics.items.ranking.number'),
      label: t('home.statistics.items.ranking.label')
    }
  ]

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let ctx: any

    const initAnimations = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // Title reveal
        if (titleRef.current) {
          gsap.fromTo(
            titleRef.current,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: titleRef.current,
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
            { opacity: 0, y: 60, scale: 0.95 },
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
    <section ref={sectionRef} className="w-full max-w-90 xl:max-w-screen-xl m-auto mt-36">
      <h2 ref={titleRef} className="text-4xl md:text-5xl bricolage-grotesque opacity-0">
        {t('home.statistics.title')}
      </h2>
      <div ref={cardsRef} className="flex flex-wrap gap-6 mt-10">
        {stats.map((stat) => (
          <div key={stat.key} className="stat-card flex-1 min-w-[280px] p-6 lg:p-10 border rounded-lg bg-cardBackground opacity-0">
            <p
              className="stat-number text-4xl lg:text-6xl bricolage-grotesque font-semibold"
              data-raw={stat.number}
            >
              {stat.number}
            </p>
            <label className="mt-4 block text-lg">{stat.label}</label>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Statistics;
