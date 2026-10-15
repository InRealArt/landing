# Audit V2 InRealArt — Plan d'implémentation

> **Pour les agents :** sous-skill requis : superpowers:subagent-driven-development (recommandé) ou superpowers:executing-plans pour exécuter ce plan tâche par tâche. Les étapes utilisent des cases `- [ ]`.

**Objectif :** livrer les 22 tickets de l'audit V2 (IRA-01 → IRA-22) en trois sprints, chaque ticket étant validé par son critère d'acceptation.

**Architecture :** on commence par un script de recette automatisé (`scripts/audit-recette.mjs`) qui encode la section 5 de l'audit ; il sert de « test qui échoue » pour la plupart des tickets SEO/wording. Les corrections de balises sont centralisées dans `src/utils/metadata.ts` et `src/app/layout.tsx` ; les redirections dans `next.config.ts` ; le rendu serveur des fiches passe par la suppression de `ssr: false`.

**Stack :** Next.js 16.2 (App Router, `src/proxy.ts` = middleware), React 19, Prisma 6, Tailwind 3, Zustand, Vercel. (Le CLAUDE.md mentionne Next 15 : il est obsolète, `package.json` indique `^16.2.1`.)

**Spec :** `docs/audit/InRealArt_Audit_V2_plan_action_dev.docx`

## Contraintes globales

- Ne rien commiter sans demande explicite ; pas de commit sur `main` (CLAUDE.md). Les étapes « Commit » ci-dessous sont à exécuter uniquement après feu vert.
- Toute nouvelle route doit être ajoutée à `KNOWN_STATIC_ROUTES` dans `src/proxy.ts`, sinon 308 vers `/`.
- Mots interdits dans le HTML servi : `NFT`, `blockchain`, `Web3`, `token`, `tokenis`, `investisseur` (insensible à la casse).
- Prix au format « 24 000 € » (`fr-FR`, sans décimales).
- Aucun title ne contient deux fois « InRealArt » ; aucune canonical ne pointe vers une autre page.
- Aucun chiffre d'impact sans source ; aucun crochet `[ ]` visible.
- Contenus FR par défaut ; toute nouvelle clé i18n ajoutée dans `fr.json` **et** `en.json`.

## Review Focus

1. **Pages qui héritent de la canonical du layout racine** (`src/app/layout.tsx:42-48`) — toute page sans `alternates` déclare l'accueil comme canonical. Couvert par la vérification canonical de la recette (Task 1) sur *toutes* les URL du sitemap, pas seulement /simulators.
2. **Fiche œuvre appelée avec un id numérique** (`/artwork/123`) — aujourd'hui 404 car la page résout par slug du nom ; doit répondre 301 vers le slug. Test dans Task 9.
3. **Deux œuvres au nom identique** (même `toSlug(name)`) — la seconde est inaccessible. Le sitemap ne doit pas lister deux fois la même URL. Test dans Task 9 (dédoublonnage).
4. **Œuvre sans prix / prix 0 / sans description** — afficher « Prix sur demande » et masquer le bloc description, sans texte anglais. Test dans Task 4.
5. **Contenu stocké en base (FAQ, Team, Translation, Manifeste)** — la recherche dans le code ne suffit pas : la recette doit scanner le HTML servi. Test dans Task 1 (scan du HTML, pas des sources).

---

## Cartographie : ticket → fichiers

