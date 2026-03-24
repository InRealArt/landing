'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/*
 * ArtistsAnimations — null-rendering Client Component that applies GSAP
 * entrance animations scoped to the /artists listing page.
 *
 * Targets:
 *   [data-anim="artists-hero-label"]      — section-number label above heading
 *   [data-anim="artists-hero-title"]      — main h1
 *   [data-anim="artists-hero-descriptor"] — sub-text below heading
 *   [data-anim="artist-card"]             — each artist card in the grid
 *
 * Pattern mirrors BlogAnimations.tsx exactly:
 *   – gsap.context() for scoped cleanup
 *   – ScrollTrigger registered inside useEffect (not at module level)
 *   – MutationObserver for cards injected after filter/page changes
 *   – once: true on all ScrollTrigger instances
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

      // ── Artist cards — ScrollTrigger with stagger ──────────────────────────
      // Uses the same MutationObserver pattern as BlogAnimations so cards
      // injected after a filter/pagination change are also animated.
      const animateCards = () => {
        const cards = document.querySelectorAll('[data-anim="artist-card"]:not([data-gsap-init])')
        if (!cards.length) return

        cards.forEach(card => {
          card.setAttribute('data-gsap-init', 'true')
        })

        // Stagger-group all newly visible cards into a single timeline
        // so they ripple in rather than all firing simultaneously.
        gsap.fromTo(
          Array.from(cards),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease,
            stagger: 0.07,
            scrollTrigger: {
              trigger: cards[0] as Element,
              start: 'top 88%',
              once: true,
            },
          }
        )
      }

      // Defer the initial pass until after React hydration is complete.
      // Running GSAP synchronously at mount mutates the DOM before React has
      // reconciled SSR HTML, causing a hydration mismatch on data-gsap-init
      // and the inline transform/opacity styles.
      const rafId = requestAnimationFrame(animateCards)

      // Observe dynamic changes (filter / pagination updates)
      const observer = new MutationObserver(animateCards)
      observer.observe(document.body, { childList: true, subtree: true })

      return () => {
        cancelAnimationFrame(rafId)
        observer.disconnect()
      }
    })

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return null
}
