'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Props {
  t: (key: string) => string
}

export default function AgenceCta({ t }: Props) {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      if (contentRef.current) {
        const children = contentRef.current.querySelectorAll<HTMLElement>(':scope > *')
        gsap.fromTo(
          children,
          { opacity: 0, y: 24, scale: 0.97 },
          {
            opacity: 1, y: 0, scale: 1,
            duration: 0.8, ease: 'power3.out',
            stagger: 0.12,
            scrollTrigger: { trigger: contentRef.current, start: 'top 88%', once: true },
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
    <section
      ref={sectionRef}
      className="bg-backgroundGrey border-t border-borderColor py-24 lg:py-32 overflow-hidden relative"
    >
      {/* Decorative large italic serif — bottom right, well below content */}
      <div
        className="absolute bottom-0 right-0 select-none pointer-events-none overflow-hidden leading-none"
        aria-hidden="true"
      >
        <span
          className="text-textColor/[0.04] leading-none whitespace-nowrap block"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontStyle: 'italic',
            fontSize: 'clamp(60px, 10vw, 130px)',
            transform: 'translateY(20%)',
          }}
        >
          In Real Art
        </span>
      </div>

      <div ref={contentRef} className="relative z-10 max-w-screen-2xl mx-auto px-10 text-center">
        <span className="section-number inline-block" style={{ opacity: 0 }}>
          {t('agence.cta.eyebrow')}
        </span>

        <h2
          className="serif text-5xl md:text-7xl lg:text-8xl font-light leading-none text-textColor mt-4 mb-4"
          style={{ opacity: 0 }}
        >
          {t('agence.cta.title')}
          <br />
          <em className="italic text-gold-accent" style={{ fontStyle: 'italic' }}>
            {t('agence.cta.titleAccent')}
          </em>
        </h2>

        <div className="flex justify-center mb-12" style={{ opacity: 0 }}>
          <div className="w-16 h-px bg-gold-accent" />
        </div>

        <p
          className="text-[12px] uppercase tracking-[0.25em] text-grayText montserrat leading-loose max-w-xl mx-auto mb-12"
          style={{ opacity: 0 }}
        >
          {t('agence.cta.description')}
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ opacity: 0 }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-textColor text-backgroundColor px-10 py-4 text-[10px] uppercase tracking-[0.4em] montserrat hover:bg-gold-accent transition-colors duration-300"
          >
            {t('agence.cta.button')}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>

          <Link
            href="/contact"
            className="inline-flex items-center gap-3 border border-borderColor text-grayText px-10 py-4 text-[10px] uppercase tracking-[0.4em] montserrat hover:border-gold-accent hover:text-textColor transition-all duration-300"
          >
            {t('agence.cta.secondaryButton')}
          </Link>
        </div>
      </div>
    </section>
  )
}