| Ticket | Cause identifiée / fichiers |
|---|---|
| IRA-22 cache | Pages en ISR `revalidate = 1800` (30 min) ; `src/app/api/revalidate/route.ts` ne prend qu'un `path` et n'est probablement appelé par aucun back-office |
| IRA-03 /simulators | `src/app/simulators/page.tsx` : metadata en anglais, sans canonical → hérite de `alternates.canonical` du layout racine |
| IRA-04 double suffixe | `generateStaticMetadata`/`generateDynamicMetadata` (`src/utils/metadata.ts`) ajoutent `| InRealArt`, puis le `title.template` du layout l'ajoute encore ; + 11 titres codés en dur `'… | InRealArt'` dans `src/app` |
| IRA-15/19/20 conformité | `src/locales/fr.json` (bandeau Capital l.1261-1262, 1458, 1663 ; « Pourquoi investir » l.2033 ; « Réseau d… » ; « pré-lancement ») ; `src/data/faq.ts`, `src/data/glossary.ts`, `src/data/leasing.ts` ; layouts `joinInRealArt/*`, `blog/category`, `faq/translated`, `glossary`, `terms-nft` ; `HeritageArtForm.tsx` (champ crypto) ; `artSalonCalculations.ts` (+40) ; `components/usecase/lending/WhyChoose.tsx` ; rôles d'équipe et KPI probablement en base (`Team`, `Translation`) |
| IRA-12a fiche œuvre | `src/app/artwork/[id]/ArtworkPageClient.tsx:105` (clé brute), `:127` (`toLocaleString()` sans locale), `:139` (« No description available ») |
| IRA-10a accueil | `src/app/page.tsx`, `src/components/home/Statistics.tsx`, hero (H1) |
| IRA-17a catalogue | `src/app/presale/page.tsx` + clés FAQ dans `fr.json` |
| IRA-01 SSR fiches | `src/app/artists/[slug]/ArtistPageClientWrapper.tsx` : `dynamic(..., { ssr: false })` → HTML servi vide. Même motif dans 6 composants de l'accueil/équipe |
| IRA-02 meta/JSON-LD | `src/utils/generateJsonLd.ts`, pages `artwork/[id]`, `artists/[slug]` |
| IRA-07 sitemap | `src/app/sitemap.ts` : œuvres en `/artwork/${a.id}` (→ 404 aujourd'hui), pages héritées, pages manquantes |
| IRA-05 domaine | Réglage Vercel (Domains) + `BASE_URL` ; `src/utils/pdfGenerator.ts` et `api/heritage-art-simulator/send-pdf` utilisent `www` |
| IRA-08 pied de page | `src/components/common/Footer.tsx` (33 `href`, liens share.google) |
| IRA-09 menu | `src/components/common/Header.tsx`, `MobileMenu.tsx` |
| IRA-17b contact | `src/components/contact/Contact.tsx`, `ContactModal.tsx`, 15 fichiers avec une adresse `@gmail` |

## Décisions à prendre avant de démarrer (bloquantes)

1. ~~**www ou non-www (IRA-05).**~~ **Tranché par la mesure du 15/10 :** Vercel sert déjà `www` et redirige l'apex → aligner le code sur `https://www.inrealart.com` (voir Task 1, Step 3).
2. **Glossaire et /terms-nft** : le glossaire définit NFT/blockchain. Supprimer ces entrées ou passer la page en `noindex` ? `/terms-nft` → 410 (recommandé) ou 301 vers `/terms`.
3. **Contenus FAQ et chiffres** : le document « FAQ InRealArt » doit être complété (commission, délais, contact, prix) avant IRA-12b, IRA-17a/b.
4. **Adresse e-mail au nom de domaine** (contact@inrealart.com) : à créer côté Brevo/DNS avant IRA-17b.

---

# SPRINT 1 — Bloquants et conformité (~4 j/h)

### Task 1 : Script de recette automatisé (socle de test)

**Files :**
- Create : `scripts/audit-recette.mjs`
- Modify : `package.json` (script `recette`)

**Interfaces :**
- Produit : `npm run recette -- <baseUrl>` ; code de sortie 1 si une règle échoue ; affiche `FAIL <règle> <url> <détail>`.

- [x] ✅ **Step 1 : Écrire le script** — FAIT (`scripts/audit-recette.mjs` créé)

```js
// scripts/audit-recette.mjs — encode la section 5 de l'audit V2
const BASE = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '')
const FORBIDDEN = /\b(nft|blockchain|web3|tokenis\w*|tokens?|investisseurs?)\b/i
const failures = []
const fail = (rule, url, detail) => failures.push(`FAIL ${rule} ${url} ${detail}`)

const stripTags = html => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')

async function get(url) {
  const res = await fetch(url, { redirect: 'manual', headers: { 'user-agent': 'Googlebot' } })
  return { status: res.status, html: res.status === 200 ? await res.text() : '' }
}

async function checkPage(url) {
  const { status, html } = await get(url)
  if (status !== 200) return fail('status', url, String(status))
  const h1 = (html.match(/<h1[\s>]/gi) || []).length
  if (h1 !== 1) fail('h1', url, `${h1} H1`)
  const title = html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? ''
  if ((title.match(/InRealArt/g) || []).length > 1) fail('title', url, title)
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/i)?.[1]
  const expected = url.replace(BASE, 'https://inrealart.com')
  if (!canonical) fail('canonical', url, 'absente')
  else if (canonical.replace(/\/$/, '') !== expected.replace(/\/$/, '')) fail('canonical', url, canonical)
  if (/<meta name="keywords"/i.test(html)) fail('meta-keywords', url, 'présente')
  const text = stripTags(html)
  const bad = text.match(FORBIDDEN)
  if (bad) fail('vocabulaire', url, bad[0])
  if (/\[[^\]\n]{1,40}\]/.test(text)) fail('crochets', url, text.match(/\[[^\]\n]{1,40}\]/)[0])
  if (/\b\d{1,3},\d{3}\s?€/.test(text)) fail('prix', url, text.match(/\b\d{1,3},\d{3}\s?€/)[0])
  if (/artwork\.\w+|No description available/.test(text)) fail('cle-brute', url, 'chaîne technique visible')
}

const sitemap = await (await fetch(`${BASE}/sitemap.xml`)).text()
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].replace('https://inrealart.com', BASE))
if (new Set(urls).size !== urls.length) fail('sitemap', 'sitemap.xml', 'URL en double')
const limit = Number(process.env.RECETTE_LIMIT || urls.length)
for (const url of urls.slice(0, limit)) await checkPage(url)

console.log(failures.join('\n') || 'OK — toutes les règles passent')
console.log(`${urls.length} URL dans le sitemap, ${failures.length} échec(s)`)
process.exit(failures.length ? 1 : 0)
```

- [x] ✅ **Step 2 : Ajouter le script npm** — FAIT — dans `package.json` → `"recette": "node scripts/audit-recette.mjs"`.

- [x] ✅ **Step 3 : Lancer sur la prod pour obtenir la ligne de base (doit échouer)** — FAIT le 15/10/2026

Run : `npm run recette -- https://www.inrealart.com`
Attendu : FAIL nombreux (`canonical /simulators`, `title`, `status /artwork/…` 404, `h1`…). Conserver ce fichier comme référence V2.

**Ligne de base mesurée (prod, 15/10/2026) — 684 URL, 2 077 échecs :**

| Règle | Échecs | Lecture |
|---|---|---|
| canonical | 684 / 684 | Toutes les canonicals pointent vers `https://inrealart.com/…`, qui redirige en 308 vers `www` |
| sitemap-domaine | 684 / 684 | Le sitemap ne liste que des URL sans www → **toutes redirigent (308)** |
| title | 660 | Double suffixe « \| InRealArt \| InRealArt » ou marque répétée dans le titre |
| h1 | 619 | 617 pages sans H1 dans le HTML servi, 2 pages avec 2 H1 |
| meta-keywords | 94 | Balise encore présente |
| vocabulaire | 19 | about, manifest, academy, team, heritage-art-simulator, usecase/*, joinInRealArt/galleries, glossary, terms, terms-nft, 6 articles de blog, 1 catégorie de blog |

**Constats nouveaux, absents de l'audit :**
1. **Vercel sert `www.inrealart.com`** et redirige l'apex en 308. La décision n°1 est donc de fait tranchée : **passer le code en `www`** (`BASE_URL`, `metadataBase`, sitemap, canonicals), ce qui va dans le sens de la recommandation de l'audit. IRA-05 remonte en priorité Sprint 1 (ajouté à la Task 2).
2. **Soft 404 sur les fiches œuvres** : `/artwork/99` répond **200** avec le titre « Œuvre non trouvée » et une canonical vers l'accueil, au lieu d'un 404 ou d'une 301 vers le slug (traité en Task 9).
3. **Articles de blog** citant les NFT dans un contexte éditorial (rapport Artprice) : décision éditoriale à prendre (garder, reformuler, ou exclure le blog de la règle).

Le script a été adapté : `RECETTE_ORIGIN` (défaut `https://www.inrealart.com`) fixe le domaine attendu, et la règle `sitemap-domaine` contrôle le domaine des URL du sitemap. Fichier brut : scratchpad de session `recette-base.txt`.

- [x] ✅ **Revue (reviewer)** — FAIT : 1 problème relevé (sitemap en erreur → « OK » et code 0), corrigé : statut ≠ 200, index de sitemaps ou 0 URL → `FAIL sitemap` et code 1. Vérifié sur l'apex (308 → FAIL, exit 1).

- [ ] **Step 4 : Commit** — `chore(audit): script de recette automatisé (audit V2 §5)` — ⏸️ non commité (à faire par l'utilisateur à la fin du Sprint 1)

---

### Task 2 : IRA-04 + IRA-03 + meta keywords — balises globales

**Files :**
- Modify : `src/utils/metadata.ts` (deux générateurs)
- Modify : `src/app/layout.tsx:42-48` (retirer `alternates`)
- Modify : `src/app/simulators/page.tsx`
- Modify : les 11 fichiers de `src/app` contenant `| InRealArt'` en dur

- [x] ✅ **Step 1 : Test qui échoue** — FAIT : build local OK, `RECETTE_LIMIT=40` → 138 échecs (40 canonical, 38 meta-keywords, 34 title, 13 h1, 12 vocabulaire, sitemap-domaine). `/simulators` : title « All Simulators - InRealArt | InRealArt », canonical `https://inrealart.com`. Défaut reproduit en local.
  - Note : le build marque **toutes les routes en ƒ (dynamiques)**, pas en ISR malgré `revalidate = 1800` → à prendre en compte pour IRA-22 (Task 6) : le cache périmé viendrait alors du CDN, pas de l'ISR.

- [x] ✅ **Step 2 : Neutraliser le template pour les titres déjà suffixés** — FAIT : `title: { absolute: fullTitle }` dans les 2 générateurs, `keywords` retiré (sortie + déstructuration). `tsc` OK. ⚠️ ESLint plante sur sa config (`@eslint/eslintrc` config-validator), problème préexistant indépendant de ce changement. — dans les deux générateurs de `src/utils/metadata.ts`, remplacer `title: fullTitle,` par :

```ts
    title: { absolute: fullTitle },
```

et supprimer la ligne `keywords: …` (meta keywords demandée retirée par IRA-19/20).

  - [x] ✅ **Revue Step 2** — aucun défaut bloquant. Reportés au Step 5 : titres bruts suffixés à la main (liste ci-dessous) et 3 metadata brutes émettant encore `keywords` (`art-salon-simulator/layout.tsx:6`, `joinInRealArt/galleries/layout.tsx:6`, `blog/[id]/page.tsx:35`). Plus tard : retirer `keywords` de `PageMetadata` et de `defaultMetadata` une fois les appelants nettoyés.

- [x] ✅ **Step 3 : Supprimer la canonical héritée** — FAIT : bloc `alternates` et `openGraph.url` retirés de `src/app/layout.tsx` (sinon og:url = accueil sur toutes les pages) ; `metadataBase` → `https://www.inrealart.com/`. `tsc` OK.

  - [x] ✅ **Revue Step 3** — aucun défaut introduit. Constats reportés :
    - Pages sans aucune canonical → Step 6 : `/simulators`, `/art-salon-simulator`, `/agence/artists`, `/agence/artists/[slug]`, `/artists/category/[slug]`, `/academy`, `/games/[slug]`.
    - **Image de partage cassée (préexistant, vérifié : 404 en prod)** : `DEFAULT_OG_IMAGE = '/opengraph-image.png'` (`metadata.ts:7`) et `joinInRealArt/galleries/layout.tsx:17,30` pointent vers un fichier inexistant → `og:image`/`twitter:image` en 404 sur toutes les pages passant par les helpers → traité au Step 3b.

- [x] ✅ **Step 3b (ajouté) : Passer le domaine du code en `www` (IRA-05)** — FAIT : `https://inrealart.com` → `https://www.inrealart.com` dans 50 fichiers de `src` (0 restant hors `generated`) ; `DEFAULT_OG_IMAGE` et `joinInRealArt/galleries` → `/opengraph-image` ; `/opengraph-image` ajouté à `KNOWN_STATIC_ROUTES` (le proxy le redirigeait vers `/`). Vérifié sur build local : image 200 `image/png`, robots et sitemap en www, `/team` → title simple + canonical `https://www.inrealart.com/team` + og:image valide.
  - [x] ✅ **Revue Step 3b** — aucune régression (aucune comparaison de domaine dans le code, sous-domaines `artitude.` intacts, `next.config` non concerné). Corrigé suite à la revue : apex restant dans `public/` (llms.txt, llms-full.txt, agents.txt, capabilities.txt, header/footer.sitemap.xml) et mention légale `website` de `fr.json`/`en.json` → www (JSON valide). Vérifié : l'og:image auto injectée est `/opengraph-image?<hash>` (même chemin, donc la liste blanche du proxy suffit).
    - ⚠️ À faire par l'utilisateur dans Vercel (Production) : `NEXT_PUBLIC_SITE_URL` et `NEXT_PUBLIC_APP_URL` doivent valoir `https://www.inrealart.com` s'ils sont définis (sinon les canonicals restent en apex malgré le code).
    - Plus tard (optionnel) : `media`, `media/production`, `usecase/capital/contact` utilisent `NEXT_PUBLIC_APP_URL` au lieu de `BASE_URL` → unifier.
  - Note pour Task 8 : le fil d'Ariane JSON-LD de `ArtworkPageClient.tsx:83` pointe vers `/artworks`, page inexistante.
  - Ancien énoncé : + corriger l'image de partage : utiliser l'URL générée par `src/app/opengraph-image.tsx` (`/opengraph-image`) au lieu de `/opengraph-image.png`. — `BASE_URL` par défaut dans `src/utils/metadata.ts` → `https://www.inrealart.com` ; `src/app/sitemap.ts` et `src/app/robots.ts` importent `BASE_URL` ; remplacer les ~66 occurrences de `https://inrealart.com` codées en dur dans `src` (hors `generated`). ⚠️ Vérifier dans Vercel → Settings → Environment Variables la valeur de `NEXT_PUBLIC_SITE_URL` (absente du `.env` local) : si elle vaut `https://inrealart.com`, la passer à `https://www.inrealart.com`.

- [x] ✅ **Step 4 : /simulators en français, canonical auto-référente** — FAIT : `src/app/simulators/page.tsx` passe par `generateStaticMetadata` (title FR, description FR, canonical `${BASE_URL}/simulators`). `tsc` OK ; rendu vérifié au Step 7 (rebuild).
  - [x] ✅ **Revue Step 4** — aucun défaut bloquant. Description reprise sur suggestion de la revue pour couvrir les 3 simulateurs réellement présents (LOA, patrimoine, frais de salon). Hors périmètre, noté pour Task 3 : `fr.json:96,100` « opportunités d'investissement ».

```ts
// src/app/simulators/page.tsx
import { Metadata } from 'next'
import { generateStaticMetadata, BASE_URL } from '@/utils/metadata'
import SimulatorsPageClient from './SimulatorsPageClient'

export const metadata: Metadata = generateStaticMetadata({
  title: 'Simulateurs leasing et patrimoine artistique',
  description: "Simulez la location longue durée d'œuvres d'art, l'achat par une entreprise ou la valorisation d'un patrimoine artistique avec les outils InRealArt.",
  canonical: `${BASE_URL}/simulators`,
})
```

- [x] ✅ **Step 5 : Titres codés en dur** — FAIT : suffixe manuel retiré des titres de metadata brutes (le template l'ajoute une fois) dans `blog/[id]` (3), `blog/category/[slug]`, `joinInRealArt/galleries/layout`, `art-salon-simulator/layout`, `agence/artists`, `agence/artists/[slug]`, `artists/category/[slug]` (2, « In Real Art » supprimé ; og:title harmonisé en « InRealArt »), `artists/[slug]` (2), `artwork/[id]` (2). Titres passant par les helpers laissés tels quels (gérés par `absolute`). og/twitter titles inchangés (pas de template). `keywords` retiré des 3 metadata brutes. `tsc` OK.
  - [x] ✅ **Revue Step 5** — aucun défaut : aucun titre doublé ni manquant, aucun autre `title.template`, plus aucun `keywords` émis hors helpers, `post.title` typé `string`.
  - Ancien énoncé : — `grep -rn "| InRealArt'" src/app` puis, pour chaque occurrence dans un objet `metadata`/`generateMetadata` qui n'utilise pas les générateurs, retirer ` | InRealArt` (le template l'ajoute). Ex. `src/app/artwork/[id]/page.tsx` : `'Œuvre non trouvée | InRealArt'` → `'Œuvre non trouvée'`. Dans `src/app/artists/[slug]/page.tsx`, `titleTag` se termine par `| InRealArt` : le garder (le générateur le détecte et `absolute` évite le doublon).
  Liste établie par la revue du Step 2 : `blog/[id]/page.tsx:24,33,86` ; `agence/artists/[slug]/page.tsx:17` ; `agence/artists/page.tsx:7` ; `simulators/page.tsx:5` ; `art-salon-simulator/layout.tsx:4` ; `joinInRealArt/galleries/layout.tsx:4` ; `artists/category/[slug]/page.tsx:19,25` ; `artwork/[id]/page.tsx:28,53` ; `artists/[slug]/page.tsx:30,60` ; `blog/category/[slug]/page.tsx:45`. Retirer aussi `keywords` de `art-salon-simulator/layout.tsx:6`, `joinInRealArt/galleries/layout.tsx:6`, `blog/[id]/page.tsx:35`.

- [x] ✅ **Step 6 : Toutes les pages sans canonical** — FAIT : canonical (+ og:url quand un openGraph propre existe) ajoutée sur `/art-salon-simulator` (layout), `/agence/artists`, `/agence/artists/[slug]`, `/artists/category/[slug]` ; metadata complète créée pour `/academy` (n'en avait aucune ; description sans « tokenisation ») et `/games/[slug]` (`generateMetadata` depuis `games.ts`). `/simulators` déjà fait au Step 4. `tsc` OK. Contrôle exhaustif de toutes les routes au Step 7 (rebuild).
  - [x] ✅ **Revue Step 6** — 1 défaut corrigé : la canonical des catégories d'artistes dépendait de la casse de l'URL demandée (`/Peinture` ≠ `/peinture` du sitemap) → désormais construite depuis `category.name.toLowerCase()`, comme le sitemap. Aucune autre route sans canonical. Noté pour Task 9 : `/agence/artists*` et `/art-salon-simulator` absents du sitemap.
  - Ancien énoncé : — lister les pages qui n'en déclarent pas : `grep -rL "canonical" src/app --include=page.tsx --include=layout.tsx`. Pour chacune, ajouter `alternates: { canonical: \`${BASE_URL}/<route>\` }` (ou passer par `generateStaticMetadata`).

- [x] ✅ **Step 7 : Vérifier** — FAIT (build local, sitemap complet, 695 URL) :

  | Règle | Prod avant | Local après Task 2 |
  |---|---|---|
  | title | 660 | **0** |
  | meta-keywords | 94 | **0** |
  | sitemap-domaine | 684 | **0** |
  | canonical | 684 | **0** hors `/artwork/{id}` (590 fausses pages 200 sans canonical → Task 9) |
  | h1 | 619 | 629 (hors périmètre → Tasks 5 et 7) |
  | vocabulaire | 19 | 19 (→ Task 3) |

  Corrections faites pendant la vérification :
  - Script : décodage des entités HTML dans la canonical (faux positif sur l'apostrophe `&#x27;`).
  - `artists/category/[slug]` : catégorie « Choix d'InRealArt » → titre en `absolute` (évite la marque en double).
  - `/media`, `/media/production`, `/usecase/capital/contact` : canonical bâtie sur `NEXT_PUBLIC_APP_URL` (= `http://localhost:3000` en local) → `BASE_URL`.
  - Titres metadata agence (`fr.json`/`en.json`) : « In Real Art » retiré (doublon de marque avec le suffixe).
  - Pages hors sitemap contrôlées une par une (agence, media, services, ateliers, simulateurs, académie, usecase, jeux) : canonical www auto-référente, aucun keywords, titre sans doublon.
  - ⚠️ `npm run lint` toujours cassé (config ESLint, préexistant) → à traiter à part.
  - Noté pour plus tard : `/games/<slug>` d'un jeu terminé répond 200 au lieu de rediriger.
  - [x] ✅ **Revue Step 7** — aucun défaut ; `NEXT_PUBLIC_APP_URL` n'apparaît plus nulle part dans `src`. Point cosmétique corrigé : og:title des catégories contenant déjà la marque.

- [ ] **Step 8 : Commit** — ⏸️ à faire par l'utilisateur sur une branche (pas `main`), puis déploiement et recette en prod.

  (message proposé : `fix(seo): canonical auto-référente, suffixe de title unique, suppression meta keywords (IRA-03/04/19)`)

---

### Task 3 : IRA-15 / 19 / 20 — Conformité éditoriale

**Files :**
- Modify : `src/locales/fr.json`, `src/locales/en.json`
- Modify : `src/data/faq.ts`, `src/data/glossary.ts`, `src/data/leasing.ts`
- Modify : layouts metadata : `src/app/joinInRealArt/artists/layout.tsx`, `joinInRealArt/galleries/layout.tsx`, `blog/category/layout.tsx`, `blog/category/[slug]/page.tsx`, `faq/translated/layout.tsx`, `glossary/layout.tsx`, `heritage-art-simulator/layout.tsx` (« allocation optimale », « investisseur »), `artwork/[id]/page.tsx` (« art tokenisé »)
- Modify : `src/components/heritage-art-simulator/HeritageArtForm.tsx`, `HeritageArtResults.tsx`, `src/utils/heritageArtCalculations.ts`, `src/app/api/heritage-art-simulator/*/route.ts` (champ crypto)
- Modify : `src/components/usecase/lending/WhyChoose.tsx`, `src/components/presale/PresaleFeatures.tsx`
- Modify : `src/utils/artSalonCalculations.ts` (+40 %)
- Données en base : `Team` (rôle « Développeur Blockchain »), `Translation`, FAQ, manifeste

- [ ] **Step 1 : Test qui échoue** — `npm run recette` → FAIL `vocabulaire` ; et inventaire code :

```bash
grep -rniE "nft|blockchain|web3|tokenis|\btoken\b|investisseur" src/locales/fr.json src/data src/app src/components --include=*.ts --include=*.tsx --include=*.json | grep -v generated
```

- [ ] **Step 2 : Bandeau Capital** (`fr.json` l.1261-1262 et équivalents en.json, `LeasingAdvantages.tsx`) — remplacer par deux colonnes distinctes :
  - Leasing : « Loyers déductibles du résultat imposable »
  - Achat (art. 238 bis AB du CGI) : « Déduction étalée sur 5 ans, dans la limite de 5 ‰ du chiffre d'affaires »
  - Mention : « Renseignez-vous auprès de votre expert-comptable. »
  Idem l.1458 (« 100% charges déductibles ») et l.1663.

- [ ] **Step 3 : Chiffres sans source** — supprimer les 9 KPI non sourcés (identifier dans `Statistics.tsx`, pages Services/Agence) et le témoignage « cote +40 % » (Services, `artSalonCalculations.ts`). Pour chaque chiffre conservé, ajouter une source visible (note de bas de bloc).

- [ ] **Step 4 : Vocabulaire** — « Réseau d'investisseurs » → « Réseau de collectionneurs et d'entreprises » ; mots-clés « art tokenisé » retirés ; manifeste remplacé par la V2 (texte fourni par l'équipe) ; entrées NFT/blockchain du glossaire et de `faq.ts` supprimées (selon décision n°2).

- [ ] **Step 5 : Champ crypto du simulateur Patrimoine** — retirer le champ du formulaire, du calcul, du schéma Zod des deux routes API et du PDF. Vérifier que le total du simulateur reste cohérent sans ce poste.

- [ ] **Step 6 : Données en base** — via `npx prisma studio` : rôle Team « Développeur Blockchain » → « Directeur technique » ; scanner `Translation`, FAQ, `SeoPost` pour les mots interdits (`SELECT … WHERE value ILIKE '%nft%' OR …`). Lister ce qui relève de l'équipe éditoriale.

- [ ] **Step 7 : Vérifier** — grep du Step 1 = 0 ligne hors `src/generated` et noms de variables techniques ; `npm run recette` sans FAIL `vocabulaire`. Tester le simulateur Patrimoine de bout en bout (formulaire → PDF).

- [ ] **Step 8 : Commit** — `fix(content): conformité vocabulaire, bandeau Capital et chiffres sourcés (IRA-15/19/20)`

---

### Task 4 : IRA-12a — Fiche œuvre : chaînes techniques et prix

**Files :**
- Create : `src/utils/formatPrice.ts`
- Modify : `src/app/artwork/[id]/ArtworkPageClient.tsx:105,127,139`

- [ ] **Step 1 : Test qui échoue** — `curl -s localhost:3000/artwork/<slug> | grep -o "artwork.collection\|No description available\|[0-9],[0-9]\{3\} €"` → des occurrences.

- [ ] **Step 2 : Utilitaire de prix**

```ts
// src/utils/formatPrice.ts
const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

/** « 24 000 € » ; null si pas de prix exploitable */
export function formatPrice(price: number | null | undefined): string | null {
  if (price == null || price <= 0) return null
  return eur.format(price)
}
```

- [ ] **Step 3 : Appliquer dans `ArtworkPageClient.tsx`**
  - l.105 : supprimer le `<span className="section-number">{t('artwork.collection')}</span>` (ou ajouter la clé `artwork.collection` dans fr/en si le libellé est voulu : « Collection »).
  - l.127 : `{formatPrice(artwork.price) ?? t('artwork.onDemand')}`
  - l.139 : n'afficher le bloc description que si `sanitizedDescription` est non vide ; supprimer le fallback anglais.

- [ ] **Step 4 : Vérifier** — curl du Step 1 → 0 occurrence ; une œuvre à 24000 affiche « 24 000 € » ; une œuvre sans prix affiche « Prix sur demande » ; une œuvre sans description n'affiche pas de bloc vide. Chercher les autres `toLocaleString()` de prix (`grep -rn "price.*toLocaleString" src`) et les remplacer par `formatPrice`.

- [ ] **Step 5 : Commit** — `fix(artwork): prix fr-FR, description vide masquée, clé i18n brute retirée (IRA-12a)`

---

### Task 5 : IRA-10a + IRA-17a — Accueil et catalogue

**Files :**
- Modify : `src/app/page.tsx`, composant hero de l'accueil (H1), `src/components/home/Statistics.tsx`
- Create : `src/actions/catalogStatsActions.ts`
- Modify : `src/app/presale/page.tsx`, `src/locales/fr.json` / `en.json` (FAQ catalogue)

- [ ] **Step 1 : Test qui échoue** — `curl -s localhost:3000/ | grep -c "<h1"` ≠ 1 ou H1 en bas de page ; « 500 œuvres / 40+ artistes » visibles.

- [ ] **Step 2 : Chiffres depuis la base**

```ts
// src/actions/catalogStatsActions.ts
'use server'
import { prisma } from '@/lib/prisma'

export async function getCatalogStats(): Promise<{ artworks: number; artists: number }> {
  const [artworks, artists] = await Promise.all([
    prisma.presaleArtwork.count(),
    prisma.landingArtist.count({ where: { isActive: true } }),
  ])
  return { artworks, artists }
}
```

(vérifier le chemin d'import réel du client Prisma dans `src/lib/` et le champ `isActive` sur `LandingArtist`.) Appeler `getCatalogStats()` dans `src/app/page.tsx` et passer le résultat en props à `Statistics`.

- [ ] **Step 3 : H1 unique en haut** — le H1 doit être dans le hero (premier écran). Rétrograder tout autre `<h1>` de la page d'accueil en `<h2>`.

- [ ] **Step 4 : Question FAQ en double** — identifier le doublon dans la FAQ accueil (DB ou `fr.json`) et le supprimer.

- [ ] **Step 5 : FAQ catalogue** — remplacer la FAQ « Pourquoi investir dans l'art » (`fr.json` l.2033-2087) utilisée sur `/presale` par la FAQ achat du document « FAQ InRealArt ».

- [ ] **Step 6 : Vérifier** — recette : `/` et `/presale` sans FAIL `h1` ; chiffres affichés = `SELECT count(*)` ; `curl -s localhost:3000/presale | grep -c "Pourquoi investir"` = 0.

- [ ] **Step 7 : Commit** — `fix(home): H1 unique, chiffres réels du catalogue, FAQ achat sur le catalogue (IRA-10a/17a)`

---

### Task 6 : IRA-22 — Cache et revalidation à la publication

**Files :**
- Modify : `src/app/api/revalidate/route.ts`
- Doc : `docs/CACHE_REVALIDATION.md`

- [ ] **Step 1 : Diagnostiquer (mesure avant)**

```bash
for p in / /team /artists/<slug>; do
  echo "== $p"; curl -sI "https://inrealart.com$p" | grep -iE "x-vercel-cache|age|cache-control|cf-cache-status|server"
done
```

Lire : `x-vercel-cache: HIT/STALE` + `age` élevé = ISR Vercel ; `cf-cache-status` = Cloudflare devant Vercel (à purger aussi). Noter le résultat dans `docs/CACHE_REVALIDATION.md`.

- [ ] **Step 2 : Route de revalidation multi-chemins**

```ts
// src/app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const bodySchema = z.object({
  secret: z.string(),
  paths: z.array(z.string().startsWith('/')).min(1).optional(),
  path: z.string().startsWith('/').optional(),
  all: z.boolean().optional(),
})

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const { secret, paths, path, all } = parsed.data
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (all) {
    revalidatePath('/', 'layout') // purge tout le site
    return NextResponse.json({ revalidated: true, scope: 'all' })
  }

  const targets = [...(paths ?? []), ...(path ? [path] : [])]
  if (!targets.length) return NextResponse.json({ error: 'Missing path(s)' }, { status: 400 })
  targets.forEach(p => revalidatePath(p))
  return NextResponse.json({ revalidated: true, paths: targets })
}
```

- [ ] **Step 3 : Brancher le back-office** — le back-office (projet séparé qui écrit en base) doit appeler `POST https://inrealart.com/api/revalidate` avec `{ secret, paths: [...] }` après chaque publication (fiche artiste → `/artists/<slug>`, `/artists`, `/` ; FAQ → page concernée). Documenter le contrat dans `docs/CACHE_REVALIDATION.md`. Purge immédiate : `curl -X POST … -d '{"secret":"…","all":true}'` + « Purge Cache » Vercel (et Cloudflare si présent).

