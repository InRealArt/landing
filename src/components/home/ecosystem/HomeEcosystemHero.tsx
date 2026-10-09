'use client'

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'
import {
  EDGES,
  FOCUS,
  GALLERY,
  INTRO_ORDER,
  LAYOUTS,
  NODES,
  SIGNATURES,
  TOUR,
  TOUR_STEP_MS,
  tk,
  type LayoutName,
  type NodeId,
  type PillarId,
  type SelectableId,
} from './ecosystemData'
import { arc, computeGeometry, dualPlacement, hubStyle, nodeStyle, pointStyle, selectionTagPoint, type Geometry } from './ecosystemGeometry'
import EcosystemPanel from './EcosystemPanel'
import EcosystemLightbox from './EcosystemLightbox'
import styles from './HomeEcosystemHero.module.css'

const SVG_NS = 'http://www.w3.org/2000/svg'
/** Doit rester aligné sur la container query `eco` du module CSS */
const WIDE_MIN_WIDTH = 860

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** "!" en préfixe = parcours inverse ; renvoie id d'arête → sens inverse */
const parseEdges = (list: string[]) =>
  new Map(list.map((s) => (s.startsWith('!') ? [s.slice(1), true] : [s, false]) as [string, boolean]))

const flag = (value: boolean) => (value ? 'true' : undefined)

