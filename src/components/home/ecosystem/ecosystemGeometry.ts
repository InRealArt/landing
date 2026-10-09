import type { CSSProperties } from 'react'
import { EDGES, LAYOUTS, type Layout, type LayoutName, type NodeId, type NodeKind, type PillarId } from './ecosystemData'

export interface Box {
  x: number
  y: number
  w: number
  h: number
}

export interface Geometry {
  layout: LayoutName
  edges: Record<string, string>
  tips: { edge: string; x: number; y: number }[]
  loop: string
}

const rad = (a: number) => (a * Math.PI) / 180
const pct = (v: number, total: number) => `${(v / total) * 100}%`

export function onRing(L: Layout, angle: number): [number, number] {
  return [L.ring.cx + L.ring.r * Math.cos(rad(angle)), L.ring.cy + L.ring.r * Math.sin(rad(angle))]
}

export function arc(L: Layout, a1: number, a2: number, r = L.ring.r, forceSweep?: 0 | 1) {
  const x1 = L.ring.cx + r * Math.cos(rad(a1))
  const y1 = L.ring.cy + r * Math.sin(rad(a1))
  const x2 = L.ring.cx + r * Math.cos(rad(a2))
  const y2 = L.ring.cy + r * Math.sin(rad(a2))
  let sweep = forceSweep
  if (sweep === undefined) {
    const d = ((a2 - a1 + 540) % 360) - 180
    sweep = d > 0 ? 1 : 0
  }
  return `M${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 0 ${sweep} ${x2.toFixed(1)},${y2.toFixed(1)}`
}

/** Position d'une carte, en % de la scène */
export function nodeStyle(L: Layout, id: NodeId, kind: NodeKind) {
  const p = kind === 'pillar' ? onRing(L, L.angles[id as PillarId]) : L.pos[id as Exclude<NodeId, PillarId>]
  return { left: pct(p[0], L.W), top: pct(p[1], L.H), width: pct(L.w[kind], L.W) }
}

export function hubStyle(L: Layout) {
  return { left: pct(L.ring.cx, L.W), top: pct(L.ring.cy, L.H), width: pct(L.hubR * 2, L.W) }
}

export function pointStyle(L: Layout, x: number, y: number) {
  return { left: pct(x, L.W), top: pct(y, L.H) }
}

type Placement = { left: string; top: string; width?: string }

/**
 * Position d'un élément dans les deux mises en page, en variables CSS.
 * Le choix se fait par container query : la mise en page est juste dès le rendu serveur.
 */
export function dualPlacement(place: (L: Layout) => Placement): CSSProperties {
  const w = place(LAYOUTS.wide)
  const t = place(LAYOUTS.tall)
  return {
    '--wx': w.left,
    '--wy': w.top,
    '--ww': w.width ?? 'auto',
    '--tx': t.left,
    '--ty': t.top,
    '--tw': t.width ?? 'auto',
  } as CSSProperties
}

/** Point d'une étiquette « sur sélection », au milieu de l'arc entre deux piliers */
export function selectionTagPoint(L: Layout, from: PillarId, to: PillarId): [number, number] {
  const a1 = L.angles[from]
  const d = ((L.angles[to] - a1 + 540) % 360) - 180
  const m = rad(a1 + d / 2)
  return [L.ring.cx + L.selR * Math.cos(m), L.ring.cy + L.selR * Math.sin(m)]
}

/** Calcule les tracés à partir des boîtes mesurées des cartes (en unités du viewBox) */
export function computeGeometry(layout: LayoutName, box: (id: NodeId) => Box): Geometry {
  const L = LAYOUTS[layout]
  const anchor = (id: NodeId, role: 'in' | 'out'): [number, number] => {
    const b = box(id)
    if (L.dir === 'h') return role === 'out' ? [b.x + b.w, b.y + b.h / 2] : [b.x, b.y + b.h / 2]
    return role === 'out' ? [b.x + b.w / 2, b.y + b.h] : [b.x + b.w / 2, b.y]
  }

  const edges: Record<string, string> = {}
  const tips: Geometry['tips'] = []
  const addTips = (edge: string, pts: [number, number][]) => pts.forEach(([x, y]) => tips.push({ edge, x, y }))

  for (const e of EDGES) {
    if (e.ring) {
      edges[e.id] = arc(L, L.angles[e.from as PillarId], L.angles[e.to as PillarId])
    } else if (e.bus) {
      const [x1, y1] = anchor(e.from, 'out')
      const g = box(e.to)
      if (L.dir === 'h') {
        const by = L.busY ?? L.H
        const gx = g.x + g.w / 2
        const gy = g.y + g.h
        edges[e.id] = `M${x1},${y1} C${x1 + 70},${y1} ${x1 + 70},${by} ${x1 + 160},${by} L${gx - 60},${by} Q${gx},${by} ${gx},${gy}`
        addTips(e.id, [[x1, y1], [gx, gy]])
      } else {
        const bx = L.busX ?? 0
        const gx = g.x + 34
        const gy = g.y
        edges[e.id] = `M${x1},${y1} C${x1},${y1 + 46} ${bx},${y1 + 26} ${bx},${y1 + 96} L${bx},${gy - 34} C${bx},${gy - 12} ${gx},${gy - 18} ${gx},${gy}`
        addTips(e.id, [[x1, y1], [gx, gy]])
      }
    } else {
      const [x1, y1] = anchor(e.from, 'out')
      const [x2, y2] = anchor(e.to, 'in')
      if (L.dir === 'h') {
        const dx = (x2 - x1) * 0.55
        edges[e.id] = `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`
      } else {
        const dy = (y2 - y1) * 0.55
        edges[e.id] = `M${x1},${y1} C${x1},${y1 + dy} ${x2},${y2 - dy} ${x2},${y2}`
      }
      addTips(e.id, [[x1, y1], [x2, y2]])
    }
  }

  // Boucle complète au repos, dans le sens du cercle
  const a0 = L.angles.amp
  const loop = `${arc(L, a0, a0 + 180, L.ring.r, L.loop)} ${arc(L, a0 + 180, a0 + 360, L.ring.r, L.loop).replace(/^M[^A]+/, '')}`

  return { layout, edges, tips, loop }
}
