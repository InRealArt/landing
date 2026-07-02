# Artists Studio — Real Data Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the mocked `artistsStudioData.ts` with real data fetched from `ArtitudeArtist` / `ArtitudeArtistImages` / `Artist` / `LandingArtist`, so the interactive map, the "Les Ateliers" list, and the "Fiche de l'atelier" detail panel on `/artists-studio` render actual studios.

**Architecture:** A new server action (`getArtistsStudioData`) queries Prisma once, joining `ArtitudeArtist` with `artist` (incl. `artistSpecialties` and `LandingArtist`) and `images`, and maps each row to the existing `ArtistStudio` shape (minus `region`, with nullable `lat`/`lng`). `ArtistsStudioPage` becomes an async Server Component that calls this action and passes the array down to the already-client `ArtistsStudioGrid` / `ArtistsStudioMap` / `ArtistsStudioDetail` components, which need only minor adjustments (drop `region`, skip markers with null coordinates).

**Tech Stack:** Next.js 15 App Router (Server Components + Server Actions), Prisma 6, TypeScript strict mode.

## Global Constraints

- No Prisma schema changes — map from existing fields only (spec: "Hors périmètre").
- `medium`/`mediumLabel`/`color` derive from `artist.artistSpecialties[0]`, mapped through a fixed correspondence table to one of the 5 existing categories (`peinture`, `sculpture`, `photographie`, `dessin`, `autre`); fallback `'autre'` if no specialty.
- `openPublic` is `true` iff `openingHours` JSON contains at least one entry; `hours` is a formatted string from `openingHours`, or the existing i18n key `artistsStudio.detail.byAppointment` fallback text if absent.
- `tagline` = `landingArtist?.quoteFromInRealArt ?? landingArtist?.intro ?? ''`; `bio` = `landingArtist?.description ?? landingArtist?.biographyText1 ?? ''`.
- `photo` = `getImageUrl(images?.coverImage) ?? getImageUrl(artist.imageUrl)`; `gallery` = `[...exteriorImages, ...interiorImages, ...artistImages, ...otherImages]` mapped through `getImageUrl`, nulls filtered out.
- `name` = `artist.pseudo` if set, else `` `${artist.name} ${artist.surname}` ``.
- `region` field is removed entirely from the `ArtistStudio` type and all UI usages; only `city` is shown.
- `lat`/`lng` become `number | null`; studios with null coordinates stay in the list/grid but are skipped when placing map markers and when panning.
- This project has no test runner configured (verified: no jest/vitest config, no `test` script in `package.json`). Verification uses `npx tsc --noEmit`, `npm run lint`, and manual browser testing (dev server) instead of automated unit tests.
- Follow the existing server action pattern (see `src/actions/teamActions.ts`): `'use server'` at top, exported async function, try/catch with a thrown French error message on failure.

---

### Task 1: Update `ArtistStudio` type

**Files:**
- Modify: `src/types/artistsStudio.ts`

**Interfaces:**
- Produces: `ArtistStudio` type consumed by Task 2 (server action), Task 3 (page), Task 4 (map), Task 5 (grid/detail).

- [ ] **Step 1: Edit the type**

Replace the full contents of `src/types/artistsStudio.ts` with:

```typescript
export type ArtistMedium = 'peinture' | 'sculpture' | 'photographie' | 'dessin' | 'autre'

export type ArtistStudio = {
  id: number
  name: string
  medium: ArtistMedium
  mediumLabel: string
  city: string
  lat: number | null
  lng: number | null
  openPublic: boolean
  tagline: string
  bio: string
  photo: string
  gallery: string[]
  hours: string
  color: string // hex, used for map marker and badge
}
```

- [ ] **Step 2: Verify no other file still imports removed fields**

Run: `grep -rn "\.region" /home/gilles/DEV/IN_REAL_ART/landing/src/components/artists-studio /home/gilles/DEV/IN_REAL_ART/landing/src/data /home/gilles/DEV/IN_REAL_ART/landing/src/types`
Expected: matches only in `ArtistsStudioGrid.tsx`, `ArtistsStudioDetail.tsx`, `artistsStudioData.ts` (to be fixed/removed in later tasks) — confirms no other consumer.

- [ ] **Step 3: Commit**

