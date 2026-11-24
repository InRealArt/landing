import { loadGsap } from '@/lib/gsap'

export const EASE = 'power3.out'

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Secousse douce pour signaler une erreur. */
export function shake(el: Element | null): void {
  if (!el || prefersReducedMotion()) return
  void loadGsap().then(({ gsap }) => {
    gsap.fromTo(el, { x: 0 }, { keyframes: [{ x: -8 }, { x: 7 }, { x: -5 }, { x: 3 }, { x: 0 }], duration: 0.5, ease: 'power2.out' })
  })
}

/** Apparition d'un élément ajouté (ligne de tableau). */
export function revealRow(el: Element | null): void {
  if (!el || prefersReducedMotion()) return
  void loadGsap().then(({ gsap }) => {
    gsap.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: EASE, clearProps: 'transform,opacity' })
  })
}

/** Célébration discrète : une gerbe de points dorés qui s'élèvent depuis le conteneur. */
export function celebrate(container: HTMLElement | null): void {
  if (!container || prefersReducedMotion()) return
  void loadGsap().then(({ gsap }) => {
    const dots: HTMLElement[] = []
    for (let i = 0; i < 28; i++) {
      const dot = document.createElement('span')
      dot.setAttribute('aria-hidden', 'true')
      dot.className = 'pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-gold-accent'
      container.appendChild(dot)
      dots.push(dot)
    }
    gsap.fromTo(
      dots,
      { x: 0, y: 0, scale: 0, opacity: 1 },
      {
        x: () => gsap.utils.random(-160, 160),
        y: () => gsap.utils.random(-220, -40),
        scale: () => gsap.utils.random(0.6, 1.8),
        opacity: 0,
        duration: 1.6,
        ease: 'power2.out',
        stagger: 0.015,
        onComplete: () => dots.forEach((d) => d.remove()),
      },
    )
  })
}
