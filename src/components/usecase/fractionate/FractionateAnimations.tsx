'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function FractionateAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ease = 'cubic-bezier(0.19, 1, 0.22, 1)'
    const ctx = gsap.context(() => {

      // ── Hero : titre + description + bouton ─────────────────────────────
      const heroTitle = document.querySelector('[data-anim="fract-hero-title"]')
      const heroDesc  = document.querySelector('[data-anim="fract-hero-desc"]')
      const heroBtn   = document.querySelector('[data-anim="fract-hero-btn"]')

      if (heroTitle) {
        gsap.fromTo(heroTitle,
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, duration: 1.4, ease, delay: 0.2 }
        )
      }
      if (heroDesc) {
        gsap.fromTo(heroDesc,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1.1, ease, delay: 0.6 }
        )
      }
      if (heroBtn) {
        gsap.fromTo(heroBtn,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 1.0, ease, delay: 0.9 }
        )
      }

      // ── Benefits : titre slide-up ────────────────────────────────────────
      const benTitle = document.querySelector('[data-anim="fract-ben-title"]')
      if (benTitle) {
        gsap.fromTo(benTitle,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0, duration: 1.2, ease,
            scrollTrigger: { trigger: benTitle, start: 'top 82%', once: true }
          }
        )
      }

      // ── Benefits : cartes stagger ────────────────────────────────────────
      const benCards = document.querySelectorAll('[data-anim="fract-ben-card"]')
      benCards.forEach((card, i) => {
        gsap.fromTo(card,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 1.0, ease, delay: i * 0.12,
            scrollTrigger: { trigger: card, start: 'top 88%', once: true }
          }
        )
      })

      // ── HowItWorks : section entière depuis le bas ───────────────────────
      const howSection = document.querySelector('[data-anim="fract-how"]')
      if (howSection) {
        gsap.fromTo(howSection,
          { opacity: 0, y: 50 },
          {
            opacity: 1, y: 0, duration: 1.3, ease,
            scrollTrigger: { trigger: howSection, start: 'top 80%', once: true }
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
