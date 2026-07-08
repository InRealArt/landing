# Home Hero Featured Slider Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static single-image "featured" zone in `HomeHero.tsx` with an auto-playing Swiper slider that merges "œuvre de la semaine" (featured artwork) and "artiste de la semaine" (featured artist), decoupled from the persona toggle.

**Architecture:** A new client component `HomeHeroFeaturedSlider.tsx` builds a slide array from `featuredArtwork`/`featuredArtist` props. With 0 slides it renders nothing, with 1 slide it renders static markup (no Swiper autoplay/pagination needed), with 2 slides it renders a Swiper carousel using `EffectFade` + `Autoplay` + `Pagination` (custom thin-bar bullets). `HomeHero.tsx` is updated to use this new component in place of the old static block, and the now-unused `featuredRef`/`hasFeaturedContent` logic tied to persona change is removed.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript strict, Tailwind CSS 3, Swiper 11 (already a dependency, already used in `HeroArtistSlider.tsx`), GSAP (existing animations in `HomeHero.tsx`, untouched by this work).

## Global Constraints

- No new npm dependencies — `swiper` is already installed (`package.json:51`, `^11.2.10`); `EffectFade` ships in the same package.
- Badge label and description strings stay hardcoded French strings (not i18n keys) — matches current code at `HomeHero.tsx:300-316`, which does not use `t()` for these.
- No `rounded-*` classes on the slider container — angular aesthetic matches persona cards.
- Slider max width: `max-w-4xl`. Ratio: `aspect-[4/3] sm:aspect-[16/9]`.
- Autoplay delay: exactly `3000`ms. Crossfade via `EffectFade`, no horizontal swipe motion.
- `featuredPost` (enterprise persona) is out of scope — not included in the slider.
- This repo has no test runner configured (no jest/vitest/`.test.tsx` files) — verification is via `npm run build`, `npm run lint`, and manual browser check, not unit tests.
- Do not commit or push to `main` — work stays on the current feature branch (`dev` or a sub-branch), per `CLAUDE.md`.

---

### Task 1: Create `HomeHeroFeaturedSlider` component with slide-building logic and 0/1-slide rendering

**Files:**
- Create: `src/components/home/HomeHeroFeaturedSlider.tsx`

**Interfaces:**
- Consumes: `FeaturedArtist` and `FeaturedArtwork` types from `src/types/featured-item.ts` (already defined: both have `slug: string`, `imageUrl: string`; `FeaturedArtist` has `name`, `surname`; `FeaturedArtwork` has `title`).
- Produces: default export `HomeHeroFeaturedSlider(props: { featuredArtwork: FeaturedArtwork | null; featuredArtist: FeaturedArtist | null })` — a client component consumed by `HomeHero.tsx` in Task 3.