```bash
git add src/types/artistsStudio.ts
git commit -m "refactor(artists-studio): drop region, allow nullable coordinates in ArtistStudio type"
```

---

### Task 2: Server action `getArtistsStudioData`

**Files:**
- Create: `src/actions/artistsStudioActions.ts`

**Interfaces:**
- Consumes: `ArtistStudio` type (Task 1) from `@/types/artistsStudio`; `prisma` from `@/lib/prisma`; `getImageUrl` from `@/lib/cloufare/r2/url`.
- Produces: `export async function getArtistsStudioData(): Promise<ArtistStudio[]>` — consumed by Task 3.
- Produces (internal, not exported): specialty→medium mapping and `openingHours` formatting helpers, kept local to this file.

- [ ] **Step 1: Inspect `openingHours` JSON shape and Decimal handling to confirm types**

Run: `grep -n "openingHours\|latitude\|longitude" /home/gilles/DEV/IN_REAL_ART/landing/prisma/schema.prisma`
Expected output includes:
```
    latitude  Decimal? @db.Decimal(9, 6) // Latitude (ex: 48.856614)
    longitude Decimal? @db.Decimal(9, 6) // Longitude (ex: 2.352222)
    ...
    openingHours Json?
```
This confirms `latitude`/`longitude` are Prisma `Decimal` (need `.toNumber()`) and `openingHours` is a loosely-typed JSON array of `{ day, openTime, closeTime }`.

- [ ] **Step 2: Write the server action file**

Create `src/actions/artistsStudioActions.ts`:

```typescript
'use server'

import { prisma } from '@/lib/prisma'
import { getImageUrl } from '@/lib/cloufare/r2/url'
import { ArtistMedium, ArtistStudio } from '@/types/artistsStudio'

type OpeningHourEntry = {
  day?: string
  openTime?: string
  closeTime?: string
}

const MEDIUM_COLORS: Record<ArtistMedium, string> = {
  peinture: '#E11D48',
  sculpture: '#0D9488',
  photographie: '#D97706',
  dessin: '#4F46E5',
  autre: '#7C3AED',
}

// Mappe le libellé libre d'ArtistSpecialty vers l'une des 5 catégories connues de la carte
function mapSpecialtyToMedium(specialtyName: string | undefined): ArtistMedium {
  if (!specialtyName) return 'autre'
  const normalized = specialtyName.toLowerCase()
  if (normalized.includes('peintur')) return 'peinture'
  if (normalized.includes('sculpt')) return 'sculpture'
  if (normalized.includes('photo')) return 'photographie'
  if (normalized.includes('dessin') || normalized.includes('illustrat')) return 'dessin'
  return 'autre'
}

function formatOpeningHours(openingHours: unknown): { openPublic: boolean; hours: string } {
  if (!Array.isArray(openingHours) || openingHours.length === 0) {
    return { openPublic: false, hours: '' }
  }
  const entries = openingHours as OpeningHourEntry[]
  const validEntries = entries.filter((e) => e.day && e.openTime && e.closeTime)
  if (validEntries.length === 0) {
    return { openPublic: false, hours: '' }
  }
  const hours = validEntries.map((e) => `${e.day} : ${e.openTime} – ${e.closeTime}`).join(' • ')
  return { openPublic: true, hours }
}

function buildArtistName(artist: { name: string | null; surname: string | null; pseudo: string | null }): string {
  if (artist.pseudo) return artist.pseudo
  return [artist.name, artist.surname].filter(Boolean).join(' ')
}

export async function getArtistsStudioData(): Promise<ArtistStudio[]> {
  try {
    const studios = await prisma.artitudeArtist.findMany({
      include: {
        artist: {
          include: {
            LandingArtist: true,
            artistSpecialties: {
              include: {
                artistSpecialty: true,
              },
            },
          },
        },
        images: true,
      },
    })

    return studios.map((studio) => {
      const { artist } = studio
      const landingArtist = artist.LandingArtist[0]
      const specialtyName = artist.artistSpecialties[0]?.artistSpecialty.name
      const medium = mapSpecialtyToMedium(specialtyName)
      const { openPublic, hours } = formatOpeningHours(studio.openingHours)

      const coverImage = getImageUrl(studio.images?.coverImage)
      const fallbackPhoto = getImageUrl(artist.imageUrl)
      const photo = coverImage ?? fallbackPhoto ?? ''

      const galleryPaths = [
        ...(studio.images?.exteriorImages ?? []),
        ...(studio.images?.interiorImages ?? []),
        ...(studio.images?.artistImages ?? []),
        ...(studio.images?.otherImages ?? []),
      ]
      const gallery = galleryPaths
        .map((path) => getImageUrl(path))
        .filter((url): url is string => Boolean(url))

      return {
        id: studio.id,
        name: buildArtistName(artist),
        medium,
        mediumLabel: specialtyName ?? '',
        city: studio.city,
        lat: studio.latitude ? studio.latitude.toNumber() : null,
        lng: studio.longitude ? studio.longitude.toNumber() : null,
        openPublic,
        tagline: landingArtist?.quoteFromInRealArt ?? landingArtist?.intro ?? '',
        bio: landingArtist?.description ?? landingArtist?.biographyText1 ?? '',
        photo,
        gallery,
        hours,
        color: MEDIUM_COLORS[medium],
      } satisfies ArtistStudio
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des ateliers d'artistes:", error)
    throw new Error('Impossible de récupérer les ateliers d\'artistes')
  }
}
```