- [ ] **Step 4 : Réduire la fenêtre** — en filet de sécurité, passer `export const revalidate = 1800` à `300` sur les 8 pages concernées (`grep -rn "export const revalidate" src/app`) — critère « < 5 min ».

- [ ] **Step 5 : Vérifier** — modifier une donnée en base, appeler la route, puis `curl -s https://inrealart.com/team | grep "<nouvelle valeur>"` sans paramètre → présent en < 5 min.

- [ ] **Step 6 : Commit** — `fix(cache): revalidation multi-chemins et fenêtre ISR 5 min (IRA-22)`

---

# SPRINT 2 — Indexation et conversion (~15-20 j/h)

> Ce sprint et le suivant dépendent des décisions ci-dessus et des textes FAQ. Ils sont détaillés au niveau fichier ; un plan détaillé par ticket sera rédigé au démarrage de chaque sprint si besoin.

### Task 7 : IRA-01 — Rendu serveur des fiches artistes et œuvres

**Files :** `src/app/artists/[slug]/ArtistPageClientWrapper.tsx`, `ArtistPageClient.tsx`, `src/components/artists/ArtistProfileHero.tsx`, `ArtistProfile.tsx` ; supprimer `ArtistPageAsync.tsx` / `ArtistPageSuspense.tsx` s'ils ne sont plus importés.

