import { EXTERNAL_URLS } from '@/constants/constants'

/* Modèle du schéma de l'écosystème (hero de la home) */

export type NodeKind = 'input' | 'pillar' | 'output'
export type NodeId =
  | 'artiste'
  | 'createur'
  | 'institution'
  | 'pro'
  | 'liberal'
  | 'amp'
  | 'galerie'
  | 'talents'
  | 'entreprises'
  | 'marques'
  | 'collect'
export type PillarId = 'amp' | 'galerie' | 'talents'
export type SelectableId = NodeId | 'hub'
export type LayoutName = 'wide' | 'tall'

export interface EcoNode {
  id: NodeId
  kind: NodeKind
  sigs?: boolean
}

export interface EcoEdge {
  id: string
  from: NodeId
  to: NodeId
  ring?: boolean
  sel?: boolean
  bus?: boolean
}

/** "!" en préfixe d'une arête = parcours dans le sens inverse du tracé */
export interface Focus {
  nodes: SelectableId[]
  edges: string[]
}

export interface TourStep extends Focus {
  textKey: string
  mark: SelectableId | null
}

export interface Layout {
  W: number
  H: number
  dir: 'h' | 'v'
  ring: { cx: number; cy: number; r: number }
  hubR: number
  angles: Record<PillarId, number>
  busX?: number
  busY?: number
  pos: Record<Exclude<NodeId, PillarId>, [number, number]>
  w: Record<NodeKind, number>
  selR: number
  caps: [string, number, number][]
  loop: 0 | 1
  text: { from: number; to: number; dy: number; size: number; key: string }
}

const T = 'home.ecosystem'
export const tk = (key: string) => `${T}.${key}`

export const NODES: EcoNode[] = [
  { id: 'artiste', kind: 'input', sigs: true },
  { id: 'createur', kind: 'input' },
  { id: 'institution', kind: 'input' },
  { id: 'pro', kind: 'input' },
  { id: 'liberal', kind: 'input' },
  { id: 'amp', kind: 'pillar' },
  { id: 'galerie', kind: 'pillar' },
  { id: 'talents', kind: 'pillar' },
  { id: 'entreprises', kind: 'output' },
  { id: 'marques', kind: 'output' },
  { id: 'collect', kind: 'output' },
]

export const EDGES: EcoEdge[] = [
  { id: 'e1', from: 'artiste', to: 'amp' },
  { id: 'e2', from: 'createur', to: 'amp' },
  { id: 'i1', from: 'institution', to: 'amp' },
  { id: 'e3', from: 'pro', to: 'amp' },
  { id: 'e4', from: 'liberal', to: 'amp' },
  { id: 'r1', from: 'amp', to: 'galerie', ring: true, sel: true },
  { id: 'r2', from: 'galerie', to: 'talents', ring: true },
  { id: 'r3', from: 'talents', to: 'amp', ring: true, sel: true },
  { id: 'g1', from: 'pro', to: 'galerie', bus: true },
  { id: 'g2', from: 'liberal', to: 'galerie', bus: true },
  { id: 'o1', from: 'galerie', to: 'entreprises' },
  { id: 'o2', from: 'talents', to: 'marques' },
  { id: 'o3', from: 'galerie', to: 'collect' },
]

export const FOCUS: Record<SelectableId, Focus> = {
  artiste: { nodes: ['hub', 'artiste', 'amp', 'galerie', 'talents', 'entreprises', 'collect', 'marques'], edges: ['e1', 'r1', '!r3', 'o1', 'o3', 'o2'] },
  institution: { nodes: ['hub', 'institution', 'amp'], edges: ['i1'] },
  collect: { nodes: ['hub', 'artiste', 'amp', 'galerie', 'collect'], edges: ['e1', 'r1', 'o3'] },
  createur: { nodes: ['hub', 'createur', 'amp', 'talents', 'marques'], edges: ['e2', '!r3', 'o2'] },
  pro: { nodes: ['pro', 'amp', 'hub', 'galerie'], edges: ['e3', 'g1'] },
  liberal: { nodes: ['liberal', 'amp', 'hub', 'galerie'], edges: ['e4', 'g2'] },
  entreprises: { nodes: ['hub', 'artiste', 'amp', 'galerie', 'entreprises'], edges: ['e1', 'r1', 'o1'] },
  marques: { nodes: ['hub', 'artiste', 'createur', 'amp', 'talents', 'marques'], edges: ['e1', 'e2', '!r3', 'o2'] },
  amp: { nodes: ['hub', 'artiste', 'createur', 'institution', 'pro', 'liberal', 'amp'], edges: ['e1', 'e2', 'i1', 'e3', 'e4'] },
  galerie: { nodes: ['hub', 'artiste', 'pro', 'liberal', 'amp', 'galerie', 'entreprises', 'collect'], edges: ['e1', 'r1', 'g1', 'g2', 'o1', 'o3'] },
  talents: { nodes: ['hub', 'artiste', 'createur', 'amp', 'talents', 'marques'], edges: ['e1', 'e2', '!r3', 'o2'] },
  hub: { nodes: ['hub', 'amp', 'galerie', 'talents'], edges: ['r1', 'r2', 'r3'] },
}

