# Optimisation des coûts Vercel — Function Duration

> Date : 2026-03-09
> Pages concernées : `/`, `/blog/[id]`, `/artwork/[id]`, `/artists/[slug]`

---

## Contexte

Chaque requête sur ces pages déclenche une **Serverless Function** Vercel qui :

1. Cold-start Prisma + connexion Supabase
2. Exécute plusieurs requêtes DB
3. Génère le HTML côté serveur (SSR)
4. Se répète pour **chaque visiteur**, sans aucun cache

La **Function Duration** (temps d'exécution × mémoire allouée en GB-seconds) est directement facturée. Sans stratégie de cache, 100% des requêtes passent par une Function.

---

## Diagnostic par page

### Home — `src/app/page.tsx`

- Aucun `revalidate` ni `generateStaticParams`
- Comportement actuel : **SSR sur chaque requête**
- Les données sont chargées côté client via les stores Zustand
- Aucun cache CDN possible dans l'état actuel

### Blog — `src/app/blog/[id]/page.tsx`

- Aucun `revalidate`, aucun `generateStaticParams`
- Comportement actuel : **SSR sur chaque requête**
- `generateMetadata` appelle `getPostBySlug()` (2 requêtes Prisma)
- Le composant page appelle `getPostBySlug()` une **seconde fois** → double fetch
- Le composant client `PostDetail` refetch ensuite via le store Zustand

### Artwork — `src/app/artwork/[id]/page.tsx`

- Aucun `revalidate`, aucun `generateStaticParams`
- Comportement actuel : **SSR sur chaque requête**
- `generateMetadata` appelle `getPresaleArtworkBySlug()` qui **charge toute la table** en mémoire puis filtre en JS
- Le composant client refetch ensuite toutes les œuvres via le store

### Artists — `src/app/artists/[slug]/page.tsx`

- Aucun `revalidate`, aucun `generateStaticParams`
- Comportement actuel : **SSR sur chaque requête**
- `generateMetadata` déclenche 4+ requêtes Prisma (`getArtistBySlug` + `getPresaleArtworksByArtistId`)
- Chaque action fait 2 requêtes séparées (data + translations) au lieu d'un seul `include`

---

## Problèmes identifiés

### P1 — Aucune stratégie de cache (impact maximal)

Toutes les pages sont en SSR pur. Chaque visite invoque une Function, même si le contenu n'a pas changé depuis des heures.

### P2 — Bug critique : `getPresaleArtworkBySlug` charge toute la table

```ts
// src/actions/presaleArtworkActions.ts — CODE ACTUEL (problème)
const allArtworks = await prisma.presaleArtwork.findMany() // toute la table chargée en mémoire
return allArtworks.find(a => a.slug === slug)             // filtre JS côté serveur
```

Avec N œuvres dans la table, on télécharge N lignes pour n'en utiliser qu'une.

### P3 — Double fetch dans `/blog/[id]`

`getPostBySlug()` est appelé dans `generateMetadata` **et** dans le composant page, soit 2 × 2 = 4 requêtes Prisma par render.

### P4 — Requêtes N+1 dans les server actions

| Action | Requêtes actuelles | Cause |
|---|---|---|
| `getPostBySlug()` | 2 | `getLanguageIdByCode()` séparé + `findFirst` |
| `getArtistBySlug()` | 2 | artist fetch + translations fetch séparés |
| `getPresaleArtworksByArtistId()` | 2 | artworks fetch + translations fetch séparés |

---

## Solutions

### Solution 1 — ISR avec `revalidate` ★ Priorité absolue ✅

Ajouter un export `revalidate` sur chaque page. Next.js génère une version statique, la sert depuis le CDN Vercel, et ne relance la Function qu'après expiration du cache.

#### Fonctionnement

```
1er visiteur  → Function exécutée → HTML mis en cache sur le CDN Vercel
Visiteurs suivants (pendant N secondes) → réponse CDN, zéro Function invoked
Après N secondes → prochain visiteur relance la Function en arrière-plan, cache mis à jour
```

#### Configuration appliquée

```ts
// src/app/page.tsx
export const revalidate = 1800 // régénère toutes les 30 min
```

```ts
// src/app/blog/[id]/page.tsx
export const revalidate = 1800 // régénère toutes les 30 min
```

```ts
// src/app/artists/[slug]/page.tsx
export const revalidate = 1800 // régénère toutes les 30 min
```

```ts
// src/app/artwork/[id]/page.tsx
export const revalidate = 1800 // 30 min (prix plus volatil)
```

#### Conséquence : délai de propagation des modifications

Le contenu n'est plus temps-réel. Si un contenu est modifié en base, les visiteurs verront l'ancienne version jusqu'à expiration du cache.

| Contenu modifié | Délai max avant mise à jour visible |
|---|---|
| Bio ou info d'un artiste | 1h |
| Prix ou détail d'une œuvre | 30 min |
| Article de blog | 1h |
| Contenu de la home | 30 min |
| Nouvelle URL (nouvel artiste, nouvel article) | Immédiat (pas encore en cache) |

#### Solution : revalidation à la demande depuis le back-office

Pour invalider le cache immédiatement après une modification, une route API dédiée a été créée : `src/app/api/revalidate/route.ts`.

Elle reçoit un `POST` avec un secret et un `path`, puis appelle `revalidatePath()` pour invalider le cache CDN de ce chemin instantanément.

```ts
// src/app/api/revalidate/route.ts
POST /api/revalidate
Body: { secret: string, path: string }
```

**Variable d'environnement requise** (à ajouter dans `.env.local` et dans Vercel) :
```
REVALIDATE_SECRET=un-secret-long-et-random
```

**Appel depuis le back-office** après chaque sauvegarde en base :

```ts
// utils/revalidate.ts (back-office)
export async function revalidateLandingPage(path: string) {
  await fetch(`${process.env.LANDING_URL}/api/revalidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.REVALIDATE_SECRET,
      path,
    }),
  })
}
```

```ts
// Exemple dans une server action du back-office
await prisma.landingArtist.update({ where: { slug }, data: { ... } })
await revalidateLandingPage(`/artists/${slug}`)
```

**Chemins à revalider selon le contenu modifié :**

| Contenu modifié | `path` à envoyer |
|---|---|
| Artiste | `/artists/[slug]` |
| Article de blog | `/blog/[slug]` |
| Œuvre | `/artwork/[slug]` |
| Contenu home | `/` |

**Résultat attendu : -90% de Function Duration dès le déploiement + mises à jour instantanées depuis le back-office.**

---

### Solution 2 — `generateStaticParams` pour pré-génération au build

Les pages les plus visitées sont pré-rendues au build. Zéro Function invoked à la première visite.

```ts
// src/app/blog/[id]/page.tsx
export async function generateStaticParams() {
  const posts = await getAllPostSlugs() // SELECT slug only — requête légère
  return posts.map(p => ({ id: p.slug }))
}
```

```ts
// src/app/artists/[slug]/page.tsx
export async function generateStaticParams() {
  const artists = await getAllArtistSlugs() // SELECT slug only
  return artists.map(a => ({ slug: a.slug }))
}
```

Créer les actions légères correspondantes dans `src/actions/` :

```ts
// src/actions/seoPostActions.ts
export async function getAllPostSlugs() {
  return prisma.seoPost.findMany({ select: { slug: true } })
}

