/**
 * GSAP utilities — client-side only
 * Import this only in 'use client' components
 */

export type EaseType = 'power2.out' | 'power3.out' | 'expo.out' | 'back.out(1.7)' | 'none'

/** Standard fade-up config for section entries */
export const fadeUpConfig = {
  from: { opacity: 0, y: 60 },
  to: { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' as EaseType },
}

/** Stagger config for card grids */
export const staggerConfig = {
  stagger: 0.15,
  ease: 'power2.out' as EaseType,
  duration: 0.7,
}

/** ScrollTrigger default config */
export const scrollTriggerDefaults = {
  start: 'top 85%',
  toggleActions: 'play none none none',
}

/** Register GSAP plugins — call once at component mount */
export async function registerGsapPlugins() {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)
  return { gsap, ScrollTrigger }
}