- [ ] **Step 3: Type-check the new file**

Run: `cd /home/gilles/DEV/IN_REAL_ART/landing && npx tsc --noEmit`
Expected: no errors referencing `artistsStudioActions.ts`. If Prisma types complain about `LandingArtist` being an array vs singular, re-check the schema relation cardinality with:
`grep -n "LandingArtist\[\]\|LandingArtist " prisma/schema.prisma | grep -i artist`
(confirms `Artist.LandingArtist` is `LandingArtist[]`, matching the `artist.LandingArtist[0]` access used above).

- [ ] **Step 4: Commit**

```bash
git add src/actions/artistsStudioActions.ts
git commit -m "feat(artists-studio): add server action to fetch real studio data from ArtitudeArtist"
```

---

### Task 3: Wire `ArtistsStudioPage` to the server action

**Files:**
- Modify: `src/components/artists-studio/ArtistsStudioPage.tsx`

**Interfaces:**
- Consumes: `getArtistsStudioData` (Task 2) from `@/actions/artistsStudioActions`; `ArtistStudio` type (Task 1).
- Produces: `artists: ArtistStudio[]` prop passed to `ArtistsStudioMap` and `ArtistsStudioGrid` (unchanged prop names/shapes from before, values now real).

Note: `ArtistsStudioPage` currently starts with `'use client'` and holds `useState` for `selectedArtistId`. To fetch server-side while keeping that interactive state, split it into an async Server Component (`ArtistsStudioPage`) that fetches data and renders a new client component holding the existing interactive body.

- [ ] **Step 1: Create the client body component**

Create `src/components/artists-studio/ArtistsStudioPageClient.tsx` with the interactive parts extracted from the current `ArtistsStudioPage.tsx` (everything from `'use client'` state management down through the JSX), accepting `artists` as a prop instead of importing the mock:

