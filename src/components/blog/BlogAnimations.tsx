'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function BlogAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ease = 'cubic-bezier(0.19, 1, 0.22, 1)'
    const ctx = gsap.context(() => {

      // ── Hero : titre + subtitle au chargement ────────────────────────────
      const heroTitle    = document.querySelector('[data-anim="blog-hero-title"]')
      const heroSubtitle = document.querySelector('[data-anim="blog-hero-subtitle"]')

      if (heroTitle) {
        gsap.fromTo(heroTitle,
          { opacity: 0, y: 48 },
          { opacity: 1, y: 0, duration: 1.4, ease, delay: 0.2 }
        )
      }
      if (heroSubtitle) {
        gsap.fromTo(heroSubtitle,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 1.1, ease, delay: 0.6 }
        )
      }

      // ── Categories : stagger x depuis la gauche ──────────────────────────
      const categoryLinks = document.querySelectorAll('[data-anim="blog-category"]')
      if (categoryLinks.length) {
        gsap.fromTo(categoryLinks,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease,
            stagger: 0.04,
            scrollTrigger: {
              trigger: categoryLinks[0],
              start: 'top 85%',
              once: true,
            }
          }
        )
      }

      // ── Featured post : image depuis gauche, texte depuis droite ─────────
      const featImg  = document.querySelector('[data-anim="blog-featured-img"]')
      const featText = document.querySelector('[data-anim="blog-featured-text"]')

      if (featImg) {
        gsap.fromTo(featImg,
          { opacity: 0, x: -40 },
          {
            opacity: 1, x: 0, duration: 1.3, ease,
            scrollTrigger: { trigger: featImg, start: 'top 80%', once: true }
          }
        )
      }
      if (featText) {
        gsap.fromTo(featText,
          { opacity: 0, x: 40 },
          {
            opacity: 1, x: 0, duration: 1.3, ease,
            scrollTrigger: { trigger: featText, start: 'top 80%', once: true }
          }
        )
      }

      // ── Blog cards : observer chaque nouvelle carte au scroll ────────────
      // On utilise un MutationObserver car les cartes peuvent être chargées async
      const animateCards = () => {
        const cards = document.querySelectorAll('[data-anim="blog-card"]:not([data-gsap-init])')
        cards.forEach((card) => {
          card.setAttribute('data-gsap-init', 'true')
          gsap.fromTo(card,
            { opacity: 0, y: 30 },
            {
              opacity: 1, y: 0, duration: 0.9, ease,
              scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                once: true,
              }
            }
          )
        })
      }

      // Première passe immédiate
      animateCards()

      // Observer les nouvelles cartes injectées dynamiquement
      const observer = new MutationObserver(animateCards)
      observer.observe(document.body, { childList: true, subtree: true })

      return () => observer.disconnect()

    })

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return null
}