- [ ] **Step 1 : Test qui échoue** — `curl -s localhost:3000/artists/<slug> | grep -c "<h1"` → 0, biographie absente du HTML.
- [ ] **Step 2 :** remplacer le `dynamic(() => import('./ArtistPageClient'), { ssr: false })` par un import direct ; `page.tsx` rend `ArtistPageClient` directement (le composant reste `'use client'` mais est pré-rendu côté serveur).
- [ ] **Step 3 :** corriger les accès `window`/`document`/`localStorage` exécutés au rendu (les déplacer dans `useEffect`) ; vérifier l'absence d'erreur d'hydratation dans la console (Chrome DevTools).
- [ ] **Step 4 :** un seul H1 (nom d'usage de l'artiste) — `ArtistProfileHero.tsx:109` et `ArtistProfile.tsx:20` ont chacun un `<h1>` : n'en garder qu'un.
- [ ] **Step 5 :** idem pour la fiche œuvre (H1 l.106 de `ArtworkPageClient.tsx` déjà présent : vérifier que le HTML servi contient description, technique, dimensions).
- [ ] **Step 6 :** appliquer le même traitement aux 6 autres `ssr: false` si le contenu est indexable (`ArtistSliderClientWrapper`, `ArtworkSliderClientWrapper`, `TeamClientWrapper`, `ArtistsStudioPageClient` — garder `ssr: false` uniquement pour Leaflet).
- [ ] **Step 7 : Vérifier** — `curl -s … | grep` trouve bio + titres d'œuvres + un H1 ; recette OK sur `/artists/*`.

