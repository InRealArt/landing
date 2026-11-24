'use client'

import { useEffect, useRef } from 'react'
import { loadGsap } from '@/lib/gsap'
import { prefersReducedMotion } from './anim'
import ThemeToggle from './ThemeToggle'

// Grain léger (bruit fractal SVG), posé en image de fond.
const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>\")"

/** Cadre commun (porte e-mail, accueil, questionnaire) : fond profond, halo or, grain, vignette, barre fine. */
export default function AuditFrame({ children }: { children: React.ReactNode }) {
  const haloRef = useRef<HTMLDivElement>(null)

  // Léger parallaxe du halo or qui suit la souris (souris uniquement, sans réduction de mouvement).
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let cancelled = false
    let cleanup = () => {}
    void loadGsap().then(({ gsap }) => {
      const halo = haloRef.current
      if (cancelled || !halo) return
      const moveX = gsap.quickTo(halo, 'x', { duration: 1.4, ease: 'power3.out' })
      const moveY = gsap.quickTo(halo, 'y', { duration: 1.4, ease: 'power3.out' })
      const onMove = (e: PointerEvent) => {
        moveX((e.clientX / window.innerWidth - 0.5) * 140)
        moveY((e.clientY / window.innerHeight - 0.5) * 100)
      }
      window.addEventListener('pointermove', onMove)
      cleanup = () => window.removeEventListener('pointermove', onMove)
    })
    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return (
    <div data-audit className="relative min-h-screen overflow-hidden bg-backgroundColor text-textColor">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgb(var(--background-rgb)) 0%, color-mix(in srgb, rgb(var(--background-rgb)) 94%, #b89c72) 100%)' }}
        />
        <div
          ref={haloRef}
          className="absolute -left-[20%] -top-[30%] h-[80vmax] w-[80vmax] rounded-full"
          style={{ background: 'radial-gradient(circle, rgb(184 156 114 / 0.16) 0%, rgb(184 156 114 / 0.05) 35%, transparent 65%)' }}
        />
        <div className="absolute inset-0 opacity-[0.07] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgb(var(--background-rgb) / 0.85) 100%)' }} />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between border-b border-gold-accent/25 px-4 py-2 sm:px-8">
          <p className="serif text-lg uppercase tracking-[0.5em] text-textColor sm:text-xl">InRealArt</p>
          <ThemeToggle />
        </header>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
