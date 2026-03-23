'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function PostDetailAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ease = 'cubic-bezier(0.19, 1, 0.22, 1)'
    const ctx = gsap.context(() => {

      // ── Article content: fade + subtle y on mount ────────────────────────
      const postContent = document.querySelector('[data-anim="post-content"]')
      if (postContent) {
        gsap.fromTo(postContent,
          { opacity: 0, y: 32 },
          { opacity: 1, y: 0, duration: 1.4, ease, delay: 0.2 }
        )
      }

      // ── Related post cards: stagger fade+y on scroll ─────────────────────
      const animateRelatedCards = () => {
        const cards = document.querySelectorAll('[data-anim="post-related-card"]:not([data-gsap-init])')
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

      animateRelatedCards()

      const observer = new MutationObserver(animateRelatedCards)
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
