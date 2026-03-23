'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function LendingAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ease = 'cubic-bezier(0.19, 1, 0.22, 1)'
    const ctx = gsap.context(() => {

      // ── Hero : titre + description + bouton ─────────────────────────────
      const heroTitle = document.querySelector('[data-anim="lending-hero-title"]')
      const heroDesc  = document.querySelector('[data-anim="lending-hero-desc"]')
      const heroBtn   = document.querySelector('[data-anim="lending-hero-btn"]')

      if (heroTitle) gsap.fromTo(heroTitle,
        { opacity: 0, y: 48 },
        { opacity: 1, y: 0, duration: 1.4, ease, delay: 0.2 }
      )
      if (heroDesc) gsap.fromTo(heroDesc,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 1.1, ease, delay: 0.6 }
      )
      if (heroBtn) gsap.fromTo(heroBtn,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 1.0, ease, delay: 0.9 }
      )

      // ── Advantages : texte depuis gauche, image depuis droite ────────────
      const advText = document.querySelector('[data-anim="lending-adv-text"]')
      const advImg  = document.querySelector('[data-anim="lending-adv-img"]')

      if (advText) gsap.fromTo(advText,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 1.2, ease,
          scrollTrigger: { trigger: advText, start: 'top 80%', once: true } }
      )
      if (advImg) gsap.fromTo(advImg,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 1.2, ease,
          scrollTrigger: { trigger: advImg, start: 'top 80%', once: true } }
      )

      // ── Solutions : image depuis gauche, texte depuis droite ────────────
      const solImg  = document.querySelector('[data-anim="lending-sol-img"]')
      const solText = document.querySelector('[data-anim="lending-sol-text"]')

      if (solImg) gsap.fromTo(solImg,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 1.2, ease,
          scrollTrigger: { trigger: solImg, start: 'top 80%', once: true } }
      )
      if (solText) gsap.fromTo(solText,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 1.2, ease,
          scrollTrigger: { trigger: solText, start: 'top 80%', once: true } }
      )

      // ── Alternative : fade-up centré ────────────────────────────────────
      const altTitle = document.querySelector('[data-anim="lending-alt-title"]')
      if (altTitle) gsap.fromTo(altTitle,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.4, ease,
          scrollTrigger: { trigger: altTitle, start: 'top 78%', once: true } }
      )

      // ── ForWho : texte depuis gauche, image depuis droite ───────────────
      const forWhoText = document.querySelector('[data-anim="lending-forwho-text"]')
      const forWhoImg  = document.querySelector('[data-anim="lending-forwho-img"]')

      if (forWhoText) gsap.fromTo(forWhoText,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, duration: 1.2, ease,
          scrollTrigger: { trigger: forWhoText, start: 'top 80%', once: true } }
      )
      if (forWhoImg) gsap.fromTo(forWhoImg,
        { opacity: 0, x: 40 },
        { opacity: 1, x: 0, duration: 1.2, ease,
          scrollTrigger: { trigger: forWhoImg, start: 'top 80%', once: true } }
      )

    })

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return null
}
