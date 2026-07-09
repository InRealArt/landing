'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Props {
  t: (key: string) => string
}

const UGC_FORMATS = ['still', 'reel', 'serie', 'pack'] as const

export default function AgenceUgc({ t }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        leftColRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: leftColRef.current, start: 'top 88%', once: true },
        }
      )

      if (tableRef.current) {
        const rows = tableRef.current.querySelectorAll<HTMLElement>('[data-row]')
        gsap.fromTo(
          rows,
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.6, ease: 'power3.out',
            stagger: 0.09,
            scrollTrigger: { trigger: tableRef.current, start: 'top 88%', once: true },
          }
        )
      }
    }, sectionRef)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  return (
    <section ref={sectionRef} className="bg-backgroundColor py-24 lg:py-32">
      <div className="max-w-screen-2xl mx-auto px-10">

        <div className="grid lg:grid-cols-12 gap-16 items-start">

          {/* Left column — description */}
          <div
            ref={leftColRef}
            className="lg:col-span-4 lg:sticky lg:top-32"
            style={{ opacity: 0 }}
          >
            <span className="section-number">
              {t('agence.ugc.eyebrow')}
            </span>
            <h2 className="serif text-4xl md:text-5xl font-light leading-tight text-textColor mb-6">
              {t('agence.ugc.title')}
            </h2>
            <div className="w-8 h-px bg-gold-accent mb-6" />
            <p className="text-sm text-grayText leading-loose montserrat">
              {t('agence.ugc.description')}
            </p>

            {/* Coming soon notice */}
            <div className="mt-10 border border-gold-accent/30 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-gold-accent montserrat mb-2">
                {t('agence.ugc.comingSoon')}
              </p>
              <p className="text-sm text-grayText montserrat leading-relaxed">
                {t('agence.ugc.comingSoonDetail')}
              </p>
            </div>
          </div>

          {/* Right column — format table */}
          <div className="lg:col-span-8">
            {/* Column headers */}
            <div className="grid grid-cols-3 gap-4 px-4 pb-4 border-b border-borderColor mb-0">
              <span className="text-xs uppercase tracking-[0.4em] text-grayText montserrat">Format</span>
              <span className="text-xs uppercase tracking-[0.4em] text-grayText montserrat">
                {t('agence.ugc.rights_label')}
              </span>
              <span className="text-xs uppercase tracking-[0.4em] text-grayText montserrat">
                {t('agence.ugc.delay_label')}
              </span>
            </div>

            <div ref={tableRef}>
              {UGC_FORMATS.map((key) => (
                <div
                  key={key}
                  data-row
                  className="grid grid-cols-3 gap-4 items-center px-4 py-6 border-b border-borderColor hover:bg-backgroundGrey transition-colors duration-200"
                  style={{ opacity: 0 }}
                >
                  {/* Format name */}
                  <div>
                    <p className="text-sm text-textColor montserrat font-medium leading-snug">
                      {t(`agence.ugc.formats.${key}.name`)}
                    </p>
                    <p className="text-sm text-grayText montserrat mt-1">
                      {t(`agence.ugc.formats.${key}.detail`)}
                    </p>
                  </div>

                  {/* Rights */}
                  <p className="text-sm text-grayText montserrat leading-relaxed">
                    {t(`agence.ugc.formats.${key}.rights`)}
                  </p>

                  {/* Delay */}
                  <p className="text-sm text-grayText montserrat">
                    {t(`agence.ugc.formats.${key}.delay`)}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
