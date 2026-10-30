# Audit V2 InRealArt — Plan d'implémentation

> **Pour les agents :** sous-skill requis : superpowers:subagent-driven-development (recommandé) ou superpowers:executing-plans pour exécuter ce plan tâche par tâche. Les étapes utilisent des cases `- [ ]`.

**Objectif :** livrer les 22 tickets de l'audit V2 (IRA-01 → IRA-22) en trois sprints, chaque ticket étant validé par son critère d'acceptation.

**Architecture :** on commence par un script de recette automatisé (`scripts/audit-recette.mjs`) qui encode la section 5 de l'audit ; il sert de « test qui échoue » pour la plupart des tickets SEO/wording. Les corrections de balises sont centralisées dans `src/utils/metadata.ts` et `src/app/layout.tsx` ; les redirections dans `next.config.ts` ; le rendu serveur des fiches passe par la suppression de `ssr: false`.

**Stack :** Next.js 16.2 (App Router, `src/proxy.ts` = middleware), React 19, Prisma 6, Tailwind 3, Zustand, Vercel. (Le CLAUDE.md mentionne Next 15 : il est obsolète, `package.json` indique `^16.2.1`.)

**Spec :** `docs/audit/InRealArt_Audit_V2_plan_action_dev.docx`

## État au 30/10/2026

| Statut | Tasks | Commits |
|---|---|---|
| ✅ En prod (15-16/10) | 1, 2, 3 (sauf test Patrimoine), 4, 5, 6 (code), 7, 8, 9, 10, 14, 15, 17, 20 | `bc2a7a1`, `0fcfce0`…`70d0ada`, `8a7fc72`, `55019d9`, `e700fa3`, `046fd31` |
| 🟡 Partiel | 18 (études de cas bloquées), 21 (LCP < 2,5 s non atteint → chantier performance) | `55019d9`, `ef73be4` |
| ⛔ Bloqué | 11, 12, 13, 16, 19 | — |
| ⏳ Fin d'audit | Test Patrimoine de bout en bout (Task 3, 7e) puis rapport final pour l'associé | — |

**Actions restant à l'utilisateur :** test de purge back-office → landing (Task 6, Steps 3 et 5) ; test LOA + PDF ; déclencheurs/balises GA4 dans GTM + DebugView (Task 21) ; vérifier `RECAPTCHA_SECRET_KEY` et `REVALIDATE_SECRET` sur Vercel ; supprimer `src/app/{about,marketplace,academy,roadmap}` ; traduire les articles EN 133 et 281 ; validation juridique des CGV.

**Constats hors périmètre (à traiter ou à reporter au rapport) :** ✅ corrigés le 30/10 (non commités, vérifiés dans Chrome) : hydratation React #418 sur `/presale` (liens artiste imbriqués dans le lien de la carte → lien étiré, `ArtworkCardOrder.tsx`), `artists/[slug]/error.tsx` traduit FR/EN, `select` nommé sur `/loa-simulator` (sans l'astérisque du placeholder). Revue ✅ (code-reviewer) : aucun défaut. ✅ Corrigé le 30/10 (non commité, vérifié dans Chrome) : hydratation `/loa-simulator` et `/heritage-art-simulator` (image tirée par `Math.random()` au rendu → tirage unique après montage, `src/hooks/useRandomSimulatorImage.ts`, cadre 2:3 en attendant). ✅ Corrigé le 30/10 (non commité) : routes `api/heritage-art-simulator/{send-pdf,send-company-info}` sans reCAPTCHA, sans validation et sans échappement (relais d'e-mails HTML arbitraires vers n'importe quelle adresse) → schéma Zod borné (`src/utils/heritageArtSimulatorSchema.ts`, total = 100 %), reCAPTCHA v3 (`heritage_send_pdf`), recommandation recalculée côté serveur, noms/e-mail/téléphone échappés ; testé en local : 400 données invalides ou ancien format, 403 jeton invalide ; envoi réel à valider pendant le test Patrimoine de bout en bout. `send-company-info` n'est appelée par aucun écran (suppression possible). Revue ✅ (code-reviewer) : aucun défaut ; noté (préexistant, LOA comprise) : jeton reCAPTCHA non encodé dans l'URL de vérification et action non contrôlée, pas de limitation de débit, double e-mail possible si la notification équipe échoue après l'envoi du PDF. ✅ Corrigé le 30/10 (non commité, vérifié dans Chrome) : liens artistes des cartes `/presale` et JSON-LD de la fiche œuvre construits depuis `public.Artist.slug` (31 artistes sur 44 incohérents : slug vide, mal orthographié — `horea-mme`, `gelerie-leadouze`, `galerie-arthema` — ou fiche non publiée → 308 vers `/artists`) → slug de `LandingArtist` publié (`artistsPage`), comme le proxy (`presaleArtworkActions.ts`) ; `/presale` p. 1 : 9 liens sur 12 (contre 5), tous en 200 ; catalogue complet : 32 artistes liés, 32 fiches en 200, JSON-LD de 6 fiches œuvres conforme. Revue ✅ (code-reviewer) : aucun défaut ; ajouté `orderBy: { id: 'asc' }` (choix stable si plusieurs fiches publiées). À signaler au rapport : `public.Artist.slug` à corriger en base (back-office). Noté (préexistant) : 8 photos d'artistes en 404 sur `/artists` (chemin relatif au lieu de l'URL R2), hydratation du H1 de `/artists` (GSAP). Restent : ~~PDF Patrimoine « Allocation optimale : »~~ ✅ corrigé le 30/10 (non commité) : vocabulaire aligné sur l'écran (« Part d'art recommandée », « Répartition recommandée », plus de « patrimoine optimisé » dans l'e-mail) et pied de page qui sortait de la page A4 (placé à 307 mm, dernier encadré coupé) → hauteurs des encadrés resserrées, PDF régénéré et contrôlé visuellement ; `npm run lint` cassé.

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

- [x] ✅ **Step 4 : Commit** — FAIT : commité avec la Task 2 (branche `fix/audit-v2-seo-balises`, mergée dans `main`). Ajouts ultérieurs : `VERCEL_BYPASS` (preview protégée), sortie complète via pipe + résumé par règle.

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

- [x] ✅ **Step 8 : Commit + mise en prod** — FAIT le 15/10/2026 : branche `fix/audit-v2-seo-balises` (commit `bc2a7a1`), preview Vercel validée (recette 1 238 échecs + contrôle visuel OK), mergée dans `main` et déployée.
  - Recette prod après déploiement : **695 URL, 1 238 échecs** (h1 629 · canonical 590 · vocabulaire 19) contre **2 077** avant. `title`, `meta-keywords`, `sitemap-domaine`, `status` : 0.

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

- [x] ✅ **Step 1 : Test qui échoue** — `npm run recette` → FAIL `vocabulaire` ; et inventaire code :