### Task 8 : IRA-02 — Meta, Open Graph, JSON-LD

**Files :** `src/utils/generateJsonLd.ts`, `src/app/artwork/[id]/page.tsx`, `src/app/artists/[slug]/page.tsx`, `src/components/common/FAQ/PageFAQ.tsx`.

- [ ] Fiche œuvre : ajouter `VisualArtwork` + `Offer` (`price`, `priceCurrency: 'EUR'`, `availability: isSold ? SoldOut : InStock`, `url` canonique) ; image OG = image de l'œuvre.
- [ ] Fiche artiste : `Person` existe déjà — utiliser le nom d'usage (pseudo) et `sameAs` ; OG image = photo de l'artiste.
- [ ] `FAQPage` JSON-LD généré par `PageFAQ` à partir des mêmes données que le rendu.
- [ ] Vérifier sur 3 URL avec le test des résultats enrichis Google (et `npx schema-dts` facultatif) : 0 erreur.

### Task 9 : IRA-07 — Sitemap et redirections

**Files :** `src/app/sitemap.ts`, `next.config.ts` (`redirects()`), `src/app/artwork/[id]/page.tsx`, `src/proxy.ts`, Create `src/utils/slug.ts`.

- [ ] Déplacer `toSlug` de `src/actions/presaleArtworkActions.ts:5` vers `src/utils/slug.ts` (exporté ; un fichier `'use server'` ne peut exporter que des fonctions async) et l'importer aux deux endroits.
- [ ] Sitemap œuvres : `url: \`${BASE_URL}/artwork/${toSlug(a.name)}\``, dédoublonné par URL.
- [ ] Retirer `/marketplace`, `/about`, `/academy`, `/roadmap`, `/usecase/fractionate`, `/usecase/lending`, `/terms-nft` ; ajouter `/agence`, `/agence/artists`, `/media`, `/services`, `/artists-studio`. `lastModified` réel (pas `new Date()` à chaque génération).
- [ ] `next.config.ts` :

