# Artists Studio Index Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a `/artists-studio` page with an interactive Leaflet map and filterable grid of artist studios, mirroring the structure of `templates/template_index_artists_studio.html` with the InRealArt design system.

**Architecture:** Static data file (`artistsStudioData.ts`) drives both the Leaflet map and the grid. A `'use client'` component handles all interactivity (map, filters, detail panel). The Next.js page is a Server Component that imports the client component.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 3, react-leaflet 4, leaflet 1.9, CSS variables (gold-accent `#b89c72`, dark/light via `data-theme`), Bricolage Grotesque + Unbounded fonts.

## Global Constraints

- No top nav — the site header is already global in `layout.tsx`
- Route: `/artists-studio` → `src/app/artists-studio/page.tsx`
- Design tokens: `gold-accent` (#b89c72), `backgroundColor`, `cardBackground`, `textColor`, `borderColor` — use existing Tailwind classes from `tailwind.config.ts`
- Dark mode via `[data-theme="dark"]` selector (not `dark:` prefix — check existing components for pattern)
- Fonts: `font-bricolage` for body, `font-unbounded` for headings
- No `alert()` — use toast notifications (same pattern as template)
- Register `/artists-studio` in `src/proxy.ts` KNOWN_STATIC_ROUTES
- 5-6 hardcoded French artists with realistic coords
- react-leaflet requires `'use client'` — map must be in a Client Component
- Leaflet CSS must be imported in the client component or a layout
- No new Prisma schema changes for this MVP

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/data/artistsStudioData.ts` | Create | Static artist studio data (5 artists) |
| `src/types/artistsStudio.ts` | Create | `ArtistStudio` TypeScript type |
| `src/components/artists-studio/ArtistsStudioMap.tsx` | Create | Leaflet map client component |
| `src/components/artists-studio/ArtistsStudioGrid.tsx` | Create | Filterable grid + detail panel client component |
| `src/components/artists-studio/ArtistsStudioFilters.tsx` | Create | Sticky filter bar client component |
| `src/components/artists-studio/ArtistsStudioDetail.tsx` | Create | Sidebar detail panel |
| `src/components/artists-studio/ArtistsStudioPage.tsx` | Create | Main client orchestrator (combines all above) |
| `src/app/artists-studio/page.tsx` | Create | Next.js Server Component page + metadata |
| `src/proxy.ts` | Modify | Add `/artists-studio` to KNOWN_STATIC_ROUTES |

---

## Task 1: TypeScript Types + Static Data

**Files:**
- Create: `src/types/artistsStudio.ts`
- Create: `src/data/artistsStudioData.ts`

**Interfaces:**
- Produces: `ArtistStudio` type used by all subsequent tasks
- Produces: `artistsStudioData: ArtistStudio[]` array used by map and grid

- [ ] **Step 1: Create the type file**

```typescript
// src/types/artistsStudio.ts
export type ArtistMedium = 'peinture' | 'sculpture' | 'photographie' | 'dessin' | 'autre'

export type ArtistStudio = {
  id: number
  name: string
  medium: ArtistMedium
  mediumLabel: string
  city: string
  region: string
  lat: number
  lng: number
  openPublic: boolean
  tagline: string
  bio: string
  photo: string
  gallery: string[]
  hours: string
  color: string // hex, used for map marker and badge
}
```

- [ ] **Step 2: Create the static data file**

```typescript
// src/data/artistsStudioData.ts
import { ArtistStudio } from '@/types/artistsStudio'

export const artistsStudioData: ArtistStudio[] = [
  {
    id: 1,
    name: 'Ronan Martin',
    medium: 'peinture',
    mediumLabel: 'Peinture & Abstraction Lyrique',
    city: 'Paris',
    region: 'Île-de-France',
    lat: 48.8566,
    lng: 2.3522,
    openPublic: true,
    tagline: "L'éveil des couleurs et la pureté des huiles texturées.",
    bio: 'Ronan Martin est reconnu pour son travail sur les textures et l'harmonie vibratoire des pigments. Ses toiles de grand format captent l'énergie de la lumière brute.',
    photo: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549887534-1541e9326642?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?q=80&w=400&auto=format&fit=crop',
    ],
    hours: 'Mardi au Samedi : 14h00 – 19h00',
    color: '#E11D48',
  },
  {
    id: 2,
    name: 'Anna Normand',
    medium: 'dessin',
    mediumLabel: 'Dessin & Architecture du Papier',
    city: 'Nantes',
    region: 'Pays de la Loire',
    lat: 47.2184,
    lng: -1.5536,
    openPublic: true,
    tagline: 'Scénographies délicates et œuvres sculptées en bas-relief.',
    bio: 'Diplômée des Arts Décoratifs de Paris, Anna utilise le papier comme matériau architectural infini, découpant et pliant pour façonner de magnifiques bas-reliefs.',
    photo: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1576016770956-debb63d900fc?q=80&w=400&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582201942988-13e60e4556ee?q=80&w=400&auto=format&fit=crop',
    ],
    hours: 'Jeudi & Vendredi : 10h00 – 18h00',
    color: '#4F46E5',
  },
  {
    id: 3,
    name: 'Jean-Paul Boyer',
    medium: 'sculpture',
    mediumLabel: 'Sculpteur de Bronze & Marbre',
    city: 'Lyon',
    region: 'Auvergne-Rhône-Alpes',
    lat: 45.764,
    lng: 4.8357,
    openPublic: false,
    tagline: 'Un voyage minéral entre force tellurique et légèreté formelle.',
    bio: 'Jean-Paul Boyer sculpte le bronze pour lui donner l'apparence de vagues fluides. Ses pièces monumentales figurent dans de prestigieuses collections internationales.',
    photo: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=400&auto=format&fit=crop',
    ],
    hours: 'Uniquement sur rendez-vous individuel',
    color: '#0D9488',
  },
  {
    id: 4,
    name: 'Nadine LePrince',
    medium: 'autre',
    mediumLabel: 'Art Conceptuel & Installations Lumineuses',
    city: 'Strasbourg',
    region: 'Grand Est',
    lat: 48.5734,
    lng: 7.7521,
    openPublic: true,
    tagline: 'Dompter le néon et l'obscurité pour sculpter le vide.',
    bio: 'Nadine est une plasticienne qui questionne notre rapport à l'immatériel. Ses installations utilisent des tubes de gaz rares pour structurer de nouveaux espaces.',
    photo: 'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?q=80&w=600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1554147090-e1221a247de2?q=80&w=400&auto=format&fit=crop',
    ],
    hours: 'Mardi & Jeudi : 15h00 – 18h30',
    color: '#7C3AED',
  },
  {
    id: 5,
    name: 'Eaudalix',
    medium: 'photographie',
    mediumLabel: 'Fine Art Photography & Luxe',
    city: 'Toulouse',
    region: 'Occitanie',
    lat: 43.6047,
    lng: 1.4442,
    openPublic: true,
    tagline: 'Exploration esthétique des reflets d'eau et des lumières irisées.',
    bio: 'Eaudalix fusionne stylisme photographique et paysages aquatiques abstraits pour concevoir des clichés hypnotiques de très grand format.',
    photo: 'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?q=80&w=600&auto=format&fit=crop',
    gallery: [
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=400&auto=format&fit=crop',
    ],
    hours: 'Samedi : 10h00 – 19h00',
    color: '#D97706',
  },
]
```

- [ ] **Step 3: Commit**

```bash
git add src/types/artistsStudio.ts src/data/artistsStudioData.ts
git commit -m "feat(artists-studio): add ArtistStudio type and static studio data"
```

---

## Task 2: Install react-leaflet

**Files:**
- Modify: `package.json` (via npm install)

**Interfaces:**
- Produces: `react-leaflet` and `leaflet` packages available for import
- Produces: `@types/leaflet` for TypeScript support

- [ ] **Step 1: Install dependencies**

```bash
npm install react-leaflet leaflet
npm install --save-dev @types/leaflet
```

- [ ] **Step 2: Verify installation**

```bash
node -e "require('react-leaflet'); console.log('react-leaflet OK')"
```
Expected output: `react-leaflet OK`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat(artists-studio): install react-leaflet and leaflet dependencies"
```