export const TOUR: TourStep[] = [
  { textKey: tk('tour.step1'), nodes: ['artiste'], edges: [], mark: 'artiste' },
  { textKey: tk('tour.step2'), nodes: ['artiste', 'amp', 'hub'], edges: ['e1'], mark: 'amp' },
  { textKey: tk('tour.step3'), nodes: ['amp', 'galerie', 'entreprises', 'collect', 'hub'], edges: ['r1', 'o1', 'o3'], mark: 'galerie' },
  { textKey: tk('tour.step4'), nodes: ['amp', 'talents', 'marques', 'hub'], edges: ['!r3', 'o2'], mark: 'talents' },
  { textKey: tk('tour.step5'), nodes: ['institution', 'pro', 'liberal', 'amp', 'galerie', 'hub'], edges: ['i1', 'e3', 'e4', 'g1', 'g2'], mark: null },
  { textKey: tk('tour.step6'), nodes: ['hub', 'amp', 'galerie', 'talents'], edges: ['r1', 'r2', 'r3'], mark: 'hub' },
]
export const TOUR_STEP_MS = 3600

/* Ordre et délais du tracé d'entrée en scène */
export const INTRO_ORDER = ['e1', 'e2', 'i1', 'e3', 'e4', 'r1', 'r2', 'r3', 'o1', 'o2', 'o3', 'g1', 'g2']

export const LAYOUTS: Record<LayoutName, Layout> = {
  wide: {
    W: 1200, H: 600, dir: 'h',
    ring: { cx: 600, cy: 300, r: 190 }, hubR: 90,
    angles: { amp: 180, galerie: 50, talents: -50 }, busY: 566,
    pos: { artiste: [125, 128], createur: [125, 218], institution: [125, 308], pro: [125, 398], liberal: [125, 488], marques: [1078, 200], entreprises: [1078, 392], collect: [1078, 500] },
    w: { input: 214, pillar: 180, output: 214 },
    selR: 150,
    caps: [[tk('diagram.capInputs'), 160, 60], [tk('diagram.capOutputs'), 1078, 128]],
    loop: 0,
    text: { from: 172, to: 64, dy: 20, size: 14, key: tk('diagram.ringText') },
  },
  tall: {
    W: 400, H: 1050, dir: 'v',
    ring: { cx: 200, cy: 610, r: 135 }, hubR: 74,
    angles: { amp: -90, galerie: 150, talents: 30 }, busX: 14,
    pos: { artiste: [102, 84], createur: [298, 84], pro: [102, 204], institution: [298, 204], liberal: [200, 322], entreprises: [102, 920], marques: [298, 920], collect: [200, 1008] },
    w: { input: 186, pillar: 150, output: 186 },
    selR: 135,
    caps: [[tk('diagram.capInputs'), 200, 20], [tk('diagram.capOutputs'), 200, 850]],
    loop: 0,
    text: { from: 138, to: 42, dy: 19, size: 13, key: tk('diagram.ringTextShort') },
  },
}

/* Signatures affichées en vignettes dans la carte « Artistes » */
export const SIGNATURES: { initials: string; name: string; src: string }[] = [
  { initials: 'CS', name: 'Catherine Sénéchal', src: '/images/home/hero/senechal.webp' },
  { initials: 'MR', name: 'Martin Ronan', src: '/images/home/hero/ronan.webp' },
  { initials: 'JB', name: 'Jean-Paul Boyer', src: '/images/home/hero/boyer.webp' },
  { initials: 'MT', name: 'Marine Tassou', src: 'https://pub-d7df68395d644bd3bc80d24168d6d8be.r2.dev/artistsUGC/Marine%20Tassou/profile.webp' },
]

/* ---------- Contenu du panneau ---------- */

const RDV = EXTERNAL_URLS.CALENDLY_MEETING

export interface PillarContent {
  type: 'pillar'
  key: string
  href: string
}
export interface PersonaContent {
  type: 'persona'
  key: string
  href: string
  /** [nœud du parcours, clé du texte, étape sur sélection] */
  steps: [SelectableId, string, boolean?][]
}
export type PanelContent = PillarContent | PersonaContent