export default function HomeEcosystemHero() {
  const { t, language } = useTranslation()
  // Ids SVG propres à l'instance ; sans « : » pour rester valides dans url(#…)
  const uid = useId().replace(/:/g, '')
  const sheenId = `eco-sheen-${uid}`
  const arcId = `eco-arc-${uid}`
  const titleId = `eco-title-${uid}`
  const stageId = `eco-stage-${uid}`

  const [layoutName, setLayoutName] = useState<LayoutName>('wide')
  const [measured, setMeasured] = useState<Geometry | null>(null)
  const [selected, setSelected] = useState<SelectableId | null>(null)
  const [preview, setPreview] = useState<SelectableId | null>(null)
  const [tourStep, setTourStep] = useState<number | null>(null)
  const [lbIndex, setLbIndex] = useState<number | null>(null)
  const [sigBroken, setSigBroken] = useState<Record<string, boolean>>({})
  // Les annonces vocales de la visite ne sont actives que si l'utilisateur l'a lancée
  const [tourByUser, setTourByUser] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tourBtnRef = useRef<HTMLButtonElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const nodeRefs = useRef<Partial<Record<SelectableId, HTMLButtonElement | null>>>({})
  const edgeRefs = useRef<Record<string, SVGPathElement | null>>({})
  const loopRef = useRef<SVGPathElement>(null)
  const particlesRef = useRef<SVGGElement>(null)
  const sheenRef = useRef<SVGLinearGradientElement>(null)
  const layoutNameRef = useRef(layoutName)
  const introDoneRef = useRef(false)
  const interactedRef = useRef(false)
  const liveRef = useRef({ selected, tourStep })

  // Synchronisé avant la mesure (les effets s'exécutent dans l'ordre de déclaration)
  useLayoutEffect(() => {
    layoutNameRef.current = layoutName
    liveRef.current = { selected, tourStep }
  })

  const L = LAYOUTS[layoutName]
  // Tracés mesurés pour une autre mise en page : ignorés jusqu'à la remesure
  const geom = measured?.layout === layoutName ? measured : null
  const touring = tourStep !== null
  const override = touring ? TOUR[tourStep] : null
  const focus = override ?? (preview ? FOCUS[preview] : selected ? FOCUS[selected] : null)
  const mark = override ? override.mark : selected
  const onNodes = focus ? new Set<SelectableId>(focus.nodes) : null
  const onEdges = focus ? parseEdges(focus.edges) : null
  // Clé stable des arêtes actives (vide = aucun focus, "f:" = focus sans arête)
  const edgesKey = focus ? `f:${focus.edges.join(',')}` : ''
  const ringDimmed = !!onEdges && !['r1', 'r2', 'r3'].some((id) => onEdges.has(id))

  /* ---------- Mesure et tracés ---------- */
  const measure = useCallback(() => {
    const container = containerRef.current
    const stage = stageRef.current
    if (!container || !stage) return
    const name: LayoutName = container.clientWidth < WIDE_MIN_WIDTH ? 'tall' : 'wide'
    // Le changement de mise en page relance la mesure au rendu suivant
    if (name !== layoutNameRef.current) {
      setLayoutName(name)
      return
    }
    const s = stage.getBoundingClientRect()
    if (!s.width) return
    const k = LAYOUTS[name].W / s.width
    setMeasured(
      computeGeometry(name, (id: NodeId) => {
        const r = nodeRefs.current[id]?.getBoundingClientRect()
        if (!r) return { x: 0, y: 0, w: 0, h: 0 }
        return { x: (r.left - s.left) * k, y: (r.top - s.top) * k, w: r.width * k, h: r.height * k }
      }),
    )
  }, [])

  // Le contenu des cartes change de hauteur avec la langue : on remesure
  useLayoutEffect(() => {
    const raf = requestAnimationFrame(measure)
    return () => cancelAnimationFrame(raf)
  }, [layoutName, language, measure])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let raf = 0
    const schedule = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    }
    const ro = new ResizeObserver(schedule)
    ro.observe(container)
    document.fonts?.ready.then(schedule)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [measure])

  /* ---------- Entrée en scène : les liaisons se tracent une seule fois ---------- */
  useEffect(() => {
    if (!geom || introDoneRef.current) return
    introDoneRef.current = true
    if (prefersReducedMotion()) return
    const paths = INTRO_ORDER.map((id) => edgeRefs.current[id]).filter((p): p is SVGPathElement => !!p)
    paths.forEach((p, i) => {
      const len = p.getTotalLength()
      const delay = i < 5 ? i * 70 : i < 8 ? 380 + (i - 5) * 160 : i < 11 ? 900 + (i - 8) * 90 : 300 + (i - 11) * 90
      p.style.strokeDasharray = `${len}`
      p.style.strokeDashoffset = `${len}`
      p.getBoundingClientRect()
      p.style.transition = `stroke-dashoffset .9s cubic-bezier(.6,0,.2,1) ${delay}ms`
      p.style.strokeDashoffset = '0'
    })
    // Pas d'annulation au remesurage : les pointillés doivent toujours être retirés
    setTimeout(() => {
      paths.forEach((p) => {
        p.style.strokeDasharray = ''
        p.style.strokeDashoffset = ''
        p.style.transition = ''
      })
    }, 2200)
  }, [geom])

  /* ---------- Particules et reflet de l'anneau ---------- */
  useEffect(() => {
    const group = particlesRef.current
    const stage = stageRef.current
    if (!group || !stage || !geom || prefersReducedMotion()) return

    const layout = LAYOUTS[layoutName]
    const speed = layout.dir === 'h' ? 150 : 105
    const particles: { el: SVGCircleElement; path: SVGPathElement; len: number; rev: boolean; phase: number; dur: number; idle: boolean }[] = []

    const add = (path: SVGPathElement | null, rev: boolean, phase: number, sel: boolean, idleDur?: number) => {
      if (!path) return
      const el = document.createElementNS(SVG_NS, 'circle')
      el.setAttribute('r', layout.dir === 'h' ? '3.6' : '3')
      el.setAttribute('class', styles.particle)
      if (sel) el.dataset.sel = 'true'
      group.appendChild(el)
      const len = path.getTotalLength()
      particles.push({ el, path, len, rev, phase, dur: idleDur ?? Math.max(1.4, len / speed), idle: idleDur !== undefined })
    }

    if (!edgesKey) {
      add(loopRef.current, false, 0, false, 16)
    } else {
      const active = parseEdges(edgesKey.slice(2).split(',').filter(Boolean))
      for (const [id, rev] of active) {
        const sel = !!EDGES.find((e) => e.id === id)?.sel
        add(edgeRefs.current[id], rev, 0, sel)
        add(edgeRefs.current[id], rev, 0.5, sel)
      }
    }

    let raf = 0
    const tick = (time: number) => {
      const s = time / 1000
      sheenRef.current?.setAttribute('gradientTransform', `rotate(${(s * 22) % 360} ${layout.ring.cx} ${layout.ring.cy})`)
      for (const p of particles) {
        const f = (s / p.dur + p.phase) % 1
        const pt = p.path.getPointAtLength((p.rev ? 1 - f : f) * p.len)
        p.el.setAttribute('cx', pt.x.toFixed(1))
        p.el.setAttribute('cy', pt.y.toFixed(1))
        p.el.style.opacity = p.idle ? '1' : String(Math.min(1, f * 6, (1 - f) * 6))
      }
      raf = requestAnimationFrame(tick)
    }

    // L'animation ne tourne que lorsque le schéma est à l'écran
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf)
      if (entry.isIntersecting) raf = requestAnimationFrame(tick)
    })
    io.observe(stage)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      group.replaceChildren()
    }
  }, [geom, edgesKey, layoutName])

  /* ---------- Visite guidée ---------- */
  const startTour = useCallback((byUser: boolean) => {
    setSelected(null)
    setPreview(null)
    setTourByUser(byUser)
    setTourStep(0)
  }, [])

  const stopTour = useCallback(() => setTourStep(null), [])

  useEffect(() => {
    if (tourStep === null) return
    const timer = setTimeout(() => setTourStep((s) => (s === null || s + 1 >= TOUR.length ? null : s + 1)), TOUR_STEP_MS)
    return () => clearTimeout(timer)
  }, [tourStep])

  // Lancement automatique, une seule fois, quand le schéma est bien visible
  useEffect(() => {
    const stage = stageRef.current
    if (!stage || prefersReducedMotion()) return
    let timer: ReturnType<typeof setTimeout> | undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.45) return
        io.disconnect()
        timer = setTimeout(() => {
          const { selected: sel, tourStep: step } = liveRef.current
          if (!interactedRef.current && !sel && step === null) startTour(false)
        }, 1700)
      },
      { threshold: [0.45] },
    )
    io.observe(stage)
    return () => {
      io.disconnect()
      clearTimeout(timer)
    }
  }, [startTour])

  /* ---------- Sélection ---------- */
  const select = useCallback((id: SelectableId | null) => {
    interactedRef.current = true
    setTourStep(null)
    setPreview(null)
    setSelected((cur) => (id && id === cur ? null : id))
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented || lbIndex !== null) return
      // Échap n'agit que depuis le hero (ou sans focus particulier), pas depuis le menu ou un formulaire
      const target = e.target as Node
      if (target !== document.body && !sectionRef.current?.contains(target)) return
      if (touring) stopTour()
      else if (selected) select(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [touring, selected, lbIndex, stopTour, select])

  // Aperçu du parcours au survol (souris uniquement)
  const previewHandlers = (id: SelectableId) => ({
    onPointerEnter: (e: React.PointerEvent) => {
      if (e.pointerType === 'mouse' && !touring && !selected) setPreview(id)
    },
    onPointerLeave: () => setPreview(null),
  })

  const nodeState = (id: SelectableId) => {
    const isSel = id === mark
    return {
      'data-selected': flag(isSel),
      'data-dim': flag(!!onNodes && !onNodes.has(id) && !isSel),
      'data-lit': flag(!!override && !!onNodes?.has(id) && !isSel),
      'aria-pressed': id === selected,
    }
  }

  const tourText = override ? t(override.textKey) : t(tk('tour.hint'))

  return (
    <section ref={sectionRef} className={`${styles.root} relative w-full bg-backgroundColor pt-headerSize`} aria-labelledby={titleId}>
      <div className="max-w-screen-2xl mx-auto px-5 sm:px-8 lg:px-10 pb-16 sm:pb-20 lg:pb-24">
        <div ref={containerRef} className={styles.scene}>
          <header className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] gap-x-16 gap-y-6 items-end mb-6 lg:mb-10">
            <div>
              <span className="section-number">{t(tk('eyebrow'))}</span>
              <h1
                id={titleId}
                className="serif font-light leading-[0.98] tracking-[-0.015em] text-textColor"
                style={{ fontSize: 'clamp(2.6rem, 6vw, 5.5rem)' }}
              >
                <span className="serif block">{t(tk('title'))}</span>
                <em className="block italic text-gold-accent">{t(tk('titleAccent'))}</em>
              </h1>
            </div>
            <p className="montserrat text-[0.95rem] sm:text-base leading-relaxed text-textColor/60 max-w-[48ch]">
              {t(tk('lede'))} <strong className="font-light text-textColor">{t(tk('ledeStrong'))}</strong>
            </p>
          </header>

          {/* Visite guidée */}
          <div className={`${styles.tour} mb-3 sm:mb-6`} data-playing={flag(touring)}>
            <button
              ref={tourBtnRef}
              type="button"
              className={styles.tourBtn}
              aria-controls={stageId}
              onClick={() => {
                interactedRef.current = true
                if (touring) stopTour()
                else startTour(true)
              }}
            >
              <span className={styles.tourIco} aria-hidden="true" />
              <span className={styles.tourLbl}>{t(tk(touring ? 'tour.stop' : 'tour.replay'))}</span>
            </button>
            {/* Zone d'annonce stable ; seul le texte intérieur est remonté pour le fondu */}
            <p className={styles.tourText} aria-live={touring && !tourByUser ? 'off' : 'polite'} aria-atomic="true">
              <span key={tourText} className={styles.tourTextInner}>
                {tourText}
              </span>
            </p>
            <ol className={styles.steps} aria-hidden="true" style={{ ['--dur' as string]: `${TOUR_STEP_MS / 1000}s` }}>
              {TOUR.map((step, i) => (
                <li key={step.textKey} data-state={tourStep === null ? undefined : i < tourStep ? 'done' : i === tourStep ? 'now' : undefined}>
                  <i />
                </li>
              ))}
            </ol>
          </div>

          {/* Schéma */}
          <div
            ref={stageRef}
            id={stageId}
            className={styles.stage}
            data-layout={layoutName}
            data-ready={flag(!!geom)}
          >
            <svg viewBox={`0 0 ${L.W} ${L.H}`} aria-hidden="true" focusable="false">
              <defs>
                <linearGradient
                  ref={sheenRef}
                  id={sheenId}
                  gradientUnits="userSpaceOnUse"
                  x1={L.ring.cx - L.ring.r - 10}
                  y1={L.ring.cy}
                  x2={L.ring.cx + L.ring.r + 10}
                  y2={L.ring.cy}
                  gradientTransform={`rotate(-35 ${L.ring.cx} ${L.ring.cy})`}
                >
                  {[0, 0.4, 0.5, 0.6, 1].map((offset) => (
                    <stop key={offset} offset={offset} className={offset === 0.5 ? styles.sheenGlint : styles.sheenBase} />
                  ))}
                </linearGradient>
              </defs>

              <g>
                <path ref={loopRef} fill="none" d={geom?.loop} />
                <circle className={styles.ringFrame} cx={L.ring.cx} cy={L.ring.cy} r={L.ring.r - 7} />
                <circle
                  className={`${styles.ringFrame} ${styles.ringSheen}`}
                  cx={L.ring.cx}
                  cy={L.ring.cy}
                  r={L.ring.r + 7}
                  stroke={`url(#${sheenId})`}
                />
              </g>

              <g>
                {EDGES.map((e) => {
                  const on = !!onEdges?.has(e.id)
                  return (
                    <path
                      key={e.id}
                      ref={(el) => {
                        edgeRefs.current[e.id] = el
                      }}
                      className={styles.edge}
                      d={geom?.edges[e.id]}
                      data-ring={flag(!!e.ring)}
                      data-sel={flag(!!e.sel)}
                      data-on={flag(on)}
                      data-dim={flag(!!onEdges && !on)}
                    />
                  )
                })}
              </g>

              <g>
                {geom?.tips.map((tip, i) => {
                  const on = !!onEdges?.has(tip.edge)
                  return (
                    <circle
                      key={`${tip.edge}-${i}`}
                      className={styles.tip}
                      cx={tip.x}
                      cy={tip.y}
                      r={L.dir === 'h' ? 3 : 2.6}
                      data-on={flag(on)}
                      data-dim={flag(!!onEdges && !on)}
                    />
                  )
                })}
              </g>

              <RingText id={arcId} layoutName={layoutName} text={t(L.text.key)} dimmed={ringDimmed} />

              <g ref={particlesRef} />
            </svg>

            {NODES.map((n) => {
              const label = t(tk(`nodes.${n.id}.label`))
              return (
                <button
                  key={n.id}
                  ref={(el) => {
                    nodeRefs.current[n.id] = el
                  }}
                  type="button"
                  className={`${styles.node} ${styles[n.kind]}`}
                  style={dualPlacement((layout) => nodeStyle(layout, n.id, n.kind))}
                  onClick={() => select(n.id)}
                  aria-label={n.sigs ? `${t(tk('diagram.signaturesAria'))} ${SIGNATURES.map((s) => s.name).join(', ')}` : undefined}
                  {...nodeState(n.id)}
                  {...previewHandlers(n.id)}
                >
                  <span className={styles.label}>{label}</span>
                  {n.sigs ? (
                    <span className={styles.sigs}>
                      <span className={styles.sigRow}>
                        {SIGNATURES.map((s) => (
                          <span key={s.initials} className={styles.sig} title={s.name}>
                            {s.initials}
                            {!sigBroken[s.initials] && (
                              <Image
                                src={s.src}
                                alt=""
                                fill
                                sizes="52px"
                                onError={() => setSigBroken((b) => ({ ...b, [s.initials]: true }))}
                              />
                            )}
                          </span>
                        ))}
                      </span>
                      <i className={styles.sigsLabel}>{t(tk('diagram.signatures'))}</i>
                    </span>
                  ) : (
                    <span className={styles.sub}>{t(tk(`nodes.${n.id}.sub`))}</span>
                  )}
                </button>
              )
            })}

            <button
              ref={(el) => {
                nodeRefs.current.hub = el
              }}
              type="button"
              className={styles.hub}
              style={dualPlacement(hubStyle)}
              onClick={() => select('hub')}
              {...nodeState('hub')}
              {...previewHandlers('hub')}
            >
              <span className={styles.hubName}>{t(tk('diagram.hubName'))}</span>
              <span className={styles.hubSub}>
                {t(tk('diagram.hubSub1'))}
                <br />
                {t(tk('diagram.hubSub2'))}
              </span>
            </button>

            {EDGES.filter((e) => e.sel).map((e) => (
              <p
                key={e.id}
                className={styles.selTag}
                style={dualPlacement((layout) => pointStyle(layout, ...selectionTagPoint(layout, e.from as PillarId, e.to as PillarId)))}
                data-dim={flag(!!onEdges && !onEdges.has(e.id))}
              >
                {t(tk('diagram.onSelection'))}
              </p>
            ))}

            {/* Mêmes légendes dans les deux mises en page, à des positions différentes */}
            {LAYOUTS.wide.caps.map(([key], i) => (
              <p
                key={key}
                className={styles.cap}
                style={dualPlacement((layout) => pointStyle(layout, layout.caps[i][1], layout.caps[i][2]))}
              >
                {t(key)}
              </p>
            ))}
          </div>

          <EcosystemPanel
            t={t}
            selected={selected}
            onSelect={(id) => {
              select(id)
              nodeRefs.current[id]?.focus({ preventScroll: true })
            }}
            onReset={() => {
              const previous = selected
              select(null)
              // Le contenu du panneau est remplacé : le focus revient sur la carte du schéma
              if (previous) nodeRefs.current[previous]?.focus({ preventScroll: true })
            }}
            onTour={() => {
              interactedRef.current = true
              startTour(true)
              tourBtnRef.current?.focus({ preventScroll: true })
              stageRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' })
            }}
            onView={setLbIndex}
          />
        </div>
      </div>

      <EcosystemLightbox t={t} visuals={GALLERY[selected ?? 'default']} index={lbIndex} onIndexChange={setLbIndex} />
    </section>
  )
}

/** Texte courbe le long de l'anneau */
function RingText({ id, layoutName, text, dimmed }: { id: string; layoutName: LayoutName; text: string; dimmed: boolean }) {
  const L = LAYOUTS[layoutName]
  const path = arc(L, L.text.from, L.text.to)
  return (
    <>
      <path id={id} d={path} fill="none" />
      <text className={styles.ringText} fontSize={L.text.size} dy={L.text.dy} style={{ opacity: dimmed ? 0.35 : 1 }}>
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </>
  )
}