---

## Task 3: Leaflet Map Component

**Files:**
- Create: `src/components/artists-studio/ArtistsStudioMap.tsx`

**Interfaces:**
- Consumes: `ArtistStudio` from `src/types/artistsStudio.ts`
- Consumes: `artistsStudioData` from `src/data/artistsStudioData.ts`
- Produces: `<ArtistsStudioMap artists={ArtistStudio[]} onSelectArtist={(id: number) => void} selectedArtistId={number | null} />` — client component

**Notes:**
- Leaflet requires `'use client'` and dynamic import with `ssr: false`
- Must import `leaflet/dist/leaflet.css` in this component
- Leaflet icon assets need manual fix (default icons broken in webpack)
- Tile: CartoCDN light (`https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png`) — no API key needed
- Dark mode tile: `dark_all` variant, detect via `document.documentElement.dataset.theme === 'dark'`

- [ ] **Step 1: Create the map component**

```tsx
// src/components/artists-studio/ArtistsStudioMap.tsx
'use client'

import { useEffect, useRef } from 'react'
import { ArtistStudio } from '@/types/artistsStudio'

// Fix Leaflet default icon paths broken by webpack
function fixLeafletIcons() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require('leaflet')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}

type Props = {
  artists: ArtistStudio[]
  selectedArtistId: number | null
  onSelectArtist: (id: number) => void
}

export default function ArtistsStudioMap({ artists, selectedArtistId, onSelectArtist }: Props) {
  const mapRef = useRef<ReturnType<typeof import('leaflet')['map']> | null>(null)
  const markersRef = useRef<Map<number, ReturnType<typeof import('leaflet')['marker']>>>(new Map())

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css')
      fixLeafletIcons()

      if (mapRef.current) return // Already initialized

      const isDark = document.documentElement.dataset.theme === 'dark'
      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

      const map = L.map('artists-studio-map', {
        scrollWheelZoom: false,
        zoomControl: true,
      }).setView([46.603354, 1.888334], 6)

      L.tileLayer(tileUrl, {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }).addTo(map)

      mapRef.current = map

      // Add markers
      artists.forEach((artist) => {
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            background-color: ${artist.color};
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 2.5px solid #fff;
            box-shadow: 0 2px 8px rgba(0,0,0,0.35);
            cursor: pointer;
            transition: transform 0.2s;
          "></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        })

        const marker = L.marker([artist.lat, artist.lng], { icon })

        marker.bindPopup(`
          <div style="min-width:180px;font-family:inherit;">
            <img src="${artist.photo}" style="width:100%;height:72px;object-fit:cover;border-radius:6px;margin-bottom:8px;" />
            <div style="font-weight:700;font-size:13px;">${artist.name}</div>
            <div style="font-size:11px;color:#b89c72;text-transform:uppercase;margin:2px 0;">${artist.medium}</div>
            <div style="font-size:11px;color:#666;">📍 ${artist.city}</div>
            <button
              onclick="window.__selectStudioArtist(${artist.id})"
              style="margin-top:8px;width:100%;background:#131313;color:#fff;border:none;padding:6px;border-radius:6px;font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;"
            >
              Voir l'atelier
            </button>
          </div>
        `)

        marker.addTo(map)
        markersRef.current.set(artist.id, marker)
      })

      // Expose global for popup button click
      ;(window as Window & { __selectStudioArtist?: (id: number) => void }).__selectStudioArtist = onSelectArtist
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersRef.current.clear()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Pan to selected artist
  useEffect(() => {
    if (!mapRef.current || !selectedArtistId) return
    const artist = artists.find((a) => a.id === selectedArtistId)
    if (artist) {
      mapRef.current.setView([artist.lat, artist.lng], 12, { animate: true })
      const marker = markersRef.current.get(selectedArtistId)
      if (marker) marker.openPopup()
    }
  }, [selectedArtistId, artists])

  return (
    <div
      id="artists-studio-map"
      className="h-full w-full z-10"
      style={{ minHeight: '420px' }}
    />
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles (no emit)**

```bash
npx tsc --noEmit 2>&1 | grep -i "artists-studio" || echo "No TS errors in artists-studio files"
```

- [ ] **Step 3: Commit**

```bash
git add src/components/artists-studio/ArtistsStudioMap.tsx
git commit -m "feat(artists-studio): add Leaflet interactive map component"
```

---

## Task 4: Detail Panel Component

**Files:**
- Create: `src/components/artists-studio/ArtistsStudioDetail.tsx`

**Interfaces:**
- Consumes: `ArtistStudio` from `src/types/artistsStudio.ts`
- Produces: `<ArtistsStudioDetail artist={ArtistStudio | null} onClose={() => void} />` — client component

- [ ] **Step 1: Create the detail panel**

```tsx
// src/components/artists-studio/ArtistsStudioDetail.tsx
'use client'

