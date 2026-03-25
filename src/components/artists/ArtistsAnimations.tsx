'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/*
 * ArtistsAnimations — null-rendering Client Component that applies GSAP
 * entrance animations scoped to the /artists listing page.
 *
 * Targets (hero only — the mosaic and roster use CSS transitions):
 *   [data-anim="artists-hero-label"]      — section-number label above heading
 *   [data-anim="artists-hero-title"]      — main h1
 *   [data-anim="artists-hero-descriptor"] — sub-text below heading
 */
export default function ArtistsAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    // Luxury editorial easing — long tail, no bounce
    const ease = 'cubic-bezier(0.19, 1, 0.22, 1)'

    const ctx = gsap.context(() => {

      // ── Hero label ────────────────────────────────────────────────────────
      const heroLabel = document.querySelector('[data-anim="artists-hero-label"]')
      if (heroLabel) {
        gsap.fromTo(heroLabel,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.9, ease, delay: 0.1 }
        )
      }

      // ── Hero title ────────────────────────────────────────────────────────
      const heroTitle = document.querySelector('[data-anim="artists-hero-title"]')
      if (heroTitle) {
        gsap.fromTo(heroTitle,
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, duration: 1.4, ease, delay: 0.25 }
        )
      }

      // ── Hero descriptor ───────────────────────────────────────────────────
      const heroDescriptor = document.querySelector('[data-anim="artists-hero-descriptor"]')
      if (heroDescriptor) {
        gsap.fromTo(heroDescriptor,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1.1, ease, delay: 0.55 }
        )
      }

    })

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return null
}
