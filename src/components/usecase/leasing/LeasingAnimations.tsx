'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function LeasingAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ease = 'cubic-bezier(0.19, 1, 0.22, 1)'
    const ctx = gsap.context(() => {

      // ── Hero : titre + bouton au chargement ──────────────────────────────
      const heroTitle = document.querySelector('[data-anim="leasing-hero-title"]')
      const heroBtn   = document.querySelector('[data-anim="leasing-hero-btn"]')
      const heroCols  = document.querySelectorAll('[data-anim="leasing-hero-col"]')

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

      // ── Advantages : titre slide-up + cartes stagger ─────────────────────
      const advTitle = document.querySelector('[data-anim="adv-title"]')
      const advCards = document.querySelectorAll('[data-anim="adv-card"]')

      if (advTitle) {
        gsap.fromTo(advTitle,
          { opacity: 0, y: 32 },
          {
            opacity: 1, y: 0, duration: 1.2, ease,
            scrollTrigger: { trigger: advTitle, start: 'top 82%', once: true }
          }
        )
      }
      if (advCards.length) {
        advCards.forEach((card, i) => {
          gsap.fromTo(card,
            { opacity: 0, y: 40 },
            {
              opacity: 1, y: 0, duration: 1.0, ease, delay: i * 0.12,
              scrollTrigger: { trigger: card, start: 'top 88%', once: true }
            }
          )
        })
      }

      // ── Benefits : items révélés ligne par ligne ──────────────────────────
      const benTitle = document.querySelector('[data-anim="ben-title"]')
      const benItems = document.querySelectorAll('[data-anim="ben-item"]')

      if (benTitle) {
        gsap.fromTo(benTitle,
          { opacity: 0, x: -32 },
          {
            opacity: 1, x: 0, duration: 1.2, ease,
            scrollTrigger: { trigger: benTitle, start: 'top 82%', once: true }
          }
        )
      }
      if (benItems.length) {
        benItems.forEach((item) => {
          gsap.fromTo(item,
            { opacity: 0, x: -24 },
            {
              opacity: 1, x: 0, duration: 1.0, ease,
              scrollTrigger: { trigger: item, start: 'top 86%', once: true }
            }
          )
        })
      }

      // ── Investment : image depuis la gauche, texte depuis la droite ───────
      const invImg  = document.querySelector('[data-anim="inv-image"]')
      const invText = document.querySelector('[data-anim="inv-text"]')

      if (invImg) {
        gsap.fromTo(invImg,
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0, duration: 1.3, ease,
            scrollTrigger: { trigger: invImg, start: 'top 80%', once: true }
          }
        )
      }
      if (invText) {
        gsap.fromTo(invText,
          { opacity: 0, x: 40 },
          {
            opacity: 1, x: 0, duration: 1.3, ease,
            scrollTrigger: { trigger: invText, start: 'top 80%', once: true }
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