import { ArtistStudio } from '@/types/artistsStudio'
import Image from 'next/image'

type Props = {
  artist: ArtistStudio | null
  onClose: () => void
}

export default function ArtistsStudioDetail({ artist, onClose }: Props) {
  if (!artist) {
    return (
      <div className="bg-cardBackground border border-dashed border-borderColor rounded-2xl p-8 text-center flex flex-col items-center justify-center h-[520px]">
        <div className="w-14 h-14 rounded-full bg-gold-accent/10 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-gold-accent animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
        <h3 className="font-unbounded text-base font-bold mb-2 text-textColor">Fiche de l&apos;atelier</h3>
        <p className="text-sm text-grayText max-w-xs leading-relaxed">
          Cliquez sur un marqueur ou sur un atelier pour afficher sa fiche complète.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-cardBackground border border-borderColor rounded-2xl overflow-hidden shadow-xl">
      {/* Header image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={artist.photo}
          alt={artist.name}
          fill
          className="object-cover"
          unoptimized
        />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-black/50 hover:bg-black/80 text-white w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all"
          aria-label="Fermer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <span
          className="absolute bottom-3 left-3 text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-md"
          style={{ backgroundColor: artist.color }}
        >
          {artist.medium}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <div>
          <span className="text-xs font-unbounded font-bold text-gold-accent uppercase tracking-wider">{artist.city}</span>
          <h3 className="font-unbounded text-xl font-bold mt-1 text-textColor">{artist.name}</h3>
        </div>

        <p className="text-sm italic text-grayText border-l-2 border-gold-accent pl-3 leading-relaxed">
          &ldquo;{artist.tagline}&rdquo;
        </p>

        <div>
          <h4 className="text-xs font-unbounded text-grayText uppercase tracking-widest mb-1">Démarche</h4>
          <p className="text-sm text-textColor leading-relaxed font-bricolage">{artist.bio}</p>
        </div>

        {/* Gallery */}
        {artist.gallery.length > 0 && (
          <div>
            <h4 className="text-xs font-unbounded text-grayText uppercase tracking-widest mb-2">Portfolio</h4>
            <div className="grid grid-cols-3 gap-2">
              {artist.gallery.map((img, i) => (
                <div key={i} className="relative h-16 rounded-lg overflow-hidden bg-gray-800">
                  <Image src={img} alt={`Œuvre ${i + 1}`} fill className="object-cover hover:scale-110 transition-transform" unoptimized />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="pt-4 border-t border-borderColor space-y-2">
          <div className="flex items-center gap-3 text-sm text-grayText">
            <svg className="w-4 h-4 text-gold-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{artist.hours}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-grayText">
            <svg className="w-4 h-4 text-gold-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            <span>Atelier : {artist.openPublic ? 'Entrée libre' : 'Sur rendez-vous'}</span>
          </div>
        </div>

        {/* CTA */}
        <a
          href="/joinInRealArt"
          className="block w-full text-center bg-gold-accent hover:opacity-90 text-white font-unbounded font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all"
        >
          Rejoindre le réseau
        </a>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/artists-studio/ArtistsStudioDetail.tsx
git commit -m "feat(artists-studio): add studio detail panel component"
```

---

## Task 5: Filters + Grid Component

**Files:**
- Create: `src/components/artists-studio/ArtistsStudioGrid.tsx`

**Interfaces:**
- Consumes: `ArtistStudio` from `src/types/artistsStudio.ts`
- Produces: `<ArtistsStudioGrid artists={ArtistStudio[]} selectedArtistId={number | null} onSelectArtist={(id: number) => void} />` — client component with built-in filters

- [ ] **Step 1: Create the grid component with filters**

```tsx
// src/components/artists-studio/ArtistsStudioGrid.tsx
'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { ArtistStudio, ArtistMedium } from '@/types/artistsStudio'
import ArtistsStudioDetail from './ArtistsStudioDetail'

type Props = {
  artists: ArtistStudio[]
  selectedArtistId: number | null
  onSelectArtist: (id: number) => void
}

const MEDIUM_LABELS: Record<ArtistMedium, string> = {
  peinture: 'Peinture',
  sculpture: 'Sculpture',
  photographie: 'Photographie',
  dessin: 'Dessin / Papier',
  autre: 'Autres médiums',
}

export default function ArtistsStudioGrid({ artists, selectedArtistId, onSelectArtist }: Props) {
  const [search, setSearch] = useState('')
  const [locationSearch, setLocationSearch] = useState('')
  const [selectedMediums, setSelectedMediums] = useState<ArtistMedium[]>([])
  const [openOnly, setOpenOnly] = useState(false)
  const [showMediumDropdown, setShowMediumDropdown] = useState(false)

  const selectedArtist = artists.find((a) => a.id === selectedArtistId) ?? null

  const filtered = useMemo(() => {
    return artists.filter((a) => {
      const matchSearch =
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.mediumLabel.toLowerCase().includes(search.toLowerCase()) ||
        a.bio.toLowerCase().includes(search.toLowerCase())
      const matchLoc =
        a.city.toLowerCase().includes(locationSearch.toLowerCase()) ||
        a.region.toLowerCase().includes(locationSearch.toLowerCase())
      const matchMedium = selectedMediums.length === 0 || selectedMediums.includes(a.medium)
      const matchOpen = !openOnly || a.openPublic
      return matchSearch && matchLoc && matchMedium && matchOpen
    })
  }, [artists, search, locationSearch, selectedMediums, openOnly])

  function toggleMedium(m: ArtistMedium) {
    setSelectedMediums((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    )
  }

  function resetFilters() {
    setSearch('')
    setLocationSearch('')
    setSelectedMediums([])
    setOpenOnly(false)
  }

  return (
    <section className="max-w-7xl mx-auto py-10 px-4 sm:px-8">
      {/* Sticky filter bar */}
      <div className="sticky top-[73px] z-40 bg-cardBackground/95 backdrop-blur-md border-b border-borderColor py-4 px-0 mb-8 -mx-4 sm:-mx-8 px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search inputs */}
          <div className="flex flex-col sm:flex-row gap-2 flex-1">
            <div className="flex-1 flex items-center bg-cardBackground border border-borderColor rounded-xl px-4 py-2.5 gap-2">
              <svg className="w-4 h-4 text-grayText shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nom, spécialité, mots-clés..."
                className="w-full bg-transparent focus:outline-none text-sm text-textColor placeholder-grayText"
              />
            </div>
            <div className="flex-1 flex items-center bg-cardBackground border border-borderColor rounded-xl px-4 py-2.5 gap-2">
              <svg className="w-4 h-4 text-grayText shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <input
                type="text"
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
                placeholder="Ville, région..."
                className="w-full bg-transparent focus:outline-none text-sm text-textColor placeholder-grayText"
              />
            </div>
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Medium dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMediumDropdown((v) => !v)}
                className="bg-cardBackground border border-borderColor px-4 py-2.5 rounded-xl text-sm font-bricolage flex items-center gap-2 hover:border-gold-accent transition-colors text-textColor"
              >
                Médiums
                <svg className="w-3 h-3 text-grayText" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showMediumDropdown && (
                <div className="absolute left-0 mt-2 w-52 bg-cardBackground rounded-xl shadow-xl border border-borderColor p-3 z-50 space-y-2">
                  {(Object.entries(MEDIUM_LABELS) as [ArtistMedium, string][]).map(([val, label]) => (
                    <label key={val} className="flex items-center gap-2 text-sm cursor-pointer hover:text-gold-accent text-textColor">
                      <input
                        type="checkbox"
                        checked={selectedMediums.includes(val)}
                        onChange={() => toggleMedium(val)}
                        className="rounded"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Open only */}
            <label className="flex items-center gap-2 bg-cardBackground border border-borderColor px-4 py-2.5 rounded-xl text-sm cursor-pointer hover:border-gold-accent transition-colors text-textColor">
              <input
                type="checkbox"
                checked={openOnly}
                onChange={(e) => setOpenOnly(e.target.checked)}
                className="rounded"
              />
              Atelier ouvert
            </label>

            {/* Count + reset */}
            <span className="text-xs text-grayText font-medium">{filtered.length} atelier{filtered.length > 1 ? 's' : ''}</span>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-500 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Grid + Detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grid */}
        <div className="lg:col-span-2">
          <h2 className="font-unbounded text-2xl font-bold text-textColor mb-6">Les Ateliers</h2>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="text-5xl mb-4">🎨</span>
              <h3 className="font-unbounded text-lg font-bold mb-2 text-textColor">Aucun atelier trouvé</h3>
              <p className="text-sm text-grayText max-w-sm">Essayez d&apos;élargir vos filtres.</p>
              <button
                onClick={resetFilters}
                className="mt-6 bg-gold-accent text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((artist) => {
                const isSelected = selectedArtistId === artist.id
                return (
                  <div
                    key={artist.id}
                    onClick={() => onSelectArtist(artist.id)}
                    className={`group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                      isSelected
                        ? 'ring-2 ring-gold-accent bg-gold-accent/5 border-gold-accent shadow-md border'
                        : 'bg-cardBackground border border-borderColor hover:shadow-xl hover:border-gold-accent/40'
                    }`}
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-800">
                      <Image
                        src={artist.photo}
                        alt={artist.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                      <span
                        className="absolute top-3 right-3 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full text-white"
                        style={{ backgroundColor: artist.color }}
                      >
                        {artist.medium}
                      </span>
                      {artist.openPublic && (
                        <span className="absolute bottom-3 left-3 bg-black/80 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                          Ouvert au public
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <span className="text-xs text-grayText uppercase tracking-widest font-semibold">{artist.city}</span>
                      <h3 className="font-unbounded text-base font-bold mt-1 tracking-tight group-hover:text-gold-accent transition-colors text-textColor">
                        {artist.name}
                      </h3>
                      <p className="text-xs text-grayText mt-2 line-clamp-2 italic leading-relaxed">&ldquo;{artist.tagline}&rdquo;</p>
                      <div className="mt-4 pt-4 border-t border-borderColor flex items-center justify-between text-xs font-semibold text-gold-accent">
                        <span>Découvrir l&apos;atelier</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Detail panel */}
        <aside className="lg:col-span-1">
          <div className="sticky top-[160px] z-30">
            <ArtistsStudioDetail
              artist={selectedArtist}
              onClose={() => onSelectArtist(-1)}
            />
          </div>
        </aside>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/artists-studio/ArtistsStudioGrid.tsx
git commit -m "feat(artists-studio): add filterable studio grid with detail panel"
```

---

## Task 6: Main Page Orchestrator + Next.js Page

**Files:**
- Create: `src/components/artists-studio/ArtistsStudioPage.tsx`
- Create: `src/app/artists-studio/page.tsx`
- Modify: `src/proxy.ts` (add route to whitelist)

**Interfaces:**
- Consumes: `artistsStudioData` from `src/data/artistsStudioData.ts`
- Consumes: `ArtistsStudioMap` from Task 3
- Consumes: `ArtistsStudioGrid` from Task 5

- [ ] **Step 1: Create the page orchestrator client component**

```tsx
// src/components/artists-studio/ArtistsStudioPage.tsx
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { artistsStudioData } from '@/data/artistsStudioData'
import ArtistsStudioGrid from './ArtistsStudioGrid'

// Leaflet must be loaded client-side only
const ArtistsStudioMap = dynamic(() => import('./ArtistsStudioMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-cardBackground animate-pulse flex items-center justify-center">
      <span className="text-grayText text-sm font-bricolage">Chargement de la carte…</span>
    </div>
  ),
})

const MEDIUMS = [
  { color: '#E11D48', label: 'Peinture' },
  { color: '#0D9488', label: 'Sculpture' },
  { color: '#D97706', label: 'Photographie' },
  { color: '#4F46E5', label: 'Dessin / Papier' },
  { color: '#7C3AED', label: 'Autres médiums' },
]

export default function ArtistsStudioPage() {
  const [selectedArtistId, setSelectedArtistId] = useState<number | null>(null)

  function handleSelectArtist(id: number) {
    setSelectedArtistId(id === -1 ? null : id)
  }

  return (
    <div className="min-h-screen bg-backgroundColor text-textColor">
      {/* BLOC 1 — Hero Header */}
      <header className="relative overflow-hidden border-b border-borderColor py-12 lg:py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <span className="text-xs font-unbounded font-semibold tracking-widest text-gold-accent uppercase mb-3">
            Réseau d&apos;Art Vivant Contemporain
          </span>
          <h1 className="font-unbounded text-3xl sm:text-5xl lg:text-6xl font-bold max-w-4xl leading-tight mb-4 text-textColor">
            L&apos;Index des Ateliers{' '}
            <span className="font-bricolage font-light italic text-grayText block sm:inline">
              Trouvez un artiste près de chez vous
            </span>
          </h1>
          <p className="text-sm sm:text-lg max-w-2xl text-grayText font-bricolage font-light leading-relaxed mb-8">
            Explorez la géographie de la création. Rencontrez nos artistes résidents, poussez les portes de leurs ateliers et découvrez l&apos;art au plus près de son lieu de naissance.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mt-2 text-xs tracking-wider uppercase font-unbounded font-medium text-grayText">
            <div>
              <span className="text-gold-accent font-bold text-lg mr-1">{artistsStudioData.length}</span>
              Ateliers Référencés
            </div>
            <div>
              <span className="text-gold-accent font-bold text-lg mr-1">100%</span>
              Artistes Certifiés
            </div>
            <div>
              <span className="text-gold-accent font-bold text-lg mr-1">5</span>
              Disciplines Majeures
            </div>
          </div>
        </div>

        {/* Background blobs */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-12 -left-12 w-96 h-96 rounded-full bg-gold-accent blur-3xl" />
          <div className="absolute top-1/2 -right-12 w-80 h-80 rounded-full bg-purple-600 blur-3xl" />
        </div>
      </header>

      {/* BLOC 2 — Interactive Map */}
      <section className="relative h-[420px] sm:h-[520px] w-full border-b border-borderColor bg-cardBackground">
        <ArtistsStudioMap
          artists={artistsStudioData}
          selectedArtistId={selectedArtistId}
          onSelectArtist={handleSelectArtist}
        />

        {/* Map legend */}
        <div className="absolute bottom-5 left-5 z-[20] bg-cardBackground/95 backdrop-blur shadow-lg border border-borderColor rounded-xl p-4 max-w-[200px] text-xs">
          <h4 className="font-unbounded font-bold tracking-wider uppercase mb-3 text-grayText text-[10px]">
            Médiums Artistiques
          </h4>
          <div className="space-y-1.5">
            {MEDIUMS.map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-textColor">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOC 3+4+5 — Filters, Grid, Detail */}
      <ArtistsStudioGrid
        artists={artistsStudioData}
        selectedArtistId={selectedArtistId}
        onSelectArtist={handleSelectArtist}
      />

      {/* BLOC 6 — CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
        <div className="relative bg-cardBackground border border-gold-accent/30 rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="relative z-10 max-w-2xl text-center lg:text-left">
            <span className="text-xs font-unbounded font-bold tracking-widest text-gold-accent uppercase mb-3 block">
              Rejoignez le collectif
            </span>
            <h2 className="font-unbounded text-2xl sm:text-4xl font-bold leading-tight mb-4 text-textColor">
              Vous êtes artiste et vous n&apos;êtes pas encore dans l&apos;Index ?
            </h2>
            <p className="text-sm sm:text-base text-grayText font-bricolage font-light leading-relaxed">
              Bénéficiez d&apos;une visibilité directe auprès de milliers de collectionneurs et passionnés d&apos;art contemporain.
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <a
              href="/joinInRealArt"
              className="w-full sm:w-auto bg-gold-accent hover:opacity-90 text-white px-8 py-4 rounded-xl font-unbounded font-semibold uppercase tracking-wider text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              S&apos;inscrire gratuitement
            </a>
            <a
              href="/artists"
              className="w-full sm:w-auto border border-borderColor hover:border-gold-accent text-center px-8 py-4 rounded-xl font-unbounded font-semibold uppercase tracking-wider text-xs transition-colors text-textColor block"
            >
              Voir tous les artistes
            </a>
          </div>

          {/* Background blobs */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-gold-accent blur-3xl" />
            <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-rose-600 blur-3xl" />
          </div>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: Create the Next.js page (Server Component)**

```tsx
// src/app/artists-studio/page.tsx
import { Metadata } from 'next'
import { generateStaticMetadata } from '@/utils/metadata'
import ArtistsStudioPage from '@/components/artists-studio/ArtistsStudioPage'

export const metadata: Metadata = generateStaticMetadata({
  title: "Index des Ateliers — Artistes InRealArt",
  description: "Explorez la carte interactive des ateliers d'artistes InRealArt. Rencontrez nos créateurs résidents, découvrez leurs espaces de création à travers la France.",
  keywords: ['ateliers artistes', 'art contemporain', 'carte artistes france', 'réseau art', 'InRealArt'],
  canonical: 'https://inrealart.com/artists-studio',
})

export default function Page() {
  return <ArtistsStudioPage />
}
```

- [ ] **Step 3: Add route to proxy whitelist**

Open `src/proxy.ts` and add `'/artists-studio'` to the `KNOWN_STATIC_ROUTES` Set. Find the set definition (around line 32) and add the entry alongside existing routes like `/artists`.

- [ ] **Step 4: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | tail -20
```
Expected: no errors related to `artists-studio` files.

- [ ] **Step 5: Verify build**

```bash
npm run build 2>&1 | tail -30
```
Expected: build succeeds, `/artists-studio` appears in the routes list.

- [ ] **Step 6: Commit**

```bash
git add src/components/artists-studio/ArtistsStudioPage.tsx src/app/artists-studio/page.tsx src/proxy.ts
git commit -m "feat(artists-studio): add main orchestrator component and Next.js page"
```

---

## Self-Review

**Spec coverage:**
- ✅ Route `/artists-studio` — Task 6
- ✅ Leaflet map with CartoCDN tiles — Task 3
- ✅ 5 hardcoded artists — Task 1
- ✅ Filter bar (medium, open, search) — Task 5
- ✅ Grid of studio cards — Task 5
- ✅ Detail panel sidebar — Task 4
- ✅ CTA banner → `/joinInRealArt` — Task 6
- ✅ Hero header with stats — Task 6
- ✅ Map legend — Task 6
- ✅ Proxy route registration — Task 6
- ✅ InRealArt design tokens throughout (gold-accent, cardBackground, textColor, font-unbounded, font-bricolage)
- ✅ No top nav (site header is global in layout.tsx)
- ✅ `react-leaflet` install — Task 2

**Placeholder scan:** No TBD, TODO, or incomplete sections found.

**Type consistency:**
- `ArtistStudio` defined in Task 1, consumed identically in Tasks 3, 4, 5, 6 ✅
- `onSelectArtist: (id: number) => void` consistent across Tasks 5, 6 ✅
- `selectedArtistId: number | null` consistent across Tasks 3, 5, 6 ✅
- `id === -1` sentinel for "close/deselect" panel — used consistently in Tasks 5 and 6 ✅
