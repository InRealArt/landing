# Sprint 6 — Refonte Page Média `/media`

**Source** : InRealArt_Refonte_CMO_Dev.docx — Page 6 "Média / /media"  
**Score actuel** : 4/10  
**Objectif** : Transformer `/media` en hub éditorial structuré avec packages de production clairs, formulaire interne professionnel (remplace Gmail brut), et métadonnées corrigées.

---

## Diagnostic CMO (problèmes identifiés)

| # | Problème | Impact |
|---|----------|--------|
| P1 | Contact production = adresse Gmail brute (`teaminrealart@gmail.com`) — très non professionnel | Crédibilité B2B nulle |
| P2 | Images TV sans légendes, sans liens vers vidéos réelles | Contenus non cliquables |
| P3 | Aucun catalogue d'épisodes ou d'archives de contenu | SEO nul sur les épisodes |
| P4 | Aucune tarification ou packages pour les clients production | Pas d'offre commerciale visible |
| P5 | 0 lien entre le hub média et le blog ou les artistes | Silos de navigation |
| P6 | SEO nul : aucun article ou épisode indexable depuis ce hub | Faible visibilité organique |
| P7 | Canonical hardcodé sans variable d'environnement | URL canonique incorrecte hors prod |

---

## Structure de page cible (CMO)

```
ZONE 1 — Hero : 'L'observatoire de la création' (existant)
ZONE 2 — Expositions (existant)
ZONE 3 — Articles & blog (existant)
ZONE 4 — InRealArt TV (existant, CTA Gmail → /media/production)
ZONE 5 — Marian Production (existant, CTA Gmail → /media/production)
ZONE 6 — Packages de production (NOUVEAU)
         3 packages : Portrait / Reportage / Campagne Full
         + CTA → /media/production (formulaire interne)
```

---

## Implémentation réalisée

### ✅ Fichiers créés

| Fichier | Description |
|---------|-------------|
| `src/components/media/MediaProductionPackages.tsx` | Section 3 packages (Portrait / Reportage / Campagne Full) avec GSAP, CTA → `/media/production` |
| `src/components/media/production/MediaProductionForm.tsx` | Formulaire 7 champs + RGPD + reCAPTCHA (client component) |
| `src/app/media/production/page.tsx` | Route page production : hero serveur + formulaire client |
| `src/actions/mediaProductionAction.ts` | Server Action : Zod + `verifyRecaptchaToken` + `sendEmailViaBrevo` + `esc()` |

### ✅ Fichiers modifiés

| Fichier | Changement |
|---------|------------|
| `src/components/media/MarianSection.tsx` | Remplacement `<a href="mailto:...">` → `<Link href="/media/production">` |
| `src/components/media/InRealArtTvSection.tsx` | Remplacement `<a href="mailto:...">` → `<Link href="/media/production">` |
| `src/app/media/page.tsx` | + import `MediaProductionPackages`, ajout zone 5, metadata enrichie + canonical avec env var |
| `src/proxy.ts` | + `/media/production` dans KNOWN_STATIC_ROUTES |
| `src/locales/fr.json` + `en.json` | + clés `media.production`, `media.productionContact`, `media.hub` |

---

## Champs formulaire `/media/production`

| Champ | Type | Valeurs |
|-------|------|---------|
| Nom & structure | text | — |
| Email | email | — |
| Type de projet | toggle buttons | Portrait artiste / Reportage événement / Campagne Full / Autre |
| Sujet / Artiste | text | — |
| Date souhaitée | date picker | — |
| Précisions | textarea | 1000 chars max |
| RGPD | checkbox | required |

---

## Packages de production (données statiques)

| Package | Tag | Inclut |
|---------|-----|--------|
| Portrait Artiste | Dès 1 créateur | Interview 30 min + montage 3-5 min + droits numériques |
| Reportage | Événement / Galerie | Équipe 2 pers + aftermovie 2-4 min + 3 extraits 30s |
| Campagne Full | Sur devis | Série 3-6 épisodes + direction artistique + diffusion multi-plateforme |

---

## Bugs corrigés

| Bug | Avant | Après |
|-----|-------|-------|
| [BUG CONTACT] Gmail brut dans MarianSection | `href="mailto:teaminrealart@gmail.com"` | `href="/media/production"` |
| [BUG CONTACT] Gmail brut dans InRealArtTvSection | `href="mailto:teaminrealart@gmail.com"` | `href="/media/production"` |
| [BUG SEO] Canonical hardcodé | `canonical: 'https://inrealart.com/media'` | `canonical: \`\${NEXT_PUBLIC_APP_URL}/media\`` |

---

## Acceptance criteria

- [x] Aucun lien `mailto:gmail` visible sur `/media`
- [x] Section packages de production visible avec 3 offres
- [x] CTA "Déposer une demande" pointe vers `/media/production`
- [x] Page `/media/production` accessible avec formulaire 7 champs
- [x] Soumission via Server Action (Zod + reCAPTCHA + Brevo)
- [x] `/media/production` ajouté à `KNOWN_STATIC_ROUTES`
- [x] Canonical `/media` utilise `NEXT_PUBLIC_APP_URL`
- [x] TypeScript strict — zéro erreur `tsc --noEmit`
- [x] Clés i18n fr.json + en.json complètes

---

## Travaux complémentaires recommandés (hors sprint)

- [ ] **P3 — Pages épisodes** : créer `/media/tv/:slug` pour indexer chaque épisode (titre, description, lecteur vidéo, transcript, artiste lié)
- [ ] **P5 — Crosslink artiste↔médias** : ajouter sur chaque fiche artiste ses derniers contenus médias liés
- [ ] **P2 — Légendes TV** : ajouter titres et descriptions sur les images TV dans `InRealArtTvSection`
- [ ] **P6 — /media/newsletter** : landing newsletter avec valeur promise détaillée (recommandé CMO)
- [ ] **Tarifs** : ajouter fourchettes de prix indicatives sur les packages (ou mention "Sur devis" avec CTA clair)
