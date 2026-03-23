'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function CompaniesAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ease = 'cubic-bezier(0.19, 1, 0.22, 1)'
    const ctx = gsap.context(() => {

      // ── Hero : titre + bouton + colonnes ────────────────────────────────
      const heroTitle = document.querySelector('[data-anim="companies-hero-title"]')
      const heroBtn   = document.querySelector('[data-anim="companies-hero-btn"]')
      const heroCols  = document.querySelectorAll('[data-anim="companies-hero-col"]')

      if (heroTitle) {
        gsap.fromTo(heroTitle,
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, duration: 1.4, ease, delay: 0.2 }
        )
      }
      if (heroBtn) {
        gsap.fromTo(heroBtn,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.0, ease, delay: 0.7 }
        )
      }
      if (heroCols.length) {
        gsap.fromTo(heroCols,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1.0, ease, stagger: 0.14, delay: 1.0 }
        )
      }

      // ── Possibilities : titre slide-up ───────────────────────────────────
      const possTitle = document.querySelector('[data-anim="poss-title"]')
      if (possTitle) {
        gsap.fromTo(possTitle,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0, duration: 1.2, ease,
            scrollTrigger: { trigger: possTitle, start: 'top 82%', once: true }
          }
        )
      }

      // ── Cards : stagger fade-up ──────────────────────────────────────────
      const possCards = document.querySelectorAll('[data-anim="poss-card"]')
      possCards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 1.0, ease, delay: i * 0.12,
            scrollTrigger: { trigger: card, start: 'top 88%', once: true }
          }
        )
      })

      // ── Process block : slide depuis le bas ──────────────────────────────
      const possProcess = document.querySelector('[data-anim="poss-process"]')
      if (possProcess) {
        gsap.fromTo(possProcess,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 1.3, ease,
            scrollTrigger: { trigger: possProcess, start: 'top 80%', once: true }
          }
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
