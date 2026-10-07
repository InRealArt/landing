'use client'

import Image from 'next/image'
import { forwardRef, useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import type { AgencyEventData } from '@/actions/agencyEventActions'
import { getSafeExternalUrl } from '@/utils/url'

const AUTO_ADVANCE_MS = 7000
const IMAGE_SIZES = '(min-width: 1024px) 30vw, (min-width: 640px) 70vw, 100vw'

interface Props {
  t: (key: string) => string
  events: AgencyEventData[]
}

/**
 * Événements de l'agence présentés comme une œuvre accrochée : image dans un
 * passe-partout à filet doré, suivie d'un cartel (nom, description, lien).
 *
 * Le ref pointe sur le conteneur racine ; la timeline d'entrée du hero pilote
 * les calques marqués `data-plate-*` (filet, rideau, média, reflet, cartel).
 * Ce composant gère les interactions : inclinaison 3D au survol et rideau or
 * entre deux événements.
 */
const AgenceHeroEvents = forwardRef<HTMLDivElement, Props>(function AgenceHeroEvents({ t, events }, rootRef) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const tiltZoneRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const sheenRef = useRef<HTMLDivElement>(null)
  const transitioning = useRef(false)
  const count = events.length
  const hasSeveral = count > 1

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // Inclinaison 3D et lumière de galerie qui suit le pointeur (souris uniquement)
  useEffect(() => {
    const zone = tiltZoneRef.current
    const card = cardRef.current
    const sheen = sheenRef.current
    if (!zone || !card || !sheen) return
    if (!window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return

    const rotateX = gsap.quickTo(card, 'rotationX', { duration: 0.7, ease: 'power3' })
    const rotateY = gsap.quickTo(card, 'rotationY', { duration: 0.7, ease: 'power3' })

    const onMove = (e: PointerEvent) => {
      const rect = zone.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      rotateY(px * 12)
      rotateX(-py * 9)
      sheen.style.setProperty('--mx', `${(px + 0.5) * 100}%`)
      sheen.style.setProperty('--my', `${(py + 0.5) * 100}%`)
    }
    const onEnter = () => gsap.to(sheen, { opacity: 1, duration: 0.5 })
    const onLeave = () => {
      rotateX(0)
      rotateY(0)
      gsap.to(sheen, { opacity: 0, duration: 0.6 })
    }

    zone.addEventListener('pointermove', onMove)
    zone.addEventListener('pointerenter', onEnter)
    zone.addEventListener('pointerleave', onLeave)
    return () => {
      zone.removeEventListener('pointermove', onMove)
      zone.removeEventListener('pointerenter', onEnter)
      zone.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf([card, sheen])
    }
  }, [])

  // Rideau or : couvre l'œuvre, change d'événement, puis se retire vers le haut
  const go = useCallback(
    (delta: number) => {
      const next = (active + delta + count) % count
      const curtain = curtainRef.current
      const media = mediaRef.current
      if (reducedMotion || !curtain || !media) {
        setActive(next)
        return
      }
      if (transitioning.current) return
      transitioning.current = true

      gsap
        .timeline({ onComplete: () => void (transitioning.current = false) })
        .set(curtain, { transformOrigin: '50% 100%' })
        .fromTo(curtain, { scaleY: 0 }, { scaleY: 1, duration: 0.55, ease: 'power4.in' })
        .add(() => setActive(next))
        .set(curtain, { transformOrigin: '50% 0%' }, '+=0.08')
        .to(curtain, { scaleY: 0, duration: 0.75, ease: 'power4.out' })
        .fromTo(media, { scale: 1.18 }, { scale: 1, duration: 1.2, ease: 'expo.out' }, '<')
    },
    [active, count, reducedMotion],
  )

  const current = events[active]

  return (
    <section
      ref={rootRef}
      aria-roledescription={hasSeveral ? 'carousel' : undefined}
      aria-label={t('agence.hero.eventsRegion')}
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false)
      }}
    >
      {/* Aura : les couleurs de l'œuvre diffusent dans le hero */}
      <div data-plate-aura className="pointer-events-none absolute -inset-10 sm:-inset-16 -z-10" aria-hidden="true">
        <div className="relative w-full h-full motion-safe:animate-aura-breathe">
          <Image
            key={current.id}
            src={current.imageUrl}
            alt=""
            fill
            sizes="240px"
            quality={75}
            className="object-cover blur-3xl saturate-150 opacity-30"
          />
        </div>
      </div>

      <div ref={tiltZoneRef} className="[perspective:1400px]">
        <div ref={cardRef} className="relative p-2.5 sm:p-3 [transform-style:preserve-3d] will-change-transform">
          {/* Passe-partout : le filet doré se trace à l'entrée */}
          <svg
            data-plate-frame
            className="pointer-events-none absolute inset-0 w-full h-full overflow-visible text-gold-accent/60"
            aria-hidden="true"
          >
            <rect
              x="0.5"
              y="0.5"
              width="100%"
              height="100%"
              pathLength={1}
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
              style={{ width: 'calc(100% - 1px)', height: 'calc(100% - 1px)' }}
            />
          </svg>

          <div data-plate-window className="relative aspect-[4/3] sm:aspect-[5/4] lg:aspect-square overflow-hidden bg-borderColor">
            <div ref={mediaRef} data-plate-media className="absolute inset-0">
              {events.map((event, i) => {
                const href = getSafeExternalUrl(event.linkToEvent)
                const isActive = i === active
                const layers = (
                  <>
                    {/* Fond : même image floutée pour combler sans rogner l'affiche */}
                    <Image
                      src={event.imageUrl}
                      alt=""
                      fill
                      sizes={IMAGE_SIZES}
                      quality={75}
                      aria-hidden="true"
                      className="object-cover scale-110 blur-2xl brightness-75 saturate-125 opacity-80"
                    />
                    <Image
                      src={event.imageUrl}
                      alt={event.name}
                      fill
                      sizes={IMAGE_SIZES}
                      quality={85}
                      priority={i === 0}
                      className="object-contain"
                    />
                  </>
                )

                return (
                  <div
                    key={event.id}
                    inert={!isActive}
                    aria-hidden={!isActive}
                    className={`absolute inset-0 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                  >
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" tabIndex={-1} className="absolute inset-0 block">
                        {layers}
                      </a>
                    ) : (
                      layers
                    )}
                  </div>
                )
              })}
            </div>

            {/* Lumière de galerie qui suit le pointeur */}
            <div
              ref={sheenRef}
              className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light"
              style={{
                background:
                  'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.7), rgba(255,255,255,0) 55%)',
              }}
              aria-hidden="true"
            />

            {/* Reflet qui traverse la vitre à la fin de l'entrée */}
            <div
              data-plate-glint
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 opacity-0"
              style={{
                background:
                  'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0) 100%)',
              }}
              aria-hidden="true"
            />

            {/* Rideau or : entrée et changement d'événement */}
            <div
              ref={curtainRef}
              data-plate-curtain
              className="pointer-events-none absolute inset-0 bg-gold-accent"
              style={{ transform: 'scaleY(0)' }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Cartel */}
      <div data-hero-cartel className="mt-5 sm:mt-6 pl-1">
        <p className="flex items-center gap-2.5 montserrat text-xs sm:text-sm text-gold-accent mb-2">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full rounded-full bg-gold-accent opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold-accent" />
          </span>
          {t('agence.hero.eventsLabel')}
        </p>

        {/* Toutes les légendes partagent la même cellule : la hauteur reste stable */}
        <div className="grid" aria-live={hasSeveral && paused ? 'polite' : 'off'}>
          {events.map((event, i) => {
            const href = getSafeExternalUrl(event.linkToEvent)
            const isActive = i === active
            return (
              <div
                key={event.id}
                inert={!isActive}
                aria-hidden={!isActive}
                className={`[grid-area:1/1] transition-opacity duration-500 ${
                  isActive ? 'opacity-100 delay-300' : 'opacity-0'
                }`}
              >
                <h2 className="serif italic text-2xl sm:text-3xl leading-tight text-textColor">{event.name}</h2>
                <p className="mt-2 montserrat text-sm leading-relaxed text-grayText line-clamp-3 max-w-[42ch]">
                  {event.description}
                </p>
                {href && (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/link mt-3 inline-flex items-center gap-1.5 montserrat text-sm text-textColor underline decoration-gold-accent/60 underline-offset-[6px] hover:decoration-gold-accent focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-gold-accent transition-colors"
                  >
                    {t('agence.hero.eventCta')}
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 12 12"
                      fill="none"
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
                    >
                      <path d="M3.5 8.5l5-5M4.5 3.5h4v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                )}
              </div>
            )
          })}
        </div>

        {hasSeveral && (
          <div className="mt-5 flex items-center gap-4">
            {/* Filet de progression : sa fin déclenche l'événement suivant */}
            <div className="relative h-px flex-1 bg-borderColor overflow-hidden" aria-hidden="true">
              {!reducedMotion && (
                <div
                  key={active}
                  className="absolute inset-0 bg-gold-accent origin-left"
                  style={{
                    animation: `hairline-progress ${AUTO_ADVANCE_MS}ms linear forwards`,
                    animationPlayState: paused ? 'paused' : 'running',
                  }}
                  onAnimationEnd={() => go(1)}
                />
              )}
            </div>

            <p className="serif text-lg tabular-nums text-textColor" aria-live="off">
              {active + 1}
              <span className="text-grayText"> / {count}</span>
            </p>

            <div className="flex">
              {[
                { delta: -1, label: t('agence.hero.eventPrev'), d: 'M10 3L5 8l5 5' },
                { delta: 1, label: t('agence.hero.eventNext'), d: 'M6 3l5 5-5 5' },
              ].map(({ delta, label, d }) => (
                <button
                  key={delta}
                  type="button"
                  onClick={() => go(delta)}
                  aria-label={label}
                  className="w-9 h-9 inline-flex items-center justify-center text-grayText hover:text-gold-accent focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold-accent transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d={d} stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
})

export default AgenceHeroEvents