// src/actions/artistActions.ts
export async function getAllArtistSlugs() {
  return prisma.landingArtist.findMany({ select: { slug: true } })
}
```

**Résultat attendu : pages disponibles instantanément depuis le CDN, sans aucune Function.**

---

### Solution 3 — Corriger `getPresaleArtworkBySlug`

Remplacer le chargement de toute la table par un filtre SQL direct.

```ts
// src/actions/presaleArtworkActions.ts

// AVANT (problème)
const allArtworks = await prisma.presaleArtwork.findMany()
return allArtworks.find(a => a.slug === slug)

// APRÈS (corrigé)
const artwork = await prisma.presaleArtwork.findFirst({
  where: { slug },
  // ... select existant
})
```

**Résultat attendu : requête O(1) au lieu de O(N), réduction significative de la mémoire et latence DB.**

---

### Solution 4 — `React.cache` pour dédupliquer les double fetch

`React.cache` garantit qu'un même appel dans le même render tree (metadata + page) n'est exécuté qu'une seule fois.

```ts
// src/actions/seoPostActions.ts
import { cache } from 'react'

export const getPostBySlug = cache(async (slug: string, lang: string) => {
  // ... requête Prisma existante inchangée
})
```

Applicable aussi à `getArtistBySlug` et `getPresaleArtworkBySlug`.

**Résultat attendu : -50% de requêtes DB par render sur les pages concernées.**

---

### Solution 5 — Éliminer les N+1 avec `include` Prisma

Combiner les requêtes data + translations en une seule.

```ts
// src/actions/artistActions.ts

// AVANT (2 requêtes)
const artist = await prisma.landingArtist.findFirst({ where: { slug } })
const translations = await prisma.translation.findMany({ where: { artistId: artist.id } })

// APRÈS (1 requête)
const artist = await prisma.landingArtist.findFirst({
  where: { slug },
  include: { translations: true }
})
```

Même pattern à appliquer dans `getPostBySlug` et `getPresaleArtworksByArtistId`.

---

## Plan d'action priorisé

| # | Action | Fichiers | Effort | Impact coût |
|---|---|---|---|---|
| ~~1~~ | ~~Ajouter `revalidate` sur les 4 pages~~ | ~~`page.tsx` × 4~~ | ~~10 min~~ | ~~**-90% function duration**~~ ✅ |
| 2 | `generateStaticParams` blog + artists | `page.tsx` × 2 + `actions/` | 1h | **-95% cold starts** |
| 3 | Fixer `getPresaleArtworkBySlug` | `presaleArtworkActions.ts` | 15 min | **-mémoire + latence DB** |
| 4 | `React.cache` sur les actions | `seoPostActions.ts`, `artistActions.ts` | 30 min | **-50% requêtes DB/render** |
| 5 | Merge queries N+1 avec `include` | `artistActions.ts`, `seoPostActions.ts`, `presaleArtworkActions.ts` | 1h | **-latence DB** |

**Total estimé : ~3h de développement pour ~90-95% de réduction des coûts Function Duration.**

---

## Références

- [Next.js — `revalidate` segment config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#revalidate)
- [Next.js — `generateStaticParams`](https://nextjs.org/docs/app/api-reference/functions/generate-static-params)
- [React — `cache`](https://react.dev/reference/react/cache)
- [Vercel — Understanding function duration billing](https://vercel.com/docs/pricing/serverless-functions)
