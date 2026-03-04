# Audit Performance — Page d'accueil InRealArt

**Date :** 4 mars 2026
**Codebase :** `/home/gilles/DEV/IN_REAL_ART/landing`
**Périmètre :** Page d'accueil — Core Web Vitals, bundle JS, data fetching, SEO
**Symptôme :** 7-8 secondes de chargement en production

---

## Diagnostic global

Les 7-8 secondes proviennent de **trois causes qui s'accumulent séquentiellement** :

1. **Bundle JS trop lourd** → parse/exécution lente (framer-motion, Swiper, traductions)
2. **Contenu hero rendu côté client** → page blanche jusqu'à hydratation Zustand + `useEffect` LanguageProvider
3. **4-5 requêtes DB déclenchées après hydratation** → waterfall client → Supabase

---

## P0 — Quick wins (< 30 min chacun)

### ~~1. `src/app/loading.tsx` — MANQUANT~~ ✅ DONE

~~Sans ce fichier, Next.js App Router affiche une **page blanche** pendant le rendu SSR initial.~~

~~**Action :** Créer le fichier avec un skeleton minimaliste.~~

---

### ~~2. `src/app/layout.tsx` + `src/utils/analyticsDebug.ts` — Import en production~~ ✅ DONE

~~`analyticsDebug.ts` expose `window.debugGTM` et `window.debugAnalytics` **en production** (lignes 96-98 non conditionnées). En dev, il exécute aussi un `setTimeout(debugGTM, 2000)`.~~

---

### ~~3. `src/components/common/StickyFooterManager.tsx` lignes 20-45 — Double useEffect~~ ✅ DONE

~~Pattern hérité du Pages Router, inutile en App Router avec `'use client'`. Fusionné en un seul `useEffect`, suppression du flag `mounted`.~~

---

### ~~4. `src/hooks/useImageOptimization.ts` ligne 28 — État mort~~ ✅ DONE

~~`isLoaded` est défini et muté mais **jamais retourné ni utilisé**. Il déclenche un re-render inutile. Supprimé.~~

---

### ~~5. ~15 composants — Sélecteurs Zustand trop larges~~ ✅ DONE

~~Appliqué sur : Intro, Statistics, HowItWorks, Explore, Partners (x2), HeroArtistSlider, Header, Footer.~~

---

## P1 — Fort impact, effort moyen (2-4h)

### ~~6. `src/components/home/Intro.tsx` ligne 2 — framer-motion above-fold (-130 KB)~~ ✅ DONE

framer-motion (~130 KB) est importé **statiquement** dans le composant above-fold. De plus, le H1 démarre à `opacity: 0` avec un delay de 0.2s + duration 0.8s = **~1s avant que le LCP puisse être enregistré**.

```tsx
// AVANT
import { motion, type Variants } from 'framer-motion'
// ...
<motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}>

// APRÈS — remplacer par animations CSS Tailwind
// tailwind.config.ts — ajouter les keyframes
extend: {
  keyframes: {
    'fade-up': {
      from: { opacity: '0', transform: 'translateY(40px)' },
      to: { opacity: '1', transform: 'translateY(0)' },
    },
    'fade-right': {
      from: { opacity: '0', transform: 'translateX(40px)' },
      to: { opacity: '1', transform: 'translateX(0)' },
    },
  },
  animation: {
    'fade-up': 'fade-up 0.8s ease-out 0.2s both',
    'fade-up-delay': 'fade-up 0.8s ease-out 0.38s both',
    'fade-right': 'fade-right 0.9s ease-out 0.38s both',
  },
}

// Intro.tsx — APRÈS
<h1 className="... animate-fade-up">{t('home.intro.title')}</h1>
```

**Gain estimé :** -130 KB bundle, -1s LCP

---

### ~~7. `src/store/languageStore.ts` lignes 3-4 — fr.json + en.json dans le bundle initial (-165 KB)~~ ✅ DONE

Les deux fichiers de traduction (169 KB + 165 KB = **334 KB**) sont des imports statiques inclus dans le bundle de **toutes les pages**, même si l'utilisateur ne change jamais de langue.

```ts
// AVANT
import frTranslations from '@/locales/fr.json'
import enTranslations from '@/locales/en.json'
translations: { fr: frTranslations, en: enTranslations }

// APRÈS — charger en.json uniquement si l'utilisateur switche
import frTranslations from '@/locales/fr.json'

setLanguage: async (language: Language) => {
  if (language === 'fr') {
    set({ language })
    return
  }
  const { default: enT } = await import('@/locales/en.json')
  set({ language, translations: { fr: get().translations.fr, en: enT } })
},
translations: { fr: frTranslations, en: {} as Record<string, any> },
```

**Gain estimé :** -165 KB bundle

---

### 8. `src/components/home/HeroArtistSlider.tsx` lignes 4-5, 11-14 — Swiper above-fold (-80 KB)