```typescript
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ArtistStudio } from '@/types/artistsStudio'
import ArtistsStudioGrid from './ArtistsStudioGrid'
import { useTranslation } from '@/hooks/useTranslation'

const ArtistsStudioMap = dynamic(() => import('./ArtistsStudioMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-cardBackground animate-pulse flex items-center justify-center">
      <span className="text-grayText text-sm montserrat"></span>
    </div>
  ),
})

const MEDIUM_COLORS = [
  { color: '#E11D48', key: 'peinture' },
  { color: '#0D9488', key: 'sculpture' },
  { color: '#D97706', key: 'photographie' },
  { color: '#4F46E5', key: 'dessin' },
  { color: '#7C3AED', key: 'autre' },
] as const

type Props = {
  artists: ArtistStudio[]
}

export default function ArtistsStudioPageClient({ artists }: Props) {
  const { t } = useTranslation()
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
            {t('artistsStudio.eyebrow')}
          </span>
          <h1 className="font-cormorant text-4xl sm:text-6xl lg:text-7xl font-light max-w-4xl leading-tight mb-4 text-textColor mt-8">
            {t('artistsStudio.hero.title')}
            <span className="italic text-grayText block">
              {t('artistsStudio.hero.subtitle')}
            </span>
          </h1>
          <p className="text-sm sm:text-lg max-w-2xl text-grayText font-light leading-relaxed mb-8">
            {t('artistsStudio.hero.description')}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-16 mt-2 text-xs tracking-wider uppercase font-unbounded font-medium text-grayText">
            <div>
              <span className="text-gold-accent font-bold text-lg mr-1">{artists.length}</span>
              {t('artistsStudio.hero.statsStudios')}
            </div>
            <div>
              <span className="text-gold-accent font-bold text-lg mr-1">100%</span>
              {t('artistsStudio.hero.statsArtists')}
            </div>
            <div>
              <span className="text-gold-accent font-bold text-lg mr-1">5</span>
              {t('artistsStudio.hero.statsDisciplines')}
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
          artists={artists}
          selectedArtistId={selectedArtistId}
          onSelectArtist={handleSelectArtist}
          popupCtaLabel={t('artistsStudio.map.popupCta')}
        />

        {/* Map legend */}
        <div className="absolute bottom-5 left-5 z-[20] bg-cardBackground/95 backdrop-blur shadow-lg border border-borderColor p-4 max-w-[200px] text-xs">
          <h4 className="font-unbounded font-bold tracking-wider uppercase mb-3 text-grayText text-[10px]">
            {t('artistsStudio.map.legend')}
          </h4>
          <div className="space-y-1.5">
            {MEDIUM_COLORS.map(({ color, key }) => (
              <div key={key} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-textColor">{t(`artistsStudio.map.mediums.${key}`)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOC 3+4+5 — Filters, Grid, Detail */}
      <ArtistsStudioGrid
        artists={artists}
        selectedArtistId={selectedArtistId}
        onSelectArtist={handleSelectArtist}
      />

      {/* BLOC 6 — CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
        <div className="relative bg-cardBackground border border-gold-accent/30 overflow-hidden p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="relative z-10 max-w-2xl text-center lg:text-left">
            <span className="text-xs font-unbounded font-bold tracking-widest text-gold-accent uppercase mb-3 block">
              {t('artistsStudio.cta.eyebrow')}
            </span>
            <h2 className="font-cormorant text-3xl sm:text-5xl font-light leading-tight mb-4 text-textColor">
              {t('artistsStudio.cta.title')}
            </h2>
            <p className="text-sm sm:text-base text-grayText font-light leading-relaxed">
              {t('artistsStudio.cta.description')}
            </p>
          </div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <a
              href="/joinInRealArt"
              className="w-full sm:w-auto bg-gold-accent hover:opacity-90 text-white px-8 py-4 font-unbounded font-semibold uppercase tracking-wider text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              {t('artistsStudio.cta.joinCta')}
            </a>
            <a
              href="/artists"
              className="w-full sm:w-auto border border-borderColor hover:border-gold-accent text-center px-8 py-4 font-unbounded font-semibold uppercase tracking-wider text-xs transition-colors text-textColor block"
            >
              {t('artistsStudio.cta.artistsCta')}
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

- [ ] **Step 2: Replace `ArtistsStudioPage.tsx` with the server component wrapper**

Replace the full contents of `src/components/artists-studio/ArtistsStudioPage.tsx` with:

```typescript
import { getArtistsStudioData } from '@/actions/artistsStudioActions'
import ArtistsStudioPageClient from './ArtistsStudioPageClient'