const pillar = (id: string, href: string): PillarContent => ({ type: 'pillar', key: tk(`content.${id}`), href })
const persona = (id: string, href: string, steps: [SelectableId, boolean?][]): PersonaContent => ({
  type: 'persona',
  key: tk(`content.${id}`),
  href,
  steps: steps.map(([node, sel], i) => [node, tk(`content.${id}.step${i + 1}`), sel]),
})

export const CONTENT: Record<SelectableId, PanelContent> = {
  amp: pillar('amp', RDV),
  galerie: pillar('galerie', RDV),
  talents: pillar('talents', '/agence/brief'),
  hub: pillar('hub', '/media'),
  artiste: persona('artiste', '/joinInRealArt', [['amp'], ['galerie', true], ['talents', true]]),
  createur: persona('createur', '/agence', [['amp'], ['talents', true]]),
  institution: persona('institution', RDV, [['amp'], ['hub']]),
  collect: persona('collect', RDV, [['amp'], ['galerie']]),
  pro: persona('pro', RDV, [['amp'], ['galerie']]),
  liberal: persona('liberal', RDV, [['amp'], ['galerie']]),
  entreprises: persona('entreprises', RDV, [['amp'], ['galerie']]),
  marques: persona('marques', '/agence/brief', [['amp'], ['talents']]),
}

/* ---------- Visuels de l'accrochage ---------- */

const R2 = 'https://pub-d7df68395d644bd3bc80d24168d6d8be.r2.dev'

const IMAGES = {
  logitech: `${R2}/agency-events/Logitech/logitech.webp`,
  artialy: `${R2}/artistsUGC/Victialy%20Nguyen/profile.webp`,
  tassou: `${R2}/artistsUGC/Marine%20Tassou/profile.webp`,
  romav: `${R2}/artistsUGC/Romain%20Hurdequint/profile.webp`,
  eaudalix: `${R2}/artistsUGC/Alix%20Goor/profile.webp`,
  nontron: `${R2}/exhibitions/Exposition%20Nontron/exposition-nontron.webp`,
  senechal: '/images/home/hero/senechal.webp',
  ronan: '/images/home/hero/ronan.webp',
  boyer: '/images/home/hero/boyer.webp',
  collectif: '/images/joinInRealArt/hero_joinInRealArt.webp',
  galeries: '/images/joinInRealArt/joinInRealArt_desc3.webp',
  lettre: '/images/newsletter/newsletter.webp',
}

export interface Visual {
  id: string
  src: string
  titleKey: string
  noteKey: string
  /** Point de cadrage (object-position) ; par défaut, haut de l'image pour garder les visages */
  focus?: string
}

const visual = (id: string, image: keyof typeof IMAGES = id as keyof typeof IMAGES, focus?: string): Visual => ({
  id,
  src: IMAGES[image],
  focus,
  titleKey: tk(`visuals.${id}.title`),
  noteKey: tk(`visuals.${id}.note`),
})

const V = {
  logitech: visual('logitech'),
  artialy: visual('artialy'),
  tassou: visual('tassou'),
  romav: visual('romav'),
  eaudalix: visual('eaudalix'),
  nontron: visual('nontron'),
  senechal: visual('senechal'),
  ronan: visual('ronan'),
  boyer: visual('boyer', 'boyer', '50% 0%'),
  collectif: visual('collectif', 'collectif', '75% 50%'),
  galeries: visual('galeries'),
  lettre: visual('lettre'),
  sigSenechal: visual('sigSenechal', 'senechal'),
  sigRonan: visual('sigRonan', 'ronan'),
  sigBoyer: visual('sigBoyer', 'boyer', '50% 0%'),
}

export const GALLERY: Record<SelectableId | 'default', Visual[]> = {
  default: [V.collectif, V.lettre, V.logitech],
  amp: [V.senechal, V.ronan, V.lettre],
  galerie: [V.nontron, V.boyer, V.galeries],
  talents: [V.logitech, V.artialy, V.eaudalix],
  hub: [V.lettre, V.ronan, V.logitech],
  artiste: [V.sigSenechal, V.sigRonan, V.sigBoyer],
  createur: [V.artialy, V.logitech, V.tassou],
  institution: [V.nontron, V.lettre, V.collectif],
  collect: [V.boyer, V.nontron, V.senechal],
  pro: [V.galeries, V.nontron, V.lettre],
  liberal: [V.lettre, V.boyer, V.nontron],
  entreprises: [V.boyer, V.nontron, V.galeries],
  marques: [V.logitech, V.romav, V.eaudalix],
}
