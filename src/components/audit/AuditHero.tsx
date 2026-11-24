'use client'

import { useEffect, useRef, useState } from 'react'
import { loadGsap } from '@/lib/gsap'
import { prefersReducedMotion } from './anim'

interface Props {
  /** Lignes du titre, chacune révélée par un masque. Utiliser <em> pour l'italique doré. */
  titleLines: React.ReactNode[]
  subtitle?: React.ReactNode
  children?: React.ReactNode
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  )
}

/** Hero éditorial : mention confidentielle, filet or, titre Cormorant en lignes masquées, sous-titre, contenu. */
export default function AuditHero({ titleLines, subtitle, children }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    let ctx: { revert: () => void } | undefined
    void loadGsap()
      .then(({ gsap }) => {
        const root = rootRef.current
        if (cancelled || !root) return
        if (!prefersReducedMotion()) {
          ctx = gsap.context(() => {
            gsap
              .timeline({ defaults: { ease: 'power4.out' } })
              .from('[data-rule]', { scaleX: 0, transformOrigin: 'left center', duration: 1.2 }, 0)
              .from('[data-line]', { yPercent: 115, duration: 1.1, stagger: 0.12 }, 0.15)
              .from('[data-fade]', { opacity: 0, y: 18, duration: 0.9, stagger: 0.09, clearProps: 'all' }, 0.55)
          }, root)
        }
        setReady(true)
      })
      .catch(() => setReady(true))
    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [])

  return (
    <div ref={rootRef} style={{ visibility: ready ? 'visible' : 'hidden' }} className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-5xl flex-col justify-center px-4 py-12 sm:px-8 sm:py-16">
      <p data-fade className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gold-accent">
        <LockIcon />
        Audit de carrière · Confidentiel
      </p>
      <div data-rule className="mb-8 h-px w-full max-w-md bg-gold-accent sm:mb-10" />
      <h1
        tabIndex={-1}
        data-step-heading
        className="serif mb-6 text-[clamp(2.75rem,10vw,6.5rem)] font-light leading-[1.02] text-textColor outline-none"
      >
        {titleLines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.12em] [font-family:inherit]">
            <span data-line className="block [font-family:inherit]">{line}</span>
          </span>
        ))}
      </h1>
      {subtitle && <div data-fade className="mb-10 max-w-2xl text-base leading-relaxed text-textColor/80 sm:text-lg">{subtitle}</div>}
      <div data-fade>{children}</div>
    </div>
  )
}