```ts
async redirects() {
  return [
    { source: '/marketplace', destination: '/presale', permanent: true },
    { source: '/about', destination: '/team', permanent: true },
    { source: '/academy', destination: '/blog', permanent: true },
    { source: '/roadmap', destination: '/', permanent: true },
    { source: '/usecase/fractionate', destination: '/usecase', permanent: true },
    { source: '/usecase/lending', destination: '/usecase/leasing', permanent: true },
  ]
},
```
  (destinations à valider ; `/terms-nft` → 410 via `src/proxy.ts` : `return new NextResponse(null, { status: 410 })`.)
- [ ] Fiche œuvre : si `id` est numérique, charger par id et `permanentRedirect(\`/artwork/${toSlug(artwork.name)}\`)`.
- [ ] Test : recette → chaque URL du sitemap 200 + canonical identique ; `curl -sI localhost:3000/artwork/<id>` → 308/301 vers le slug. Puis soumettre le sitemap dans Search Console.

### Task 10 : IRA-05 — Domaine unique

- [ ] Vercel → Domains : domaine retenu (décision n°1) en principal, l'autre en « Redirect 308/301 ».
- [ ] `grep -rn "www.inrealart" src` → aligner `pdfGenerator.ts` et `api/heritage-art-simulator/send-pdf/route.ts` sur `BASE_URL`.
- [ ] Test : `curl -sI https://www.inrealart.com/` → 301/308 ; seule la version retenue répond 200.

