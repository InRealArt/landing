# Cache et revalidation (IRA-22)

Critère de l'audit V2 : une page consultée sans paramètre affiche la dernière version publiée, moins de 5 minutes après la publication.

## Mesure (16/10/2026, production `https://www.inrealart.com`)

| Page | `x-vercel-cache` | `cache-control` | `age` |
|---|---|---|---|
| `/` | MISS | `private, no-cache, no-store, max-age=0, must-revalidate` | 0 |
| `/team` | MISS | idem | 0 |
| `/artists` | MISS | idem | 0 |
| `/presale` | MISS | idem | 0 |

Pas d'en-tête `cf-cache-status` : il n'y a pas de Cloudflare devant Vercel.

**Lecture.** Toutes les routes sont rendues à la demande (`ƒ` dans `next build`) : le layout racine rend `StickyFooterManager`, qui lit `headers()` (`x-pathname`), ce qui rend chaque page dynamique. Les `export const revalidate` des pages n'ont donc pas d'effet aujourd'hui, et ni le CDN Vercel ni le navigateur ne gardent le HTML. Une modification en base est visible à la requête suivante.

Le contenu périmé constaté par l'audit le 15/10 à 5 h n'est plus reproductible le 16/10 (cause d'origine non établie : cache CDN d'un déploiement antérieur, ou cache navigateur de l'auditeur). La recette ci-dessous reste à refaire après chaque mise en ligne.

## Couches de cache restantes

| Couche | Où | Durée |
|---|---|---|
| Cache de données `unstable_cache` | `src/app/services/page.tsx` (experts, tag `team`) | 5 min |
| ISR (inactif tant que le layout lit `headers()`) | toutes les pages qui lisent la base : `/`, `/team`, `/artists`, `/artists/[slug]`, `/artwork/[id]`, `/presale`, `/faq`, `/faq/translated`, `/agence`, `/agence/artists`, `/agence/artists/[slug]`, `/blog`, `/blog/[id]`, `/blog/category/[slug]` ; `/artists/category/[slug]` est en `force-dynamic` | 5 min |
| Images | `/images/*` (31 jours, `immutable`) ; optimiseur `next/image` (`minimumCacheTTL` 31 jours) | 31 jours |

⚠️ Images : remplacer une image en gardant **la même URL** (même nom de fichier Firebase) peut rester invisible jusqu'à 31 jours. Le back-office doit publier une nouvelle URL (nom de fichier ou paramètre de version) à chaque remplacement.

Si un jour le layout cesse de lire `headers()` (pour gagner en performance), l'ISR redevient actif : la fenêtre de 5 min et l'appel de revalidation ci-dessous garantissent alors le critère.

## Route de revalidation

`POST /api/revalidate` — corps JSON :

| Champ | Type | Effet |
|---|---|---|
| `secret` | string, obligatoire | doit valoir `REVALIDATE_SECRET` (variable d'environnement Vercel) |
| `paths` | string[] (chacun commence par `/`) | `revalidatePath` de chaque chemin |
| `path` | string | idem, un seul chemin (compatibilité) |
| `tags` | string[] | `revalidateTag(tag, { expire: 0 })` (expiration immédiate) |
| `all` | boolean | purge tout le site (`revalidatePath('/', 'layout')` + tags `team`) |

Réponses : `200 { revalidated: true, … }`, `400` corps invalide ou sans cible, `401` secret faux ou absent.

## Branchement dans le back-office (`backoffice-shopify`)

Fait le 16/10/2026 : `lib/landing-revalidation.ts` exporte un `revalidatePath` de même signature que celui de `next/cache`. Les 17 fichiers d'actions qui modifient un contenu affiché sur le landing (artistes, œuvres, ordre d'affichage, équipe, FAQ, blog, catégories, expositions, agence/UGC, sticky footer, traductions) et la route d'import d'œuvres l'importent à la place de `next/cache`. Chaque sauvegarde déclenche donc, après la réponse et en un seul appel regroupé, `POST /api/revalidate` avec `{ secret, all: true }`.

Variables d'environnement du **back-office** (Vercel, Production) : `LANDING_REVALIDATE_URL=https://www.inrealart.com/api/revalidate` et `REVALIDATE_SECRET` (même valeur que dans le projet landing). Sans ces deux variables (ex. en local), aucun appel n'est fait.

## Contrat pour le back-office (appel ciblé, si besoin un jour)

Après chaque publication, le back-office appelle la route avec les chemins concernés :

| Contenu publié | `paths` | `tags` |
|---|---|---|
| Fiche artiste | `/artists/<slug>`, `/artists`, `/` | — |
| Œuvre | `/artwork/<slug>`, `/presale`, `/artists/<slug de l'artiste>`, `/` | — |
| Membre de l'équipe | `/team`, `/services` | `team` |
| FAQ | la page qui affiche cette FAQ (`pageName` de `PageFAQ` : `/`, `/presale`, `/faq`, `/usecase`, `/services`…) ; FAQ globale : `/faq`, `/faq/translated`, `/` | — |
| Article de blog | `/blog/<slug>`, `/blog`, `/blog/category/<slug>` | — |
| Catégorie d'artistes | `/artists/category/<slug>`, `/artists` | — |
| Contenu agence (UGC, événements) | `/agence`, `/agence/artists`, `/agence/artists/<slug>` | — |
| Plusieurs pages ou doute | appel avec `{"secret":"…","all":true}` à la place de `paths`/`tags` | |

```bash
curl -X POST https://www.inrealart.com/api/revalidate \
  -H 'content-type: application/json' \
  -d '{"secret":"<REVALIDATE_SECRET>","paths":["/team","/services"],"tags":["team"]}'
```

## Purge manuelle

1. `curl -X POST https://www.inrealart.com/api/revalidate -H 'content-type: application/json' -d '{"secret":"…","all":true}'`
2. Vercel → projet → Settings → Data Cache / « Purge Cache » si une page reste ancienne.

## Recette

Modifier une donnée en base (ex. une bio de l'équipe), appeler la route, puis `curl -s https://www.inrealart.com/team | grep "<nouvelle valeur>"` sans paramètre : la valeur doit être présente en moins de 5 min (aujourd'hui : immédiatement, routes dynamiques).