Swiper (~80 KB JS + CSS) est importé **statiquement** dans `HeroArtistSlider`, lui-même importé dans `Intro` → dans `page.tsx`. Il est donc dans le bundle critique alors que le contenu (3 citations d'artistes) ne le justifie pas.

**Action :** Remplacer par un autoplay CSS pur.

**Gain estimé :** -80 KB bundle

---

## P2 — Chantier majeur, impact le plus fort (1 jour)

### 9. ArtworkSlider, Partners, Team, FAQ, StickyFooterManager — Waterfall DB client-side (-3 à -5s)

Ces composants font tous `useEffect → server action → Supabase` **après hydratation**. Chaque aller-retour = 500ms à 2s. C'est la cause principale des 7-8 secondes.

**Le pattern correct existe déjà** dans la codebase : `ArtistSlider` est un Server Component avec `Suspense`.

| Composant | Store | Server Action |
|-----------|-------|---------------|
| `ArtworkSlider.tsx` | `useArtworksStore.fetchArtworks()` | `getPresaleArtworks()` |
| `Partners.tsx` | `usePartnersStore.fetchPartners()` | `getArtists(true)` |
| `Team.tsx` | `useTeamStore.fetchTeamMembers()` | `getTeamMembers()` |
| `FAQ.tsx` | `useFaqStore.fetchFaqs()` | `getFaqs()` |
| `StickyFooterManager.tsx` | — | `getActiveStickyFooter()` |

**Pattern de migration :**

```tsx
// AVANT — Client Component avec useEffect
export default function ArtworkSlider() {
  const { artworks, fetchArtworks } = useArtworksStore()
  useEffect(() => { fetchArtworks() }, [])
  // ...
}

// APRÈS — Server Component avec Suspense streaming
async function ArtworkSliderContent() {
  const artworks = await getPresaleArtworks() // fetch au rendu serveur
  return <ArtworkSliderClient artworks={artworks} />
}

export default function ArtworkSlider() {
  return (
    <Suspense fallback={<ArtworkSkeleton />}>
      <ArtworkSliderContent />
    </Suspense>
  )
}
```

Les composants étant lazy-importés dans `page.tsx`, leur Server Component async s'exécute en streaming — les données arrivent en parallèle lors du rendu serveur, avant même que le JS client soit exécuté.

**Note :** `Team.tsx` a aussi un pattern `key` counter (lignes 14, 39-43) qui force 2 montages complets du slider Swiper. Ce problème disparaît avec la migration Server Component.

**Gain estimé : -3 à -5 secondes**

---

## P3 — Optimisations techniques complémentaires

### 10. `Statistics`, `HowItWorks`, `Explore` — GSAP initialisé 3 fois

Chacun fait `await import('gsap')` + `await import('gsap/ScrollTrigger')` + `gsap.registerPlugin(ScrollTrigger)`. Les 3 composants étant chargés en parallèle, les 3 promesses d'import sont déclenchées simultanément avant que le cache soit établi.

**Action :** Centraliser dans `src/lib/gsap.ts` :

```ts
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
```

---

### 11. `src/components/common/OptimizedImage.tsx` — Client Component inutile sur chaque image

Ce composant est `'use client'` avec deux `useState` (`imageSrc`, `isLoading`). Chaque image de la page passe par ce composant et démarre à `opacity: 0` jusqu'au `handleLoad`. Pour le logo header avec `priority={true}`, c'est contre-productif.

**Action :** Utiliser `next/image` directement pour les images simples sans besoin de fallback d'erreur.

---

### 12. `src/app/layout.tsx` — Ajouter `<link rel="preload">` pour l'image hero

`OptimizedBackgroundImage` étant un Client Component, Next.js ne peut pas émettre le preload automatiquement.

```tsx
// layout.tsx — dans le <head>
<link
  rel="preload"
  as="image"
  href="/images/bg.webp"
  type="image/webp"
/>
```

**Gain estimé :** -2s sur la découverte de l'image hero

---

## Résumé — Gain total estimé

| Phase | Gain estimé |
|-------|-------------|
| P0 — Quick wins | -0.5s |
| P1 — Bundle JS (framer-motion + traductions + Swiper) | -2s |
| P2 — Server Components (waterfall DB) | -3 à -5s |
| **Total** | **-5.5 à -7.5s → objectif < 2s** |

---

## Impact SEO

- **LCP** : actuellement bloqué par l'animation framer-motion (opacity: 0 pendant ~1s) + découverte tardive de l'image hero → objectif < 2.5s
- **TTFB** : acceptable côté serveur, dégradé par le waterfall client-side
- **CLS** : risque sur les images sans dimensions fixes dans OptimizedImage
- **H1** : actuellement rendu côté client (non visible aux crawlers avant JS) → doit être rendu SSR
- **Indexabilité** : le contenu des sections (Team, FAQ, Partners) n'est pas dans le HTML initial → migration Server Component améliore aussi le crawl

---

*Rapport généré le 4 mars 2026 — agents nextjs-perf-analyzer et seo-geo-optimizer*