### Task 11 : IRA-12b — Fiche œuvre achetable

**Files :** `ArtworkPageClient.tsx`, nouveaux composants `src/components/artwork/ArtworkPurchasePanel.tsx`, `ArtworkReassurance.tsx`, FAQ achat.

- [ ] Boutons « Acheter » (formulaire ou paiement — **décision produit à prendre** : demande d'achat par formulaire Brevo vs. paiement en ligne), « Réserver une visite » (formulaire), « Simuler un leasing » (lien `/loa-simulator?price=…&artwork=…`).
- [ ] Bloc caractéristiques : technique, année, dimensions, certificat d'authenticité, livraison, retours (textes du document FAQ, sans crochets).
- [ ] FAQ achat via `PageFAQ`.
- [ ] Événements GTM sur chaque bouton (`src/utils/` GTM tracking existant).
- [ ] Test : parcours complet manuel (desktop + mobile 390 px) ; e-mail reçu côté équipe.

### Task 12 : IRA-11 — Bandeau de garanties + /garanties

- [ ] Composant serveur `src/components/common/TrustBar.tsx` (certificat, livraison assurée, retours, paiement sécurisé — libellés validés), inséré dans `layout.tsx` ; page `src/app/garanties/page.tsx` avec metadata + canonical ; ajouter `/garanties` à `KNOWN_STATIC_ROUTES` et au sitemap.
- [ ] Test : visible à 390 px et 1440 px ; recette OK sur `/garanties`.

### Task 13 : IRA-17b — FAQ manquantes et contact unique

- [ ] `PageFAQ` rendu côté serveur (retirer son `dynamic()` dans `page.tsx`) sur `/joinInRealArt/artists`, `/simulators`, `/artists-studio`, `/contact`.
- [ ] Formulaire de contact unique `/contact` avec sélecteur de profil (artiste, collectionneur, entreprise, marque, presse) → route API Zod + reCAPTCHA (motif de `api/gallery-contact`). Tous les « Nous contacter » (`Header.tsx:60`, `ContactModal.tsx`…) pointent vers `/contact`.
- [ ] Remplacer les 15 occurrences `@gmail` par l'adresse au nom de domaine (constante unique dans `src/config/`).
- [ ] Test : `grep -rn "@gmail" src` = 0 ; envoi du formulaire pour chaque profil.

### Task 14 : IRA-13 — Nom d'usage unique par artiste

- [ ] Règle d'affichage unique `getArtistDisplayName(artist) = pseudo ?? \`${name} ${surname}\`` dans `src/utils/` ; l'utiliser partout (métadonnées, JSON-LD, cartes, fiche œuvre `artwork/[id]/page.tsx` qui construit encore `name surname`).
- [ ] H1 sur `/artists` (`ArtistsHero.tsx:12` en a un : vérifier qu'il est dans le HTML servi et que l'opacité 0 initiale n'empêche pas l'indexation).
- [ ] Test : `grep -rn "\.name} \${.*surname" src` → seuls usages via l'utilitaire.

### Task 15 : IRA-18 — Simulateurs LOA / Patrimoine

- [ ] LOA : afficher le résultat sans exiger de coordonnées ; la capture de lead devient optionnelle (« Recevoir le PDF »). Une seule URL (choisir entre `/loa-simulator` et l'URL concurrente, 301 de l'autre).
- [ ] Patrimoine : retirer « allocation optimale » de `heritage-art-simulator/layout.tsx` et `fr.json`.
- [ ] Test : simulation complète sans saisir de téléphone.

---

# SPRINT 3 — Structure et croissance (~12-16 j/h)

### Task 16 : IRA-09 — Menu par intention
- [ ] `Header.tsx` + `MobileMenu.tsx` : Œuvres, Artistes, Entreprises, Marques, Magazine, La galerie (selon maquette « Refonte du site ») ; 301 des anciennes URL dans `next.config.ts` ; mise à jour de `KNOWN_STATIC_ROUTES` et `SEGMENT_REDIRECTS`.
- [ ] Test : recette (aucune URL cassée) + clic sur chaque entrée desktop/mobile.

### Task 17 : IRA-08 — Pied de page
- [ ] `Footer.tsx` : 15-20 liens, sans `share.google` ; même composant sur toutes les pages.
- [ ] Test : `grep -c "share.google" src/components/common/Footer.tsx` = 0.

### Task 18 : IRA-16 — Agence
- [ ] Retirer « pré-lancement » (`fr.json`/`en.json`), numérotation continue 01-02-03-04 ; page(s) d'étude de cas Logitech G et Grim (`src/app/agence/cas/[slug]/page.tsx` ou contenu en base) + `KNOWN_STATIC_ROUTES`/`DYNAMIC_PREFIXES` + sitemap.

### Task 19 : IRA-21 — Pages catégories et piliers
- [ ] 12 pages catégories (médium, style, format, budget) : route `src/app/oeuvres/[facet]/[value]/page.tsx` générée statiquement (`generateStaticParams`) avec texte d'intro, liste d'œuvres SSR, FAQ, canonical.
- [ ] 4 pages piliers Entreprises : leasing, achat 238 bis AB, hôtellerie, immobilier (réutiliser `usecase/leasing/hotelPrestige` et `immobilier` existants).
- [ ] Sitemap + maillage depuis menu/pied de page/fiches.

### Task 20 : IRA-06 — Articles anglais
- [ ] Slugs EN propres (ou `noindex` des articles EN non traduits) ; `alternates.languages` FR/EN réciproques dans `src/app/blog/[id]/page.tsx`.
- [ ] Test : aucune URL de blog avec slug tronqué dans le sitemap.

### Task 21 : Mesure
- [ ] `npm run lighthouse` en mobile : LCP < 2,5 s ; événements GA4 `purchase_click`, `visit_booking`, `simulator_start`, `brief_submit`, `artist_apply` via l'utilitaire GTM existant ; vérifier dans DebugView.

---

## Ordre et dépendances

1. Task 1 (recette) avant tout.
2. Tasks 2 → 6 indépendantes entre elles (Sprint 1), Task 6 à faire en premier si possible (priorité absolue de l'audit).
3. Task 7 (SSR) avant Task 8 (JSON-LD) et Task 14 (H1/nom).
4. Task 9 (sitemap) avant soumission Search Console et avant Task 19.
5. Tasks 11, 13, 19 bloquées par les textes du document « FAQ InRealArt » et la maquette.
