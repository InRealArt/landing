'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function SimulatorsAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ease = 'cubic-bezier(0.19, 1, 0.22, 1)'
    const ctx = gsap.context(() => {

      // ── Hero : titre + subtitle au chargement ────────────────────────────
      const heroTitle = document.querySelector('[data-anim="sim-hero-title"]')
      const heroSub   = document.querySelector('[data-anim="sim-hero-sub"]')

      if (heroTitle) {
        gsap.fromTo(heroTitle,
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, duration: 1.4, ease, delay: 0.2 }
        )
      }
      if (heroSub) {
        gsap.fromTo(heroSub,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.1, ease, delay: 0.6 }
        )
      }

      // ── Titres de sections : fade + x depuis la gauche au scroll ─────────
      const sectionHeaders = document.querySelectorAll('[data-anim="sim-section-header"]')
      sectionHeaders.forEach(el => {
        gsap.fromTo(el,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0, duration: 1.1, ease,
            scrollTrigger: { trigger: el, start: 'top 85%', once: true }
          }
        )
      })

      // ── Cards : stagger fade + y au scroll ───────────────────────────────
      const animateCards = () => {
        const cards = document.querySelectorAll('[data-anim="sim-card"]:not([data-gsap-init])')
        cards.forEach((card, i) => {
          card.setAttribute('data-gsap-init', 'true')
          gsap.fromTo(card,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 0.9, ease,
              delay: (i % 3) * 0.08,
              scrollTrigger: { trigger: card, start: 'top 88%', once: true }
            }
          )
        })
      }

      animateCards()

      // ── CTA final : fade + y au scroll ───────────────────────────────────
      const cta = document.querySelector('[data-anim="sim-cta"]')
      if (cta) {
        gsap.fromTo(cta,
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 1, ease,
            scrollTrigger: { trigger: cta, start: 'top 90%', once: true }
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