This task builds the component shell and the 0/1-slide paths only (no Swiper yet — that's Task 2). This keeps the first step reviewable on its own: slide-building logic and markup for the "boring" cases before adding the carousel mechanics.

- [ ] **Step 1: Create the component file with types, slide-building logic, and 0/1-slide rendering**

```tsx
'use client'

import type { FeaturedArtist, FeaturedArtwork } from '@/types/featured-item'

interface HomeHeroFeaturedSliderProps {
  featuredArtwork: FeaturedArtwork | null
  featuredArtist: FeaturedArtist | null
}

interface FeaturedSlide {
  key: 'artwork' | 'artist'
  href: string
  imageUrl: string
  alt: string
  badgeLabel: string
  descriptionText: string
}

function buildSlides(
  featuredArtwork: FeaturedArtwork | null,
  featuredArtist: FeaturedArtist | null
): FeaturedSlide[] {
  const slides: FeaturedSlide[] = []

  if (featuredArtwork) {
    slides.push({
      key: 'artwork',
      href: '/presale',
      imageUrl: featuredArtwork.imageUrl,
      alt: featuredArtwork.title,
      badgeLabel: 'Œuvre de la semaine',
      descriptionText: 'Découvrez les œuvres exclusives avant tout le monde.',
    })
  }

  if (featuredArtist) {
    slides.push({
      key: 'artist',
      href: `/artists/${featuredArtist.slug}`,
      imageUrl: featuredArtist.imageUrl,
      alt: `${featuredArtist.name} ${featuredArtist.surname}`,
      badgeLabel: 'Artiste de la semaine',
      descriptionText: 'Découvrez les artistes émergents avant tout le monde.',
    })
  }

  return slides
}

function FeaturedSlideContent({ slide }: { slide: FeaturedSlide }) {
  return (
    <>
      <a
        href={slide.href}
        aria-label={`${slide.badgeLabel} : ${slide.alt}`}
        className="relative overflow-hidden bg-white/5 group/img block w-full aspect-[4/3] sm:aspect-[16/9]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={slide.imageUrl}
          alt={slide.alt}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-[1.03]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"
          aria-hidden="true"
        />
        <span className="absolute top-4 left-4 bg-black/70 text-gold-accent text-[9px] uppercase tracking-[0.3em] px-3 py-1.5 montserrat backdrop-blur-sm">
          {slide.badgeLabel}
        </span>
        <div
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"
          aria-hidden="true"
        />
      </a>
      <div className="flex flex-col gap-2 mt-4">
        <p className="text-white/30 text-xs leading-relaxed">{slide.descriptionText}</p>
      </div>
    </>
  )
}

export default function HomeHeroFeaturedSlider({
  featuredArtwork,
  featuredArtist,
}: HomeHeroFeaturedSliderProps) {
  const slides = buildSlides(featuredArtwork, featuredArtist)

  if (slides.length === 0) {
    return null
  }

  if (slides.length === 1) {
    return (
      <div className="mb-12 max-w-4xl">
        <FeaturedSlideContent slide={slides[0]} />
      </div>
    )
  }

  // Multi-slide Swiper carousel is added in Task 2.
  return null
}
```

- [ ] **Step 2: Verify the file type-checks**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors reported for `src/components/home/HomeHeroFeaturedSlider.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/home/HomeHeroFeaturedSlider.tsx
git commit -m "feat(home-hero): add featured slider component with 0/1-slide rendering"
```

---

### Task 2: Add Swiper carousel for the 2-slide case (autoplay, crossfade, custom pagination)

**Files:**
- Modify: `src/components/home/HomeHeroFeaturedSlider.tsx`

**Interfaces:**
- Consumes: `Swiper`, `SwiperSlide` from `swiper/react`; `Autoplay`, `EffectFade`, `Pagination` from `swiper/modules` (same import pattern as `src/components/home/HeroArtistSlider.tsx:4-5`).
- Produces: same default export signature as Task 1 — `HomeHero.tsx` (Task 3) does not need to know whether 1 or 2+ slides are active internally.

- [ ] **Step 1: Add Swiper imports and CSS imports to the top of the file**

Add after the existing `import type { FeaturedArtist, FeaturedArtwork } ...` line:

```tsx
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
```

- [ ] **Step 2: Replace the `// Multi-slide Swiper carousel is added in Task 2.` placeholder with the real carousel**

Replace:

```tsx
  // Multi-slide Swiper carousel is added in Task 2.
  return null
}
```

With:

```tsx
  return (
    <div className="mb-12 max-w-4xl featured-slider">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={600}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'featured-slider-bullet',
          bulletActiveClass: 'featured-slider-bullet-active',
        }}
        loop
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.key}>
            <FeaturedSlideContent slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
```

- [ ] **Step 3: Add custom pagination bullet styles**

Custom bullets need CSS since Swiper's default pagination renders plain `<span>` elements
styled via global classes, not Tailwind utility classes on a JSX node. Add a `<style jsx>`
block right before the final `return` statement's closing, i.e. wrap the multi-slide return
value in a fragment with the style tag:

Replace the block from Step 2 again, this time as the final version:

```tsx
  return (
    <div className="mb-12 max-w-4xl featured-slider">
      <style jsx global>{`
        .featured-slider .swiper-pagination {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          left: auto;
          width: auto;
          display: flex;
          gap: 6px;
          z-index: 10;
        }
        .featured-slider-bullet {
          display: inline-block;
          width: 20px;
          height: 2px;
          background: rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .featured-slider-bullet-active {
          background: var(--gold-accent, #b89c72);
        }
      `}</style>
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={600}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        pagination={{
          clickable: true,
          bulletClass: 'featured-slider-bullet',
          bulletActiveClass: 'featured-slider-bullet-active',
        }}
        loop
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.key}>
            <FeaturedSlideContent slide={slide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
```

Note: Swiper appends the pagination element to its own root (`.swiper`), which auto-sizes
to the slide content height (the `aspect-[4/3] sm:aspect-[16/9]` `<a>` inside
`SwiperSlide`). Since `.swiper` has `position: relative` by Swiper's default CSS, the
`position: absolute; bottom: 1rem; right: 1rem` on `.featured-slider .swiper-pagination`
places the dots over the bottom-right corner of the image, not below it. Confirm visually
in Task 4's manual check.

- [ ] **Step 4: Verify the file type-checks**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/home/HomeHeroFeaturedSlider.tsx
git commit -m "feat(home-hero): add Swiper autoplay carousel for 2+ featured slides"
```

---

### Task 3: Wire `HomeHeroFeaturedSlider` into `HomeHero.tsx` and remove obsolete persona-linked featured logic

**Files:**
- Modify: `src/components/home/HomeHero.tsx`

**Interfaces:**
- Consumes: `HomeHeroFeaturedSlider` default export from Task 1/2 (`{ featuredArtwork, featuredArtist }` props).

- [ ] **Step 1: Add the import**

In `src/components/home/HomeHero.tsx`, after the existing import of `HomeHero`'s own
dependencies (near the top, after line 9 `import type { FeaturedArtist, ... }`), add:

```tsx
import HomeHeroFeaturedSlider from './HomeHeroFeaturedSlider'
```

- [ ] **Step 2: Remove the `featuredRef` and `hasFeaturedContent` declarations**

Remove line 80 (`const featuredRef = useRef<HTMLDivElement>(null)`) and lines 84-87:

```tsx
  const hasFeaturedContent =
    (active === 'collector' && featuredArtwork !== null) ||
    (active === 'artist' && featuredArtist !== null) ||
    (active === 'enterprise' && featuredPost !== null)
```

Both are deleted entirely — no replacement needed, since the new component computes its
own slide visibility internally.

- [ ] **Step 3: Remove the `featuredRef`-based GSAP animation blocks**

In the `useEffect` at lines 90-149, remove the three `if (featuredRef.current) { ... }`
blocks (lines 112-119, 137-144). After removal the effect should read:

```tsx
  useEffect(() => {
    if (!headlineRef.current || !subheadlineRef.current) return

    const headlineSpans = headlineRef.current.querySelectorAll('span')
    const tl = gsap.timeline()

    // Fade out + slide up — headline, subheading
    tl.to(headlineSpans, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.in',
    }, 0)

    tl.to(subheadlineRef.current, {
      opacity: 0,
      y: -10,
      duration: 0.3,
      ease: 'power2.in',
    }, 0)

    // Fade in + slide down — headline, subheading
    tl.to(headlineSpans, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power2.out',
    }, 0.15)

    tl.to(subheadlineRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out',
    }, 0.15)

    return () => {
      tl.kill()
    }
  }, [active])
