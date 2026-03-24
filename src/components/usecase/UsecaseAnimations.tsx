'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function UsecaseAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ease = 'cubic-bezier(0.19, 1, 0.22, 1)'
    const ctx = gsap.context(() => {

      // ── Hero : titre + subtitle + cards fade-up au chargement ─────────
      const heroTitle = document.querySelector('[data-anim="hero-title"]')
      const heroSubtitle = document.querySelector('[data-anim="hero-subtitle"]')
      const heroCards = document.querySelectorAll('[data-anim="hero-card"]')

      if (heroTitle) {
        gsap.fromTo(heroTitle,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1.4, ease, delay: 0.2 }
        )
      }
      if (heroSubtitle) {
        gsap.fromTo(heroSubtitle,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1.2, ease, delay: 0.6 }
        )
      }
      if (heroCards.length) {
        gsap.fromTo(heroCards,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1.0, ease, stagger: 0.12, delay: 0.9 }
        )
      }

      // ── Scenario sections : image + text slide in ─────────────────────
      document.querySelectorAll('[data-anim="scenario-section"]').forEach((section) => {
        const children = section.querySelectorAll(':scope > div > *')
        if (!children.length) return

        gsap.fromTo(children,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease,
            stagger: 0.14,
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              once: true,
            },
          }
        )
      })

      // ── Impact stats : stagger fade-up ───────────────────────────────
      const impactStats = document.querySelectorAll('[data-anim="impact-stat"]')
      if (impactStats.length) {
        gsap.fromTo(impactStats,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease,
            stagger: 0.16,
            scrollTrigger: {
              trigger: document.querySelector('[data-anim="impact-section"]'),
              start: 'top 80%',
              once: true,
            },
          }
        )
      }

      // ── CTA final : fade-up ───────────────────────────────────────────
      const ctaFinal = document.querySelector('[data-anim="cta-final"]')
      if (ctaFinal) {
        gsap.fromTo(ctaFinal,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease,
            scrollTrigger: {
              trigger: ctaFinal,
              start: 'top 88%',
              once: true,
            },
          }
        )
      }

      // ── FAQ : colonne gauche slide depuis la gauche ───────────────────
      const faqLeft = document.querySelector('[data-anim="faq-left"]')
      if (faqLeft) {
        gsap.fromTo(faqLeft,
          { opacity: 0, x: -40 },
          {
            opacity: 1,
            x: 0,
            duration: 1.2,
            ease,
            scrollTrigger: {
              trigger: faqLeft,
              start: 'top 80%',
              once: true,
            },
          }
        )
      }

      // ── FAQ : questions stagger fade-up ──────────────────────────────
      document.querySelectorAll('[data-anim="faq-question"]').forEach((q, i) => {
        gsap.fromTo(q,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease,
            scrollTrigger: {
              trigger: q,
              start: 'top 88%',
              once: true,
            },
            delay: i * 0.04,
          }
        )
      })

    })

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return null
}