export default async function ArtistsStudioPage() {
  const artists = await getArtistsStudioData()

  return <ArtistsStudioPageClient artists={artists} />
}
```

- [ ] **Step 3: Type-check**

Run: `cd /home/gilles/DEV/IN_REAL_ART/landing && npx tsc --noEmit`
Expected: no errors in `ArtistsStudioPage.tsx` or `ArtistsStudioPageClient.tsx`.

- [ ] **Step 4: Commit**

```bash
git add src/components/artists-studio/ArtistsStudioPage.tsx src/components/artists-studio/ArtistsStudioPageClient.tsx
git commit -m "refactor(artists-studio): split page into async server fetch + client interactive body"
```

---

### Task 4: Handle nullable coordinates in `ArtistsStudioMap`

**Files:**
- Modify: `src/components/artists-studio/ArtistsStudioMap.tsx`

**Interfaces:**
- Consumes: `ArtistStudio` type (Task 1) with `lat`/`lng` now `number | null`.

- [ ] **Step 1: Skip markers for studios without coordinates**

In `src/components/artists-studio/ArtistsStudioMap.tsx`, locate the marker-creation loop:

```typescript
      // Add markers
      artists.forEach((artist) => {
```

Replace with:

```typescript
      // Add markers (skip studios without geolocation)
      artists.forEach((artist) => {
        if (artist.lat === null || artist.lng === null) return
```

- [ ] **Step 2: Fix the `L.marker` call to use non-null coordinates**

Locate:

```typescript
        const marker = L.marker([artist.lat, artist.lng], { icon })
```

This line is already inside the `forEach` after the early-return guard from Step 1, so TypeScript now narrows `artist.lat`/`artist.lng` to `number` at this point — no further code change needed here, but confirm by running the type-check in Step 4.

- [ ] **Step 3: Guard the pan-to-selected effect**

Locate:

```typescript
  // Pan to selected artist
  useEffect(() => {
    if (!mapRef.current || selectedArtistId === null) return
    const artist = artists.find((a) => a.id === selectedArtistId)
    if (artist) {
      mapRef.current.setView([artist.lat, artist.lng], 12, { animate: true })
      const marker = markersRef.current.get(selectedArtistId)
      if (marker) marker.openPopup()
    }
  }, [selectedArtistId, artists])
```

Replace with:

```typescript
  // Pan to selected artist
  useEffect(() => {
    if (!mapRef.current || selectedArtistId === null) return
    const artist = artists.find((a) => a.id === selectedArtistId)
    if (artist && artist.lat !== null && artist.lng !== null) {
      mapRef.current.setView([artist.lat, artist.lng], 12, { animate: true })
      const marker = markersRef.current.get(selectedArtistId)
      if (marker) marker.openPopup()
    }
  }, [selectedArtistId, artists])
```

- [ ] **Step 4: Type-check**

Run: `cd /home/gilles/DEV/IN_REAL_ART/landing && npx tsc --noEmit`
Expected: no errors in `ArtistsStudioMap.tsx` (confirms the `forEach` early-return narrows `artist.lat`/`lng` to `number` for the rest of that iteration).

- [ ] **Step 5: Commit**

```bash
git add src/components/artists-studio/ArtistsStudioMap.tsx
git commit -m "fix(artists-studio): skip map markers and panning for studios without coordinates"
```

---

### Task 5: Drop `region` from `ArtistsStudioGrid` and `ArtistsStudioDetail`

**Files:**
- Modify: `src/components/artists-studio/ArtistsStudioGrid.tsx`
- Modify: `src/components/artists-studio/ArtistsStudioDetail.tsx`

**Interfaces:**
- Consumes: `ArtistStudio` type (Task 1), no longer has `region`.

- [ ] **Step 1: Fix the location filter in `ArtistsStudioGrid.tsx`**

Locate:

```typescript
      const matchLoc =
        a.city.toLowerCase().includes(locationSearch.toLowerCase()) ||
        a.region.toLowerCase().includes(locationSearch.toLowerCase())
```

Replace with:

```typescript
      const matchLoc = a.city.toLowerCase().includes(locationSearch.toLowerCase())
```

- [ ] **Step 2: Fix the card label in `ArtistsStudioGrid.tsx`**

Locate:

```typescript
                      <p className="text-[10px] uppercase tracking-[0.35em] text-grayText montserrat mb-1">
                        {artist.city} — {artist.region}
                      </p>
```

Replace with:

```typescript
                      <p className="text-[10px] uppercase tracking-[0.35em] text-grayText montserrat mb-1">
                        {artist.city}
                      </p>
```

- [ ] **Step 3: Fix the label in `ArtistsStudioDetail.tsx`**

Locate:

```typescript
          <p className="text-[10px] uppercase tracking-[0.35em] text-grayText montserrat mb-1">
            {artist.city} — {artist.region}
          </p>
```

Replace with:

```typescript
          <p className="text-[10px] uppercase tracking-[0.35em] text-grayText montserrat mb-1">
            {artist.city}
          </p>
```

- [ ] **Step 4: Type-check**

Run: `cd /home/gilles/DEV/IN_REAL_ART/landing && npx tsc --noEmit`
Expected: no errors referencing `region` in either file.

- [ ] **Step 5: Commit**

```bash
git add src/components/artists-studio/ArtistsStudioGrid.tsx src/components/artists-studio/ArtistsStudioDetail.tsx
git commit -m "refactor(artists-studio): remove region field from grid and detail display"
```

---

### Task 6: Remove the mock data file

**Files:**
- Delete: `src/data/artistsStudioData.ts`

**Interfaces:**
- None — this file must have zero remaining importers after Task 3.

- [ ] **Step 1: Confirm no remaining imports**

Run: `grep -rln "artistsStudioData" /home/gilles/DEV/IN_REAL_ART/landing/src`
Expected: no output (empty) — if any file still appears, stop and fix that import before deleting.

- [ ] **Step 2: Delete the file**

```bash
git rm src/data/artistsStudioData.ts
```

- [ ] **Step 3: Type-check and lint the whole project**

Run: `cd /home/gilles/DEV/IN_REAL_ART/landing && npx tsc --noEmit && npm run lint`
Expected: both commands exit 0 with no errors.

- [ ] **Step 4: Commit**

```bash
git commit -m "chore(artists-studio): remove mocked studio data file"
```

---

### Task 7: Manual verification in the browser

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `cd /home/gilles/DEV/IN_REAL_ART/landing && npm run dev`
Expected: server starts on `http://localhost:3000` without errors.

- [ ] **Step 2: Verify the database has at least one `ArtitudeArtist` row to test against**

Run: `cd /home/gilles/DEV/IN_REAL_ART/landing && npx prisma studio` (or query via psql/Supabase dashboard) and confirm at least one row exists in `landing.ArtitudeArtist` with a linked `landing.ArtitudeArtistImages` row. If none exist, create one test row (via Prisma Studio or backoffice) with `city`, `latitude`, `longitude`, `openingHours`, and a linked `ArtitudeArtistImages.coverImage` so the page has data to render — this step just ensures test data exists, it does not modify application code.

- [ ] **Step 3: Load `/artists-studio` and check the map**

Navigate to `http://localhost:3000/artists-studio` (or `/fr/artists-studio` / `/en/artists-studio` per the project's routing). Confirm:
- The stats counter at the top reflects the real count of studios (not the old hardcoded 5).
- The map shows a marker for each studio that has `latitude`/`longitude` set.
- Studios without coordinates do NOT show a marker but DO appear in the "Les Ateliers" list below.

- [ ] **Step 4: Check the "Les Ateliers" list**

Confirm the list shows real artist names, cities (no more "Ville — Région" format, just city), and medium badges derived from `ArtistSpecialty`.

- [ ] **Step 5: Click a studio and verify the detail panel**

Click a studio card (or a map marker popup CTA). Confirm the "Fiche de l'atelier" panel (`ArtistsStudioDetail`) updates with:
- The studio's `coverImage` as the main photo (or the artist's `imageUrl` if no cover image).
- The gallery grid populated from `exteriorImages`/`interiorImages`/`artistImages`/`otherImages`.
- Tagline/bio from the linked `LandingArtist` (empty gracefully if none linked).
- Opening hours formatted from `openingHours`, or "sur rendez-vous" copy if empty.

- [ ] **Step 6: Check console for errors**

Open browser dev tools console. Confirm no errors related to `getImageUrl`, Leaflet markers, or missing fields.

- [ ] **Step 7: Stop the dev server**

Press `Ctrl+C` in the terminal running `npm run dev`.

---

## Self-Review Notes

- Spec coverage: mapping table (Task 2), page wiring (Task 3), map null-coordinate handling (Task 4), region removal (Task 5), mock deletion (Task 6), manual QA (Task 7) — all spec sections covered.
- No placeholders: every step has literal code or literal commands.
- Type consistency: `ArtistStudio` fields (`id`, `name`, `medium`, `mediumLabel`, `city`, `lat`, `lng`, `openPublic`, `tagline`, `bio`, `photo`, `gallery`, `hours`, `color`) are identical across Task 1 (type), Task 2 (server action return), Task 3 (props), Task 4/5 (consumers).