```

- [ ] **Step 4: Replace the "Featured contextuelle par persona" block**

Replace the entire block (originally lines 264-319, now shifted up after Step 2/3 removals
— locate it by its comment `{/* Featured contextuelle par persona */}` through its closing
`)}`):

```tsx
        {/* Featured contextuelle par persona */}
        {hasFeaturedContent && (
          <div ref={featuredRef} className="mb-12">
            ...
          </div>
        )}
```

With:

```tsx
        {/* Slider "artiste de la semaine" / "œuvre de la semaine" */}
        <HomeHeroFeaturedSlider
          featuredArtwork={featuredArtwork}
          featuredArtist={featuredArtist}
        />
```

- [ ] **Step 5: Run lint and typecheck**

Run: `npm run lint`
Expected: no new errors. `featuredPost` may show as an unused-var warning — this is
expected and acceptable: it stays in `HomeHeroProps` and the destructure because
`HomeHeroWrapper.tsx` still passes it (removing it would require touching the wrapper,
which is out of scope), and the slider intentionally excludes it per the design spec until
the enterprise persona is reactivated. A warning is not a build failure.

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no type errors.

- [ ] **Step 7: Commit**

```bash
git add src/components/home/HomeHero.tsx
git commit -m "refactor(home-hero): wire in featured slider, drop persona-linked featured block"
```

---

### Task 4: Manual verification in the browser

**Files:** none (verification only).

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: server starts on `localhost:3000` (or configured port) without compile errors.

- [ ] **Step 2: Load the homepage and visually verify the slider**

Navigate to `http://localhost:3000/` in a browser. Verify:
- The featured zone shows a `max-w-4xl` panoramic image block (no more small `max-w-2xl` square-ish crop).
- If both an artwork-of-the-week and artist-of-the-week exist in the DB, the slider
  auto-advances between the two slides after ~3 seconds, with a crossfade (not a horizontal
  swipe).
- Thin gold/white dot indicators appear bottom-right of the image, and clicking a dot jumps
  to that slide.
- Hovering over the slider pauses autoplay (wait >3s while hovering — no slide change should
  occur).
- The badge text ("Œuvre de la semaine" / "Artiste de la semaine") and the description text
  below the image both change together with the active slide.
- Clicking the image navigates to `/presale` (artwork slide) or `/artists/[slug]` (artist
  slide) respectively.
- Switching the persona toggle (Collectionneur / Artiste) above no longer affects the
  slider's content — only the headline/subheadline/CTA below change.

- [ ] **Step 3: Verify the 1-slide and 0-slide fallback paths**

If possible, test with only one of `featuredArtwork`/`featuredArtist` non-null (e.g. via
temporarily returning `null` from one of the server actions in a local scratch edit, not
committed) to confirm: a single static slide renders with no dots and no autoplay jump. Then
verify both `null` renders nothing (the whole zone collapses, no empty gap). Revert any
scratch edits made purely for this test.

- [ ] **Step 4: Run the production build**

Run: `npm run build`
Expected: build completes successfully with no type or lint errors introduced by this
change.

---

## Self-Review Notes

- Spec coverage: architecture (Task 1-3), visual dimensions/ratio/coins nets (Task 1 step 1
  `FeaturedSlideContent`), transition/autoplay/pagination (Task 2), accessibility `aria-label`
  (Task 1 step 1), 0/1/2-slide branching (Task 1 + Task 2), persona-decoupling (Task 3),
  `featuredPost` out-of-scope (Task 3 step 5) — all covered.
- No new dependencies introduced; `swiper` reused as per spec's Global Constraints /
  Dependencies section.
- Type names (`FeaturedSlide`, `HomeHeroFeaturedSliderProps`, `buildSlides`,
  `FeaturedSlideContent`) are consistent across Task 1 and Task 2 (Task 2 only appends to
  the Task 1 file, no renames).