```bash
grep -rniE "nft|blockchain|web3|tokenis|\btoken\b|investisseur" src/locales/fr.json src/data src/app src/components --include=*.ts --include=*.tsx --include=*.json | grep -v generated
```

  **FAIT (15/10/2026)** : recette prod → **19 FAIL `vocabulaire`** (résultat : `scratchpad/recette-prod-apres-t2.txt`). Inventaire :

  **A. Pages du site (texte visible, 12 pages)**
  | Page | Texte en cause | Origine |
  |---|---|---|
  | `/about`, `/team` | rôle « Directeur technique / Développeur Blockchain » ; bio « spécialisé en blockchain et data » (`/about`) | rôle : base (`Team`) ; bio : `fr.json:179` `about.team.paragraph3Description` (`AboutTeam.tsx:20`) |
  | `/manifest` | « L'innovation (tokenisation, contrats intelligents…) », « dont la tokenisation » | `fr.json` `manifest.p2/p4` (manifeste V2 attendu de l'équipe) |
  | `/academy` | « …sur l'art, la tokenisation et le patrimoine » | `fr.json` `academy.hero` |
  | `/heritage-art-simulator` | « Crypto / Actifs numériques (%) », libellé graphique « Crypto », « Profil investisseur » | `fr.json:3064,3067,3096` (`heritageArtSimulator.form.*`), `heritageArtCalculations.ts:121` (+ champ `crypto` dans le calcul) ; e-mails/PDF : `send-pdf/route.ts:22,66,77,211,229,239`, `send-company-info/route.ts:31,43,76` |
  | `/usecase/companies` | FAQ « Les œuvres d'entreprise peuvent-elles être tokenisées ? » | **base** (FAQ `usecaseCompanies` via `PageFAQ`) — pas dans le code |
  | `/usecase/lending` | « Sécurité et Transparence via la Blockchain », « Finance Décentralisée (DeFi)… Web3 » | `fr.json:1905-1906` `lending.whyChoose.items` rendus par `ForWho.tsx:13-20` (`WhyChoose.tsx` n'est pas utilisé) — **page entière bâtie sur la DeFi** |
  | `/usecase/fractionate` | « tokenisation fractionnée », « revendre vos tokens », « investisseurs » | `fr.json` `fractionate.*` — **page entière bâtie sur la tokenisation** |
  | `/joinInRealArt/galleries` | « Réseau d'investisseurs » | `fr.json:719` |
| `/marketplace` | `alt` de l'image hero « …Investisseurs de Prestige » | `fr.json:510` / `en.json:505` `marketplace.hero.title` (`Hero.tsx:13`) |
  | `/glossary` | onglet et définitions Blockchain/NFT | `src/data/glossary.ts` (décision n°2) |
  | `/terms` | CGV : NFT/blockchain dans ~11 articles sur 26 (`lots`, `nft`, `physicalNft`, `presale`, `authenticity`, `advantages`, `salesTerms`, `commitment`, `copyright`, `buyerCommitments`, `modifications`) + « cryptomonnaie » (`price`) | `fr.json:2393-2441` `terms.*` — **texte juridique** |
  | `/terms-nft` | page entière | `src/app/terms-nft/page.tsx` (décision n°2) |

  **B. Contenus de la base (7 URL, ne relèvent pas du code)** : articles Artprice FR/EN et « Art contemporain 2026 » FR/EN (« NFT » cité comme segment de marché), portrait Alexandre Leadouze FR/EN (« investisseur »), catégorie blog `investissements-leasing` (extrait d'article « L'art attire les investisseurs »). → décision éditoriale déjà ouverte (garder / reformuler / exclure de la règle).

  **C. Non vu par la recette (head, JSON-LD, e-mails, fichiers `public/`) mais à corriger** : `public/llms.txt` (11), `public/llms-full.txt` (16), `public/capabilities.txt` (13), `public/agents.txt:77`, `public/footer.sitemap.xml:89` (`/terms-nft`) — lus par les crawlers et les IA ; JSON-LD Organisation de l'accueil `metadata.ts:226` `knowsAbout: 'art tokenization'` ; libellés des tags de blog `blog.tags.nft/blockchain/tokenization` (`fr.json:1997-2003`, affichés par `BlogPostCard.tsx:17` si un article de la base porte ces tags) ; `terms-nft/layout.tsx` (title/description) ; descriptions `blog/category/layout.tsx`, `blog/category/[slug]/page.tsx`, `faq/translated/layout.tsx`, `glossary/layout.tsx` (« art tokenisé », « blockchain, NFTs ») ; `heritage-art-simulator/layout.tsx` ; JSON-LD `generateBlogJsonLd` (`metadata.ts:457,471,475` « tokenisation », émis sur `/blog`) ; `sitemap.ts:38` (`/terms-nft`) ; e-mails/PDF heritage (« Profil investisseur »). `keywords` restants (`artwork/[id]`, `joinInRealArt/artists`, `terms-nft`, `defaultMetadata`) : non émis depuis la Task 2, à retirer pour propreté.

  **D. Code mort (jamais importé/rendu → aucun effet visible ; à supprimer, sinon le grep du Step 7 ne sera jamais à 0)** : `src/components/token/*` (9 fichiers), `src/components/presale/TokenHero.tsx`, `src/components/presale/PresaleFeatures.tsx`, `src/actions/tokenActions.ts` ; `src/data/faq.ts`, `faq.backup.ts`, `leasing.ts` ; `src/components/usecase/lending/WhyChoose.tsx`, `usecase/leasing/SliderSection.tsx`, `blog/WeeklyMostReadPosts.tsx` ; rendus commentés : `home/HowItWorks.tsx`, `usecase/CustomerStories.tsx`, `ReadyToStart.tsx` ; `defaultMetadata.token` (`metadata.ts:525`) ; `generateBlogListJsonLd` (`generateJsonLd.ts:195`, jamais appelé) ; maquettes `src/templates/*.html`. Clés i18n mortes : `token.*`, `presale.token.*`, `nav.ico`, `intro.title`, `footer.termsNft`, `faq.tabs.*`, `blog.articles.*` (~100 lignes), `leasing.slider.*`, `home.howItWorks.*`, `usecase.items.*`, `roadmap.items.*` (`/roadmap` rend `items={[]}`), `lending.advantages.subtitle`, `cookieConsent.csrfTokens`, `en.json` `generalConditions` (~200 lignes).
  Le reviewer a corrigé : `WhyChoose.tsx`, `PresaleFeatures.tsx`, `leasing.ts` (listés en « Modify ») sont morts → suppression, pas modification.

  **E. Faux positifs (technique, à laisser)** : « token reCAPTCHA » (commentaires), clé `'/terms-nft'` de `StickyFooterManager`. L'état initial `useState("Blockchain")` de `glossary/page.tsx:13` est technique mais devra suivre `glossaryTabs` (`glossary.ts:3`, visible).

  - [x] ✅ **Revue Step 1** — inventaire complété : fichiers `public/` (llms, capabilities, agents, footer.sitemap), JSON-LD Organisation, `alt` du hero `/marketplace`, étendue réelle des CGV, libellé « Crypto » du graphique, tags de blog ; sources corrigées (bio `/about` dans `fr.json`, FAQ `/usecase/companies` en base, `/usecase/lending` via `ForWho.tsx`) ; code mort élargi.

  **Décisions prises (15/10/2026)** : (1) `/usecase/fractionate` et `/usecase/lending` **dépubliés** (redirection 308 vers `/usecase`, retrait du sitemap et des liens internes, `KNOWN_STATIC_ROUTES` conservé tant que la redirection existe) ; (2) CGV `/terms` : **passages NFT retirés** (validation juridique à faire par l'utilisateur) ; (3) `/terms-nft` : **supprimée** (410) + entrées NFT/Blockchain du glossaire retirées ; (4) manifeste : **retrait des mentions de « tokenisation »** (pas d'attente du texte V2) ; (5) rôle Team : **déjà modifié dans le back-office** ; bio `/about` (`fr.json:179`) à reformuler dans le code ; (6) articles de blog : **en attente de décision** (slugs communiqués).

  **Décisions qui étaient nécessaires avant les Steps 4-6** : (1) `/usecase/fractionate` et `/usecase/lending` — réécrire, ou dépublier (noindex + retrait sitemap + redirection, cf. Task 9) ; (2) CGV `/terms` — retrait des articles NFT à valider juridiquement ; (3) `/terms-nft` et glossaire (décision n°2) ; (4) texte du manifeste V2 ; (5) nouveau libellé du rôle et de la bio Team ; (6) articles de blog et FAQ `usecaseCompanies` en base.

- [ ] ↩️ **Step 2 : Bandeau Capital** — ANNULÉ à la demande de l'utilisateur (15/10/2026) : wording d'origine restauré (LeasingCTA, l.1458, l.1663), à revoir ultérieurement. (`fr.json` l.1261-1262 et équivalents en.json, `LeasingAdvantages.tsx`) — remplacer par deux colonnes distinctes :
  - Leasing : « Loyers déductibles du résultat imposable »
  - Achat (art. 238 bis AB du CGI) : « Déduction étalée sur 5 ans, dans la limite de 5 ‰ du chiffre d'affaires »
  - Mention : « Renseignez-vous auprès de votre expert-comptable. »
  Idem l.1458 (« 100% charges déductibles ») et l.1663.
  **(Annulé — historique)** : `LeasingCTA.tsx` rendait deux blocs (leasing / achat art. 238 bis AB) + mention expert-comptable ; clés `presale.leasing.{lease,purchase,disclaimer}` FR/EN (`bullets` retiré) ; l.1458 et l.1663 reformulées en « loyers déductibles du résultat imposable ». `LeasingAdvantages.tsx` déjà conforme. `tsc` OK, JSON valides. Conservé : `loaSimulator…benefits.fullDeductibility` (« loyers déductibles à 100 % », exact pour le leasing). Non commité.

- [x] ✅ **Step 3 : Chiffres sans source** — supprimer les 9 KPI non sourcés (identifier dans `Statistics.tsx`, pages Services/Agence) et le témoignage « cote +40 % » (Services, `artSalonCalculations.ts`). Pour chaque chiffre conservé, ajouter une source visible (note de bas de bloc).
  **FAIT (15/10/2026)** : les « 9 KPI » = `agence.caseStudies` (3 cas × 3 métriques, `AgenceCaseStudies.tsx`, jamais importé) → clés supprimées FR/EN. Témoignage « cote +40 % » (`services.testimonial`) → bloc retiré de `services/page.tsx`, clés supprimées. `tsc` OK, JSON valides. ⏳ Fichiers orphelins à supprimer (suppression refusée par le garde-fou) : `src/components/agence/AgenceCaseStudies.tsx`, `src/app/services/components/TestimonialSection.tsx`. **Décision utilisateur** : stats de l'accueil (500 / 40+ / 150+ / 20+) conservées telles quelles ; « +18 % satisfaction équipes » (`/usecase`, `usecase.scenarios.scenario1.roi`) conservé tel quel. Non commité.

- [x] ✅ **Step 4 : Vocabulaire** — « Réseau d'investisseurs » → « Réseau de collectionneurs et d'entreprises » ; mots-clés « art tokenisé » retirés ; manifeste remplacé par la V2 (texte fourni par l'équipe) ; entrées NFT/blockchain du glossaire et de `faq.ts` supprimées (selon décision n°2).
  **FAIT (15/10/2026)** : « Réseau de collectionneurs et d'entreprises » (galeries, FR/EN) ; manifeste sans « tokenisation » (p2/p4) ; `/academy` et alt `/marketplace` (« Entreprises de Prestige ») ; « art tokenisé »/blockchain retirés des metadata (blog/category ×2, faq/translated, artwork, joinInRealArt/artists, glossary, heritage-art-simulator) ; glossaire réduit aux onglets Finance et Art (items Blockchain/NFT/Technique supprimés, 3 définitions reformulées). `tsc` OK. Non commité. **Restent pour Step 7** : `/terms-nft` (suppression 410), CGV NFT, `/usecase/fractionate|lending` (redirection), `fr.json` (académie/leasing/fractionate…), `public/*.txt`, JSON-LD `knowsAbout`, code mort, `faq.ts` (mort → suppression), base de données.

- [x] ✅ **Step 5 : Champ crypto du simulateur Patrimoine** — retirer le champ du formulaire, du calcul, du schéma Zod des deux routes API et du PDF. Vérifier que le total du simulateur reste cohérent sans ce poste.
  **FAIT (15/10/2026)** : `crypto` retiré du formulaire (le champ Biens tangibles rejoint la grille 2×2), de `heritageArtCalculations.ts` (types, total = 100 % sur 4 postes, concentration, répartition ajustée, libellés et couleur du graphique), de `HeritageArtResults.tsx`, du PDF et des 2 e-mails (`send-pdf`, `send-company-info` ; hauteurs de blocs PDF ajustées), clé i18n `heritageArtSimulator.form.crypto` FR/EN. Pas de schéma Zod dans ces deux routes (types TS seulement). Au passage : « Profil investisseur » → « Profil patrimonial » (formulaire FR, e-mails, PDF ; EN « Wealth Profile »). `tsc` OK. **Test bout en bout (formulaire → résultats → PDF/e-mail) à faire par l'utilisateur.** Non commité.

- [x] ✅ **Step 6 : Données en base** (FAIT le 15/10/2026 — SQL exécuté par l'utilisateur, vérification finale : 0 ligne ; sauvegarde dans le schéma `bak_20261015`, à supprimer après validation prod. **Restent hors code** : tags `blockchain`/`crypto`/`tokenisation`/`tokenisation-art` (requête de contrôle puis suppression), réécriture éditoriale des 4 articles N2 dans le back-office) — via `npx prisma studio` : rôle Team « Développeur Blockchain » → « Directeur technique » ; scanner `Translation`, FAQ, `SeoPost` pour les mots interdits (`SELECT … WHERE value ILIKE '%nft%' OR …`). Lister ce qui relève de l'équipe éditoriale.
  **Résultat du scan (15/10/2026)** — faux positifs ignorés : `token=` des URL Firebase, « define/definition/redefining/défiscalisation ».
  - **Brouillons (17, non publics)** : tous les articles cœur blockchain/tokenisation/RWA/fractionné FR+EN restent en `DRAFT` (ne jamais publier sans réécriture) ; à supprimer : `test-gilles`, `en-gilles-test`, article à slug vide.
  - **Équipe** : `Team` 1 (« développement blockchain »), 2 et 11 (« investisseurs ») + `Translation` 3098, 3099, 1438, 1439, 2514, 2515 → reformulation.
  - **FAQ** : `DetailedFaqItem` 17, 22, 28, 32, 33, 34, 51, 64, 68 à reformuler ; **45** (« token $IRA ») et `DetailedFaqPageItem` **63** (« œuvres tokenisées ») à supprimer ; `Translation` 2993 (« profil investisseur »).
  - **Tags** `SeoTag` blockchain, crypto, tokenisation, tokenisation-art → supprimer (après détachement des articles).
  - **Blog publié (39)** : N1 champs courts (meta/excerpt/mots-clés) → `UPDATE` ; **N2** (section NFT/tokens/contrats intelligents : `investissement-dans-lart-pour-le-dirigeant…`, `le-cycle-de-vie…` ×3, `lart-ce-passeur-silencieux…` ×2, `inrealart-dans-le-paysage-du-pret-garanti…` ×2) → **réécriture éditoriale (décision utilisateur)** ; **N3/N4** (mentions ponctuelles, « investisseur ») → **hors recette (décision utilisateur)**, aucune modification en base. `scripts/audit-recette.mjs` : corps des articles `/blog/<slug>` exclu de la règle `vocabulaire` (title, meta description et H1 restent contrôlés).
  - **Décision 6 (7 articles de blog)** : tranchée par ce qui précède.
  - **Passages N2 relevés (15/10/2026)** : `investissement-dans-lart-pour-le-dirigeant…` (h3 « fractionnement et de tokenisation » + « tokens numériques ») ; `le-cycle-de-vie…optimisation…` + EN (§ 5.3 « Les NFT et les nouvelles formes de valeur numérique », intro « les NFT », conclusion « minter des NFT ») ; `lart-ce-passeur-silencieux…` + EN (h3 « Les NFT : un patrimoine dématérialisé sous tension », « 70 % des plates-formes NFT… Rapport INA 2024 » à sourcer) ; `inrealart-dans-le-paysage-du-pret-garanti…` + EN (« NFT » VC, « crypto-art », « blockchain pour la traçabilité »). Contenu = blocs JSON (`content` + `richContent`) : à éditer dans le back-office, pas en SQL. Les versions EN contiennent des blocs restés en français.
  - **Script SQL fourni à l'utilisateur** (FAQ 17/22/28/32/33/34/51/64/68, suppression FAQ 45 et page-item 63, bios Team, `Translation` 2993, meta/mots-clés/excerpt N1, tags) — à exécuter par l'utilisateur ; attendre la revalidation ISR (≤ 30 min) avant de relancer la recette.

- [~] **Step 7 : Vérifier** (7a-7d faits, 7e : recette OK ; reste le test du simulateur avec Chrome en toute fin) (découpé en 7a-7e ci-dessous) — grep du Step 1 = 0 ligne hors `src/generated` et noms de variables techniques ; `npm run recette` sans FAIL `vocabulaire`. Tester le simulateur Patrimoine de bout en bout (formulaire → PDF).
  - [x] ✅ **7a — Pages dépubliées** (FAIT 15/10/2026) : `/terms-nft` → **410** (`GONE_ROUTES` dans `src/proxy.ts`) ; `/usecase/fractionate` et `/usecase/lending` retirées de `KNOWN_STATIC_ROUTES` → redirection **308 vers `/usecase`** ; retirées de `sitemap.ts`, `StickyFooterManager.tsx`, `public/footer.sitemap.xml`, `llms.txt`, `llms-full.txt`, `agents.txt`, `capabilities.txt` (`acquire_via_lending`). Aucun lien interne actif (CaseStudies/ReadyToStart/CustomerStories = code mort → 7d). `tsc` OK. Dossiers `src/app/terms-nft`, `src/app/usecase/{fractionate,lending}`, `src/components/usecase/{fractionate,lending}` injoignables : suppression en 7d. À vérifier après déploiement : `curl -sI /terms-nft` → 410 ; `curl -sI /usecase/lending` → 308 vers `/usecase`.
  - [x] 7b ✅ — CGV `/terms` : 7 articles NFT supprimés (nft, physicalNft, presale, authenticity, advantages, salesTerms, commitment), lots/copyright/buyerCommitments/modifications/price réécrits sans NFT ni cryptomonnaie, renumérotation 1-19 ; **à valider juridiquement**.
  - [x] 7c ✅ — `llms.txt`, `llms-full.txt`, `capabilities.txt` (tokenisation/NFT/blockchain/investisseurs/fractionnement/prêt garanti retirés), JSON-LD `knowsAbout` et `generateBlogJsonLd`, bloc `token` de `defaultMetadata` supprimé. `terms-nft/layout.tsx` reste jusqu’au 7d (dossier à supprimer).
  - [x] 7d ✅ — Clés i18n mortes retirées de `fr.json`/`en.json` (`termsNft`, `token`, `fractionate`, `lending`, `intro`, `presale.token`, `presale.buyProcess`, `footer.termsNft`, `blog.articles`, `blog.tags.{nft,blockchain,tokenization}`, `faq.tabs.{nft,token}`, `leasing.slider`, `roadmap.items`, `nav.ico`, `usecase.items.{fractionate,gallery,lending}`, `joinInRealArt.artists.metadata`) ; 2 clés vivantes réécrites (`about.team.paragraph3Description`, `home.howItWorks.items.art.description`). **Suppression des fichiers morts à faire par l'utilisateur** (commande `rm -r` fournie), puis `npx tsc --noEmit`.
  - [~] 7e — **Recette locale (build prod, base réelle) FAITE le 15/10/2026 : 0 FAIL `vocabulaire`** (692 URL, 1 219 échecs restants = h1/canonical `/artwork/{id}` ×590 → Task 9, h1 `/artists/*` ×37, `/presale` et `/usecase` 2 H1). Build OK, 410 `/terms-nft`, 308 `/usecase/{lending,fractionate}`. **Reste : test du simulateur Patrimoine avec Chrome, à la toute fin (décision utilisateur).**

- [x] ✅ **Step 8 : Commit** — FAIT et poussé sur `main` le 15/10/2026 (commits `5ef7b23`, `63cec07`, `70d0ada` + précédents) — `fix(content): conformité vocabulaire, bandeau Capital et chiffres sourcés (IRA-15/19/20)`

---

### Task 4 : IRA-12a — Fiche œuvre : chaînes techniques et prix

**Files :**
- Create : `src/utils/formatPrice.ts`
- Modify : `src/app/artwork/[id]/ArtworkPageClient.tsx:105,127,139`

- [x] ✅ **Step 1 : Test qui échoue** — FAIT le 15/10/2026 (build local, 3 fiches : `ascension-de-lamour`, `bacchanalia-kylix`, `bleu-royal`) : `artwork.collection` et `No description available` présents dans le HTML servi ; prix déjà rendus « 9 000 € » (espace fine) côté serveur, `toLocaleString()` à vérifier avec une locale explicite. `curl -s localhost:3000/artwork/<slug> | grep -o "artwork.collection\|No description available\|[0-9],[0-9]\{3\} €"` → des occurrences.

- [x] ✅ **Step 2 : Utilitaire de prix** — FAIT (`src/utils/formatPrice.ts`)

```ts
// src/utils/formatPrice.ts
const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })

/** « 24 000 € » ; null si pas de prix exploitable */
export function formatPrice(price: number | null | undefined): string | null {
  if (price == null || price <= 0) return null
  return eur.format(price)
}
```

- [x] ✅ **Step 3 : Appliquer dans `ArtworkPageClient.tsx`** — FAIT (span `artwork.collection` retiré ; `formatPrice` ; bloc description conditionné à `rawDescription`, fallback anglais supprimé ; `AgenceGalleryBridge.tsx` aligné) ; `tsc` OK
  - l.105 : supprimer le `<span className="section-number">{t('artwork.collection')}</span>` (ou ajouter la clé `artwork.collection` dans fr/en si le libellé est voulu : « Collection »).
  - l.127 : `{formatPrice(artwork.price) ?? t('artwork.onDemand')}`
  - l.139 : n'afficher le bloc description que si `sanitizedDescription` est non vide ; supprimer le fallback anglais.

- [x] ✅ **Step 4 : Vérifier** — FAIT le 15/10/2026 (build local, 12 fiches de `/presale`) : 0 occurrence de `artwork.collection`, `No description available` ou `1,900 €` ; « 1 900 € » (fr-FR) ; 3 œuvres sans prix → « Sur demande » (`defender`, `le-premier-regard`, `marry-me`) ; 1 œuvre sans description (`defender`) → pas de bloc vide. Reste **Step 5 : commit**. — — curl du Step 1 → 0 occurrence ; une œuvre à 24000 affiche « 24 000 € » ; une œuvre sans prix affiche « Prix sur demande » ; une œuvre sans description n'affiche pas de bloc vide. Chercher les autres `toLocaleString()` de prix (`grep -rn "price.*toLocaleString" src`) et les remplacer par `formatPrice`.

- [x] ✅ **Step 5 : Commit** — FAIT (`8a7fc72`) — `fix(artwork): prix fr-FR, description vide masquée, clé i18n brute retirée (IRA-12a)`

---

### Task 5 : IRA-10a + IRA-17a — Accueil et catalogue

**Files :**
- Modify : `src/app/page.tsx`, composant hero de l'accueil (H1)
- Modify : `src/app/presale/page.tsx`, `src/locales/fr.json` / `en.json` (FAQ catalogue)

- [x] ✅ **Step 1 : Test qui échoue** — FAIT le 15/10/2026 : `/` a 1 seul H1 mais à **98 % du HTML** (hero streamé après les requêtes DB, juste avant le footer) ; `/presale` a **2 H1** (« Catalogue unique… » + « Des questions sur nos œuvres ? » du `PageFAQ`). « 500 œuvres / 40+ artistes » : conservés (décision). `curl -s localhost:3000/ | grep -c "<h1"` ≠ 1 ou H1 en bas de page ; « 500 œuvres / 40+ artistes » visibles.

- [x] ✅ **Step 2 : Chiffres depuis la base** — ABANDONNÉ (décision utilisateur 15/10/2026) : les stats de l'accueil (500 / 40+ / 150+ / 20+) restent telles quelles ; `getCatalogStats()` non créé.

- [x] ✅ **Step 3 : H1 unique en haut** — FAIT : nouveau `HomeSeoHeading.tsx` (H1 `sr-only`, claim par défaut `exhibitions.hero.claimCollector`) rendu avant `HomeHeroWrapper` ; le titre animé de `HomeHero.tsx` passe de `<h1>` à `<p>` ; `tsc` OK. **H1 `/presale` en double (PageFAQ) : à traiter au Step 5.** — — le H1 doit être dans le hero (premier écran). Rétrograder tout autre `<h1>` de la page d'accueil en `<h2>`.

- [x] ✅ **Step 4 : Question FAQ en double** — IDENTIFIÉ, NON CORRIGÉ EN BASE (décision utilisateur 15/10/2026, option C) : FAQ `/faq` en base, item 171 doublon FR de 169 + traductions EN décalées de 2 rangs sur les items 170-174 (texte FR resté en EN, « Why invest in art today? »). Correction laissée à l'équipe éditoriale (back-office) ; à signaler dans le rapport final.

- [x] ✅ **Step 5 : FAQ catalogue** — FAIT côté code, contenu reporté back-office (décision utilisateur 15/10/2026) : `FAQClient.tsx` `<h1>` → `<h2>` (résout le H1 en double de `/presale`) ; les questions/réponses de la FAQ achat sont paramétrées dans le back-office (table `Faq`), à mettre à jour par l'équipe et à signaler dans le rapport final. Prévu initialement : remplacer la FAQ « Pourquoi investir dans l'art » (`fr.json` l.2033-2087) utilisée sur `/presale` par la FAQ achat du document « FAQ InRealArt ».

- [x] ✅ **Step 6 : Vérifier** — FAIT le 16/10/2026 (build local) : `/` 1 H1 (à 26 % du HTML, avant le hero), `/presale` 1 H1. « Pourquoi investir » encore 2× sur `/presale` : contenu de la table `Faq` (back-office, décision Step 5), pas du code. Ajouté : `/usecase` avait 2 H1 (le formulaire LOA intégré `ArtworkLeaseForm.tsx` rendait un `<h1>`) → prop `headingLevel` (`h1` par défaut sur `/loa-simulator`, `h2` dans `UseCaseInlineSimulator`) ; `tsc` OK. ⚠️ Outil : `curl | grep` est réécrit par le hook rtk et fausse les comptages → mesurer avec `scratchpad/h1.py` (urllib).
  - [x] ✅ **Revue Task 5** — aucun défaut à forte confiance ; aucune page ne passe à 0 H1 (seul `/presale` rend `FAQClient`, son H1 vient de `PresaleHero`) ; H1 `sr-only` = claim visible par défaut du hero (pas de contenu caché trompeur). Mineur reporté : sur `/usecase`, titre du formulaire en `h2` juste sous le `h2` de section (un `h3` serait plus propre).

- [x] ✅ **Step 7 : Commit** — FAIT le 16/10/2026 dans `55019d9` (en prod) — `fix(home): H1 unique en haut, H1 en double retiré de /presale et /usecase (IRA-10a/17a)` — fichiers : `src/app/page.tsx`, `src/components/home/HomeHero.tsx`, `src/components/home/HomeSeoHeading.tsx` (nouveau), `src/components/common/FAQ/FAQClient.tsx`, `src/components/loa-simulator/ArtworkLeaseForm.tsx`, `LoaSimulatorClient.tsx`, `src/components/usecase/UseCaseInlineSimulator.tsx`

---

### Task 6 : IRA-22 — Cache et revalidation à la publication

**Files :**
- Modify : `src/app/api/revalidate/route.ts`
- Doc : `docs/CACHE_REVALIDATION.md`

> **Bilan Task 6 (16/10/2026)** — Steps 1, 2, 4 faits ; Step 3 = doc du contrat faite, branchement du back-office **à faire par l'équipe back-office** ; Step 5 = à refaire en prod après déploiement. Constat clé : toutes les routes sont dynamiques (`StickyFooterManager` lit `headers()` dans le layout) → prod `MISS` + `no-store`, contenu à jour à chaque requête ; l'ISR est inactif. Ruling : on garde ce rendu dynamique (le critère < 5 min est tenu) ; rendre les pages statiques pour la performance = sujet Task 21, à condition de brancher le back-office avant. Détails : `docs/CACHE_REVALIDATION.md`.
> - [x] ✅ **Revue Task 6** — API Next 16 correcte (`revalidateTag(tag, { expire: 0 })`), proxy laisse passer `/api/*`, doc conforme aux routes réelles, aucune autre couche de cache (seul store persisté = langue). Corrigé : **Important** 9 pages lisant la base sans filet (`/presale`, `/faq`, `/faq/translated`, `/about`, `/academy`, `/agence`, `/agence/artists`, `/agence/artists/[slug]`, `/blog/category/[slug]`) → `revalidate = 300` ; mineurs : secret comparé en temps constant (SHA-256 + `timingSafeEqual`), bornes sur `paths`/`tags`, tableau du contrat complété (catégories, agence, FAQ, `all`). Testé en local : 400 / 401 / 400 sans cible / 200 paths+tags / 200 all.

- [x] ✅ **Step 1 : Diagnostiquer (mesure avant)** — FAIT : `/`, `/team`, `/artists`, `/presale` → `x-vercel-cache: MISS`, `cache-control: private, no-cache, no-store`, `age: 0`, pas de Cloudflare.

```bash
for p in / /team /artists/<slug>; do
  echo "== $p"; curl -sI "https://inrealart.com$p" | grep -iE "x-vercel-cache|age|cache-control|cf-cache-status|server"
done
```

Lire : `x-vercel-cache: HIT/STALE` + `age` élevé = ISR Vercel ; `cf-cache-status` = Cloudflare devant Vercel (à purger aussi). Noter le résultat dans `docs/CACHE_REVALIDATION.md`.

- [x] ✅ **Step 2 : Route de revalidation multi-chemins** — FAIT (+ `tags`, comparaison du secret en temps constant)

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

- [~] **Step 3 : Brancher le back-office** — contrat documenté dans `docs/CACHE_REVALIDATION.md` ; **appel à implémenter côté back-office** ; vérifier que `REVALIDATE_SECRET` est défini dans Vercel (Production). — le back-office (projet séparé qui écrit en base) doit appeler `POST https://inrealart.com/api/revalidate` avec `{ secret, paths: [...] }` après chaque publication (fiche artiste → `/artists/<slug>`, `/artists`, `/` ; FAQ → page concernée). Documenter le contrat dans `docs/CACHE_REVALIDATION.md`. Purge immédiate : `curl -X POST … -d '{"secret":"…","all":true}'` + « Purge Cache » Vercel (et Cloudflare si présent).

- [x] ✅ **Step 4 : Réduire la fenêtre** — FAIT : 16 pages à `revalidate = 300` + `unstable_cache` de `/services` à 300 s. — en filet de sécurité, passer `export const revalidate = 1800` à `300` sur les 8 pages concernées (`grep -rn "export const revalidate" src/app`) — critère « < 5 min ».

- [ ] **Step 5 : Vérifier** — code en prod (`55019d9`) ; test de purge à faire par l'utilisateur une fois le back-office branché — modifier une donnée en base, appeler la route, puis `curl -s https://inrealart.com/team | grep "<nouvelle valeur>"` sans paramètre → présent en < 5 min.

- [x] ✅ **Step 6 : Commit** — FAIT le 16/10/2026 dans `55019d9` (+ sitemap `e700fa3`) — `fix(cache): revalidation multi-chemins et fenêtre ISR 5 min (IRA-22)`

---

# SPRINT 2 — Indexation et conversion (~15-20 j/h)

> Ce sprint et le suivant dépendent des décisions ci-dessus et des textes FAQ. Ils sont détaillés au niveau fichier ; un plan détaillé par ticket sera rédigé au démarrage de chaque sprint si besoin.

### Task 7 : IRA-01 — Rendu serveur des fiches artistes et œuvres

**Files :** `src/app/artists/[slug]/ArtistPageClientWrapper.tsx`, `ArtistPageClient.tsx`, `src/components/artists/ArtistProfileHero.tsx`, `ArtistProfile.tsx` ; supprimer `ArtistPageAsync.tsx` / `ArtistPageSuspense.tsx` s'ils ne sont plus importés.

- [x] ✅ **Step 1 : Test qui échoue** — FAIT (16/10/2026) : recette locale → 14/14 fiches `/artists/*` testées à 0 H1 (HTML servi = squelette).
- [x] ✅ **Step 2 :** FAIT — `page.tsx` rend `ArtistPageClient` directement ; supprimés : `ArtistPageClientWrapper.tsx`, `ArtistPageAsync.tsx`, `ArtistPageSuspense.tsx` (non importés).
- [x] ✅ **Step 3 :** FAIT — aucun accès `window`/`document`/`localStorage` au rendu (tous dans `useEffect`/handlers ; `useTranslation` force `fr` avant hydratation). Chrome headless sur 2 fiches : aucune erreur React #418/#423 (Chrome DevTools MCP indisponible : profil déjà utilisé par un autre Chrome).
- [x] ✅ **Step 4 :** FAIT — `ArtistProfile.tsx` (2e H1) n'était importé nulle part → supprimé. Corrigé en plus : le H1 de `ArtistProfileHero.tsx` contenait 2 spans du nom (mobile + desktop) → HTML « Ophélie SIMONET SIMONET » ; fusionnés en un span responsive.
- [x] ✅ **Step 5 :** FAIT — fiche œuvre déjà pré-rendue (titre, artiste, dimensions, prix, « À propos de l'œuvre »). La **technique** n'est pas un champ du modèle `PresaleArtwork` → Task 11 (IRA-12b).
- [x] ✅ **Step 6 :** Ruling — `ssr: false` conservé sur les carrousels de l'accueil (`ArtistSliderClientWrapper`, `ArtworkSliderClientWrapper`, `PartnersClientWrapper`, `MediaPartnersWrapper`) : Swiper avec garde `mounted`, cartes en `div onClick` (aucun lien crawlable, gain SEO marginal, risque d'hydratation) ; `TeamClientWrapper` : `Team` commenté sur l'accueil, non rendu ailleurs ; `ArtistsStudioMap` (Leaflet) conservé. Coût si faux : pas de maillage interne accueil → fiches dans le HTML (à reprendre en Task 19 avec de vrais `<Link>`).
- [x] ✅ **Step 7 : Vérifier** — FAIT (build local) : `/artists/ophelie-simonet` « Ophélie SIMONET », `/artists/galerie-artthema`, `/artists/horea`, `/artists/stefan-beiu` → 1 H1 chacune ; biographie (« Biographie & Démarche… ») et 3-4 liens `/artwork/...` dans le HTML servi.
  - [x] ✅ **Revue Task 7** — aucun défaut Critique/Important ; ruling Step 6 jugé défendable. Corrigé : `ArtistRelatedPosts` ne rend plus son squelette (sinon le HTML servi affichait « Nos articles sur … » pour tous les artistes). Mineurs reportés : warning GSAP « Invalid scope » préexistant (`ArtistBiography.tsx` sans biographie, `ArtistRelatedPosts` démonté) ; slide vertical du nom inopérant en mobile (`inline`, préexistant) ; `artists/[slug]/error.tsx` mélange FR/EN (« Impossible to load »). Constat hors périmètre : **erreur d'hydratation React #418 sur `/presale`** (préexistante) → rapport.
- [x] ✅ **Commit** — FAIT le 16/10/2026 dans `55019d9` (en prod) — `fix(seo): fiches artistes rendues côté serveur, H1 unique (IRA-01)`

### Task 8 : IRA-02 — Meta, Open Graph, JSON-LD

> **Statut 16/10/2026 : ✅ FAIT, en prod (`55019d9`, 16/10)** — JSON-LD rendu côté serveur : fiche œuvre `VisualArtwork` + `Offer` (prix EUR, `InStock`/`SoldOut`, pas d'Offer sans prix), fil d'Ariane Accueil > Catalogue > artiste > œuvre (l'ancien pointait vers `/artworks`, inexistant) ; fiche artiste `Person` (nom d'usage, `alternateName` = nom civil, `sameAs` = site/réseaux/Artitude, `@id`) + `VisualArtwork` des œuvres ; `FAQPage` généré par `PageFAQ` depuis les mêmes données. og:image = image de l'œuvre / photo de l'artiste. Nouveaux utilitaires : `src/utils/jsonLd.ts` (`serializeJsonLd` échappe `<`, appliqué à tous les JSON-LD ; `toPlainText` ; `toJsonLdUrl` encode espaces/accents des URL d'images), `src/utils/artistDisplayName.ts`. Vérifié en local (JSON valide sur 3 URL). **Reste à faire par l'utilisateur après déploiement : test des résultats enrichis Google sur 3 URL** (impossible sur localhost).
> - [x] ✅ Revue — aucun défaut bloquant ; corrigé : décodage des entités HTML dans le texte JSON-LD. Noté : la FAQ « artists » du layout est répétée sur toutes les fiches artistes (contenu générique).

**Files :** `src/utils/generateJsonLd.ts`, `src/app/artwork/[id]/page.tsx`, `src/app/artists/[slug]/page.tsx`, `src/components/common/FAQ/PageFAQ.tsx`.

- [ ] Fiche œuvre : ajouter `VisualArtwork` + `Offer` (`price`, `priceCurrency: 'EUR'`, `availability: isSold ? SoldOut : InStock`, `url` canonique) ; image OG = image de l'œuvre.
- [ ] Fiche artiste : `Person` existe déjà — utiliser le nom d'usage (pseudo) et `sameAs` ; OG image = photo de l'artiste.
- [ ] `FAQPage` JSON-LD généré par `PageFAQ` à partir des mêmes données que le rendu.
- [ ] Vérifier sur 3 URL avec le test des résultats enrichis Google (et `npx schema-dts` facultatif) : 0 erreur.

### Task 9 : IRA-07 — Sitemap et redirections

> **Statut 16/10/2026 : ✅ FAIT, en prod (`55019d9`, 16/10)** — `src/utils/slug.ts` (`toSlug`, source unique) ; sitemap : œuvres en slugs dédoublonnés, `/marketplace` `/about` `/academy` `/roadmap` retirés, ajout de `/agence`, `/agence/artists` (+ profils), `/agence/brief`, `/media`, `/media/production`, `/services`, `/artists-studio`, `/usecase/leasing/{hotelPrestige,immobilier}`, `/usecase/capital/contact` ; `lastModified: new Date()` supprimé (Ruling : aucune date réelle en base hors blog → on n'en publie pas plutôt qu'une fausse). Redirections 308 dans `next.config.ts` : `/marketplace`→`/presale`, `/about`→`/team` (le menu « À propos » pointe déjà sur `/team`), `/academy`→`/blog`, `/roadmap`→`/`, `/usecase/fractionate`→`/usecase`, `/usecase/lending`→`/usecase/leasing` (aucun lien interne vers ces pages, vérifié). `/terms-nft` 410 (déjà).
> - **Soft 404 corrigés** : les pages sont streamées (Suspense du layout racine), donc `notFound()`/`permanentRedirect()` dans la page donnaient 200 + meta refresh (vérifié ; ni le retrait de `loading.tsx` ni celui du Suspense ne suffisent). Ruling : vérification dans `src/proxy.ts` avant rendu via un index de slugs en mémoire (`src/lib/slugIndex.ts`, TTL 60 s, rechargement sur miss, stale-while-revalidate, timeout 2 s, fail-open) : `/artwork/{id}` → 308 slug, slug d'œuvre inconnu → 308 `/presale`, artiste inconnu → 308 `/artists`, catégorie inconnue → 308 `/artists`, profil agence : graphie non canonique → 308 vers le slug canonique, inconnu → 308 `/agence/artists`. Coût si faux : une requête Prisma par minute et par instance ; en cas de panne base, les pages se comportent comme avant.
> - Vérifié (build local) : **recette complète 707 URL → 11 échecs, tous « crochets »** (avant : 1 219) ; 0 échec status/canonical/h1/title/vocabulaire. `/artwork/5` → 308 `/artwork/kingdom-of-the-lollipop` (UTM conservés).
> - [x] ✅ Revue — corrigé : URL agence en double (toute graphie `…-<id>` répondait 200), index résilient (périmé servi, timeout, backoff), singleton Prisma aussi en production (pool partagé proxy/pages), soft 404 des catégories, liens `/marketplace` restants (`ExpertSection.tsx`, JSON-LD Organisation `hasOfferCatalog`), UTM conservés. Code mort laissé : `src/app/{about,marketplace,academy,roadmap}` et composants associés (inaccessibles) → suppression à faire par l'utilisateur.
> - **Reste à faire par l'utilisateur** : soumettre le sitemap dans Search Console après déploiement ; 2 crochets réels en base (FAQ de `/usecase/leasing/hotelPrestige` « [préciser qui assure] » et `/usecase/leasing/immobilier` « [Préciser la durée minimale.] ») → back-office. Les 9 autres sont du contenu (« Alsace [Re]Belle », « [2025] »).

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

> **Statut 16/10/2026 : ✅ CONFORME** (mesuré en prod) : seul `https://www.inrealart.com` répond 200 ; `https://inrealart.com`, `http://www.inrealart.com` → 308 www ; `http://inrealart.com` → 308 https apex → 308 www (2 sauts, réglage Vercel, sans impact). Les mentions `www.inrealart.com` des PDF sont du texte affiché, cohérent. Aucun changement de code → revue sans objet.

- [ ] Vercel → Domains : domaine retenu (décision n°1) en principal, l'autre en « Redirect 308/301 ».
- [ ] `grep -rn "www.inrealart" src` → aligner `pdfGenerator.ts` et `api/heritage-art-simulator/send-pdf/route.ts` sur `BASE_URL`.
- [ ] Test : `curl -sI https://www.inrealart.com/` → 301/308 ; seule la version retenue répond 200.

### Task 11 : IRA-12b — Fiche œuvre achetable

> **Statut 16/10/2026 : ⛔ BLOQUÉ** — décision produit (achat par formulaire Brevo ou paiement en ligne), textes du document « FAQ InRealArt » (certificat, livraison, retours, sans crochets) et adresse e-mail au nom de domaine (décision n°4). La **technique** et l'**année** ne sont pas des champs de `PresaleArtwork` (évolution du schéma `@InRealArt/prisma-schema` nécessaire).

**Files :** `ArtworkPageClient.tsx`, nouveaux composants `src/components/artwork/ArtworkPurchasePanel.tsx`, `ArtworkReassurance.tsx`, FAQ achat.

- [ ] Boutons « Acheter » (formulaire ou paiement — **décision produit à prendre** : demande d'achat par formulaire Brevo vs. paiement en ligne), « Réserver une visite » (formulaire), « Simuler un leasing » (lien `/loa-simulator?price=…&artwork=…`).
- [ ] Bloc caractéristiques : technique, année, dimensions, certificat d'authenticité, livraison, retours (textes du document FAQ, sans crochets).
- [ ] FAQ achat via `PageFAQ`.
- [ ] Événements GTM sur chaque bouton (`src/utils/` GTM tracking existant).
- [ ] Test : parcours complet manuel (desktop + mobile 390 px) ; e-mail reçu côté équipe.

### Task 12 : IRA-11 — Bandeau de garanties + /garanties

> **Statut 16/10/2026 : ⛔ BLOQUÉ** — libellés des garanties à valider (certificat, livraison assurée, retours, paiement sécurisé) : ce sont des engagements contractuels.

- [ ] Composant serveur `src/components/common/TrustBar.tsx` (certificat, livraison assurée, retours, paiement sécurisé — libellés validés), inséré dans `layout.tsx` ; page `src/app/garanties/page.tsx` avec metadata + canonical ; ajouter `/garanties` à `KNOWN_STATIC_ROUTES` et au sitemap.
- [ ] Test : visible à 390 px et 1440 px ; recette OK sur `/garanties`.

### Task 13 : IRA-17b — FAQ manquantes et contact unique

> **Statut 16/10/2026 : ⛔ BLOQUÉ** — FAQ par page = contenu à saisir dans le back-office (`DetailedFaqPage`) ; `PageFAQ` est déjà rendu côté serveur (un `dynamic()` sur un composant serveur reste pré-rendu, vérifié : FAQPage présent dans le HTML) ; contact unique et remplacement des `@gmail` → adresse au nom de domaine à créer (décision n°4).

- [ ] `PageFAQ` rendu côté serveur (retirer son `dynamic()` dans `page.tsx`) sur `/joinInRealArt/artists`, `/simulators`, `/artists-studio`, `/contact`.
- [ ] Formulaire de contact unique `/contact` avec sélecteur de profil (artiste, collectionneur, entreprise, marque, presse) → route API Zod + reCAPTCHA (motif de `api/gallery-contact`). Tous les « Nous contacter » (`Header.tsx:60`, `ContactModal.tsx`…) pointent vers `/contact`.
- [ ] Remplacer les 15 occurrences `@gmail` par l'adresse au nom de domaine (constante unique dans `src/config/`).
- [ ] Test : `grep -rn "@gmail" src` = 0 ; envoi du formulaire pour chaque profil.

### Task 14 : IRA-13 — Nom d'usage unique par artiste

> **Statut 16/10/2026 : ✅ FAIT, en prod (`55019d9`, 16/10)** — `getArtistDisplayName` (`src/utils/artistDisplayName.ts`) = pseudo, sinon « Prénom Nom » ; pseudo exposé par toutes les requêtes d'œuvres/artistes (presale, featured, expositions, témoignages) ; utilisé sur fiches artiste et œuvre (H1, metadata, JSON-LD), catalogue (filtre et tri), accueil (sliders, partenaires, expositions, artiste du moment), grilles et catégories d'artistes, blog, agence, ateliers. ⚠️ Effet visible : les artistes à pseudo s'affichent sous leur pseudo partout (ex. « Ophélie SIMONET » → « KOA », « Romain Hurdequint » → « Rom av.JC »). H1 de `/artists` présent dans le HTML servi.
> - [x] ✅ Revue — corrigé : « Nos articles sur … » affichait le prénom seul, grille des catégories en prénom seul, slide mobile « Artiste du moment », découpe prénom/nom d'un pseudo dans le hero (+ CTA « Collaborer avec … »), logiques agence non alignées. Bug évité : les cartes artistes de l'accueil construisaient l'URL depuis le nom affiché (`/artists/koa`) → prop `slug` explicite. Noté : le H1 de `/artists` est en `opacity: 0` jusqu'à l'animation GSAP (indexable, mais invisible sans JS).

- [ ] Règle d'affichage unique `getArtistDisplayName(artist) = pseudo ?? \`${name} ${surname}\`` dans `src/utils/` ; l'utiliser partout (métadonnées, JSON-LD, cartes, fiche œuvre `artwork/[id]/page.tsx` qui construit encore `name surname`).
- [ ] H1 sur `/artists` (`ArtistsHero.tsx:12` en a un : vérifier qu'il est dans le HTML servi et que l'opacité 0 initiale n'empêche pas l'indexation).
- [ ] Test : `grep -rn "\.name} \${.*surname" src` → seuls usages via l'utilitaire.

### Task 15 : IRA-18 — Simulateurs LOA / Patrimoine

> **Statut 16/10/2026 : ✅ FAIT, en prod (`55019d9`, 16/10)** — LOA : résultat calculé avec les 4 champs financiers seulement ; coordonnées regroupées en « Recevoir le rapport PDF (facultatif) » ; e-mail demandé après le calcul pour recevoir le PDF ; notification lead à l'équipe seulement si des coordonnées sont saisies. Une seule URL : lien `/simulators/loa` (route inexistante) → `/loa-simulator` + redirection 308. Patrimoine : « allocation optimale » / « Optimisez votre allocation » retirés (title, description, `fr.json`/`en.json`). **Sécurité (préexistant, aggravé par l'e-mail saisi après coup)** : routes `send-pdf` et `send-company-info` désormais protégées par reCAPTCHA v3, schéma Zod partagé borné (`src/utils/loaSimulatorSchema.ts`), valeurs échappées dans les e-mails. Testé en local : 400 sans jeton / sans coordonnées, 403 jeton invalide, aperçu PDF 200 sans coordonnées.
> - [x] ✅ Revue — corrigé : **bloquant** `validateArtworkLeaseInputs` exigeait encore entreprise/e-mail/téléphone (calcul refusé) ; lignes vides dans e-mails, PDF et récapitulatif (« Non renseigné » / « — ») ; noms de fichier PDF. Noté : le PDF Patrimoine contient encore le libellé « Allocation optimale : » (`api/heritage-art-simulator/send-pdf/route.ts`, hors balises) ; les routes Patrimoine n'ont pas de reCAPTCHA (même faille).
> - **À tester par l'utilisateur dans le navigateur** : `/loa-simulator` sans coordonnées → résultat ; « Recevoir le PDF » avec un e-mail → e-mail reçu (reCAPTCHA réel).

- [ ] LOA : afficher le résultat sans exiger de coordonnées ; la capture de lead devient optionnelle (« Recevoir le PDF »). Une seule URL (choisir entre `/loa-simulator` et l'URL concurrente, 301 de l'autre).
- [ ] Patrimoine : retirer « allocation optimale » de `heritage-art-simulator/layout.tsx` et `fr.json`.
- [ ] Test : simulation complète sans saisir de téléphone.

---

# SPRINT 3 — Structure et croissance (~12-16 j/h)

### Task 16 : IRA-09 — Menu par intention

> **Statut 16/10/2026 : ⛔ BLOQUÉ** — maquette « InRealArt — Refonte du site » (libellés et destinations : Marques, Magazine, La galerie…) non disponible.
- [ ] `Header.tsx` + `MobileMenu.tsx` : Œuvres, Artistes, Entreprises, Marques, Magazine, La galerie (selon maquette « Refonte du site ») ; 301 des anciennes URL dans `next.config.ts` ; mise à jour de `KNOWN_STATIC_ROUTES` et `SEGMENT_REDIRECTS`.
- [ ] Test : recette (aucune URL cassée) + clic sur chaque entrée desktop/mobile.

### Task 17 : IRA-08 — Pied de page

> **Statut 16/10/2026 : ✅ FAIT, en prod (`55019d9`, 16/10)** — `Footer.tsx` : 0 lien `share.google` ; 16 liens de navigation + 2 réseaux + 2 mentions légales (+ 2 liens reCAPTCHA obligatoires) ; colonnes InRealArt / Expertises / Simulateurs / Artistes (résidents, ateliers, créateurs de l'agence, catalogue) ; la liste déroulante de ~37 artistes est remplacée par le lien `/artists` (Ruling : critère 15-20 liens ; coût si faux : moins de liens internes vers les fiches, compensés par `/artists` et le sitemap). Même composant sur toutes les pages (`layout.tsx`). `FooterWrapper` ne requête plus la base.
> - [x] ✅ Revue — conforme ; corrigé : CSS mort (`.custom-scrollbar`, `.artist-list-item`), clé orpheline `footer.atelier`.
- [ ] `Footer.tsx` : 15-20 liens, sans `share.google` ; même composant sur toutes les pages.
- [ ] Test : `grep -c "share.google" src/components/common/Footer.tsx` = 0.

### Task 18 : IRA-16 — Agence

> **Statut 16/10/2026 : 🟡 PARTIEL, en prod (`55019d9`, 16/10)** — « pré-lancement » retiré (stats du hero FR/EN) ; numérotation continue des sections de la fiche créateur (01… selon les sections affichées ; bandeau galerie non numéroté). **Bloqué** : études de cas Logitech G et Grim (contenu à fournir).
> - [x] ✅ Revue — corrigé : « 05 » codé en dur dans `AgenceGalleryBridge`. Noté (non visible : `AgenceStreams`/`AgenceUgc` ne sont pas rendus sur `/agence`) : « Disponible année 2 / courant 2026 ».
- [ ] Retirer « pré-lancement » (`fr.json`/`en.json`), numérotation continue 01-02-03-04 ; page(s) d'étude de cas Logitech G et Grim (`src/app/agence/cas/[slug]/page.tsx` ou contenu en base) + `KNOWN_STATIC_ROUTES`/`DYNAMIC_PREFIXES` + sitemap.

### Task 19 : IRA-21 — Pages catégories et piliers

> **Statut 16/10/2026 : ⛔ BLOQUÉ** — textes d'introduction et FAQ des 12 pages catégories et des 4 pages piliers (document « FAQ InRealArt ») ; dépend aussi du menu (Task 16).
- [ ] 12 pages catégories (médium, style, format, budget) : route `src/app/oeuvres/[facet]/[value]/page.tsx` générée statiquement (`generateStaticParams`) avec texte d'intro, liste d'œuvres SSR, FAQ, canonical.
- [ ] 4 pages piliers Entreprises : leasing, achat 238 bis AB, hôtellerie, immobilier (réutiliser `usecase/leasing/hotelPrestige` et `immobilier` existants).
- [ ] Sitemap + maillage depuis menu/pied de page/fiches.

### Task 20 : IRA-06 — Articles anglais

> **Statut 16/10/2026 : ✅ FAIT, en prod (`55019d9`, 16/10), SQL exécuté** — `hreflang` FR/EN réciproques + `x-default` (FR) sur chaque article ayant une traduction publiée ; article EN non traduit (titre identique à l'original FR : ids 133, 281) → `noindex` sans hreflang. 8 slugs tronqués détectés (accents remplacés par « - », ex. `en-catherine-s-n-chal-…`) : **script `docs/audit/sql/2026-10-16-blog-slugs-ira06.sql` à exécuter par l'utilisateur au moment du déploiement** (redirections 308 ancien → nouveau slug déjà dans `next.config.ts` ; sans le SQL, les anciennes URL redirigeraient vers un slug inexistant). Collisions vérifiées : aucune.
- [ ] Slugs EN propres (ou `noindex` des articles EN non traduits) ; `alternates.languages` FR/EN réciproques dans `src/app/blog/[id]/page.tsx`.
- [ ] Test : aucune URL de blog avec slug tronqué dans le sitemap.

### Task 21 : Mesure

> **Statut 16/10/2026 (après déploiement) : 🟡 PARTIEL**
> - Lighthouse mobile prod (médianes de 3 passages) — perf / LCP / CLS : accueil 62 / 6,7 s / 0,10 ; fiche artiste 46 / 7,3 s / **0,40** ; fiche œuvre 64 / 8,2 s / 0 ; /presale 65 / 6,4 s / 0 ; /loa-simulator 64 / 14,2 s / 0. SEO 92-100, accessibilité 86-92, bonnes pratiques 96-100.
> - **Objectif LCP < 2,5 s non atteint.** Le serveur n'est pas en cause (TTFB 40-60 ms malgré le rendu dynamique) : c'est le JS côté navigateur (accueil : 10,8 s de travail du thread principal, 2,9 Mo) et les éléments masqués avant animation GSAP (`opacity-0`, /presale et /loa-simulator : LCP = un texte). → chantier performance dédié à planifier.
> - ✅ CLS fiche artiste corrigé : spacer de `ArtistSubNav` à 0 jusqu'à l'hydratation → hauteurs CSS mesurées servies dès le HTML. Build local : CLS 0,396 → 0.
> - ✅ GA4 : `simulator_start` (LOA, salon, patrimoine), `brief_submit` (agence, capital, production média), `artist_apply` (artiste, galerie) via `src/utils/gtm.ts`. Ruling : `simulator_start` = calcul réussi (pas la première saisie), envoyé à chaque calcul. `purchase_click`, `visit_booking` restent liés à la Task 11. Reste hors code : déclencheurs/balises GA4 dans GTM + vérification DebugView.
> - ✅ Métadonnées dans le `<body>` : sur les pages à `generateMetadata` asynchrone (fiches artiste/œuvre, articles), title/description/canonical/hreflang/robots étaient diffusés en streaming dans le `<body>`, y compris pour Googlebot et les robots IA (liste par défaut de Next). → `htmlLimitedBots` dans `next.config.ts` (liste Next + Googlebot, Bing, GPTBot, ClaudeBot, PerplexityBot…) : vérifié en build local, robots → `<head>`, navigateurs → streaming inchangé. C'était la cause du « meta-description » Lighthouse (SEO 92).
> - ✅ Vérifié en prod après déploiement (16:00) : recette 707 URL, 9 échecs = faux positifs « [Re] »/« [2025] » ; Googlebot, GPTBot, ClaudeBot, PerplexityBot → métadonnées dans le `<head>` (artiste, œuvre, blog) ; CLS fiche artiste 0 (perf 46 → 62-65). SEO Lighthouse reste à 92 : Lighthouse se présente comme un navigateur, il reçoit donc la version streaming (artefact de mesure, pas un défaut pour les robots).
> - Autres constats : accessibilité : contrastes, ordre des titres, taille des cibles, `select` sans nom sur /loa-simulator.
- [ ] `npm run lighthouse` en mobile : LCP < 2,5 s ; événements GA4 `purchase_click`, `visit_booking`, `simulator_start`, `brief_submit`, `artist_apply` via l'utilitaire GTM existant ; vérifier dans DebugView.

---

## Ordre et dépendances

1. Task 1 (recette) avant tout.
2. Tasks 2 → 6 indépendantes entre elles (Sprint 1), Task 6 à faire en premier si possible (priorité absolue de l'audit).
3. Task 7 (SSR) avant Task 8 (JSON-LD) et Task 14 (H1/nom).
4. Task 9 (sitemap) avant soumission Search Console et avant Task 19.
5. Tasks 11, 13, 19 bloquées par les textes du document « FAQ InRealArt » et la maquette.
