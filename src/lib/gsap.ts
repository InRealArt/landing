// eslint-disable-next-line @typescript-eslint/no-explicit-any
let promise: Promise<{ gsap: any; ScrollTrigger: any }> | null = null

export function loadGsap() {
  if (!promise) {
    promise = Promise.all([
      import('gsap').then(m => m.gsap),
      import('gsap/ScrollTrigger').then(m => m.ScrollTrigger),
    ]).then(([gsap, ScrollTrigger]) => {
      gsap.registerPlugin(ScrollTrigger)
      return { gsap, ScrollTrigger }
    })
  }
  return promise
}
