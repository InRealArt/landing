'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function FaqAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ease = 'cubic-bezier(0.19, 1, 0.22, 1)'
    const ctx = gsap.context(() => {

      // ── Hero : label → titre → description ───────────────────────────────
      const label = document.querySelector('[data-anim="faq-hero-label"]')
      const title = document.querySelector('[data-anim="faq-hero-title"]')
      const desc  = document.querySelector('[data-anim="faq-hero-desc"]')

      if (label) gsap.fromTo(label,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, ease, delay: 0.1 }
      )
      if (title) gsap.fromTo(title,
        { opacity: 0, y: 48 },
        { opacity: 1, y: 0, duration: 1.4, ease, delay: 0.25 }
      )
      if (desc) gsap.fromTo(desc,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.0, ease, delay: 0.55 }
      )

      // ── Tabs : fade-up groupé ─────────────────────────────────────────────
      const tabs = document.querySelector('[data-anim="faq-tabs"]')
      if (tabs) gsap.fromTo(tabs,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.9, ease, delay: 0.7 }
      )

      // ── Accordéon : stagger au scroll ─────────────────────────────────────
      const rows = gsap.utils.toArray<HTMLElement>('[data-anim="faq-row"]')
      if (rows.length) {
        gsap.fromTo(rows,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease,
            stagger: 0.07,
            scrollTrigger: {
              trigger: rows[0],
              start: 'top 84%',
              once: true,
            },
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
