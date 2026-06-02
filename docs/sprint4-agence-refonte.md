# Sprint 4 — Refonte Page Agence Créateurs `/agence`

**Source** : InRealArt_Refonte_CMO_Dev.docx — Page 4 "Agence Créateurs"  
**Score actuel** : 3.5/10  
**Objectif** : Transformer `/agence` en hub de conversion B2B structuré, différencié, avec formulaire brief intégré et catalogue vertikalisé.

---

## Diagnostic CMO (problèmes identifiés)

| # | Problème | Impact |
|---|----------|--------|
| P1 | Totalement absente de la navigation principale | Invisible → 0 trafic organique pôle Agence |
| P2 | Disconnect de marque : art contemporain premium vs UGC/influenceurs | Confusion positionnement |
| P3 | Brief client → simple `/contact` sans formulaire structuré | Perte de leads qualifiés |
| P4 | Stats non sourcées (200+ créateurs, 80+ marques) sans preuves | Crédibilité faible |
| P5 | Aucune verticalisation du catalogue (luxe / lifestyle / tech / culturel) | Pas de personnalisation prospect |
| P6 | Pas de cas clients avec résultats chiffrés | 0 social proof B2B |
| P7 | Aucune différenciation vs Kolsquare, Brut, Jellysmack | Commoditisation |

> **Note** : `/agence` est déjà présent dans la navigation principale (Header.tsx:39). Le problème P1 est partiellement résolu côté desktop. À vérifier sur mobile (MobileMenu).

---

## Structure de page cible (CMO)

```
ZONE 1 — Hero : 'Des artistes qui activent vos marques'
         + 2 CTA distincts : 'Déposer un brief' / 'Rejoindre l'agence'

ZONE 2 — Différenciateur en 3 points : Art + authenticité + droits sans ambiguïté
         (existe déjà : AgenceDifferentiators — 4 points → garder, enrichir)

ZONE 3 — Stats sourcées + logos marques partenaires (minimum 5)
         (stats existent en hero ; logos partenaires → AgencePartners existe)

ZONE 4 — Grille créateurs filtrée par verticale
         (switch Luxe / Lifestyle / Culturel / Institutionnel)

ZONE 5 — 3 cas clients : campagne · marque · résultats métriques chiffrés
         (ABSENT — à créer : AgenceCaseStudies)

ZONE 6 — Packages : Starter / Studio / Full-service
         (existe partiellement : AgencePricing — packs créateurs, à renommer/simplifier)

ZONE 7 — Formulaire brief intégré inline (/agence/brief)
         (ABSENT — à créer : page + composant AgenceBriefForm)
```

---

## Tâches techniques

### ✅ Fait (existant)
- [x] Hero avec stats (200+ créateurs, 80+  marques, 100% droits)
- [x] Section différenciateurs (4 cartes)
- [x] Partenaires (AgencePartners)
- [x] Packs créateurs (AgencePricing — détail avancé)
- [x] Témoignages créateurs (AgenceTestimonials)
- [x] Lien `/agence` dans la nav desktop

### 🔧 À modifier

#### HERO — Ajouter 2e CTA "Rejoindre l'agence"
- **Fichier** : `src/components/agence/AgenceHero.tsx`
- **Changement** : Actuellement 1 seul CTA `href="/contact"` (ligne 100). Ajouter un 2e bouton "Rejoindre l'agence" pointant vers `/contact?sujet=rejoindre-agence` (ou `/agence/brief#rejoindre`)
- **Clé i18n** à ajouter : `agence.hero.ctaSecondary`

#### GRILLE CRÉATEURS — Filtre par verticale
- **Fichier** : `src/components/agence/AgenceTopCreateurs.tsx`
- **Changement** : Ajouter 4 boutons switch (Tous / Luxe / Lifestyle / Culturel / Institutionnel) au-dessus de la grille de cards. Filtrage côté client sur un champ `vertical` à ajouter dans les données artiste (ou mapping statique slug → verticale).
- **Type** : `UgcTopArtistData` dans `src/actions/ugcActions.ts` — vérifier si champ `vertical` disponible en BDD, sinon mapping statique temporaire.

### 🆕 À créer

#### CAS CLIENTS — AgenceCaseStudies
- **Fichier** : `src/components/agence/AgenceCaseStudies.tsx`
- **Contenu** : 3 cartes (données statiques en attendant modèle BDD)
  - Cas 1 : Marque Luxe — Lancement parfum — 2,3M impressions, taux engagement 8,4%
  - Cas 2 : Pop-up retail — 12 créateurs — +340% reach vs objectif
  - Cas 3 : Campagne institutionnelle — 6 mois ambassade — 15 assets livrés
- **Intégration** : Ajouter dans `AgencePage.tsx` après `AgenceTopCreateurs`

#### PAGE BRIEF — `/agence/brief`
- **Fichier route** : `src/app/agence/brief/page.tsx`
- **Composant** : `src/components/agence/AgenceBriefForm.tsx`
- **Champs requis** (spec CMO) :
  1. Nom & entreprise (text)
  2. Type de projet : UGC / Campagne / Partenariat long terme / Événement (radio)
  3. Verticale : Luxe / Lifestyle / Culturel / Institutionnel / Autre (select)
  4. Plateforme cible : Instagram / TikTok / YouTube / LinkedIn / Print (multi-select)
  5. Budget indicatif : <2K / 2-5K / 5-15K / 15K+ (select)
  6. Deadline souhaitée (date picker)
  7. Description libre (textarea 500 car max)
  8. Email + checkbox RGPD
- **Soumission** : POST vers `/api/agence/brief` (à créer) — envoi Brevo ou email direct
- **CTA hero** : Mettre à jour `href="/agence/brief"` dans `AgenceHero.tsx`

#### API ROUTE BRIEF — `/api/agence/brief`
- **Fichier** : `src/app/api/agence/brief/route.ts`
- **Validation** : Zod schema
- **Action** : Envoi email via Brevo (existant dans le projet) + confirmation au prospect

#### PROXY WHITELIST
- **Fichier** : `src/proxy.ts`
- **Action** : Ajouter `/agence/brief` à `KNOWN_STATIC_ROUTES`

---

## Mises à jour i18n requises

### `src/locales/fr.json` — clés à ajouter sous `agence`

```json
"hero": {
  "ctaSecondary": "Rejoindre l'agence"
},
"caseStudies": {
  "eyebrow": "Ils nous font confiance",
  "title": "Des résultats, pas des promesses.",
  "case1": {
    "brand": "Maison de Luxe (NDA)",
    "campaign": "Lancement parfum — Printemps 2025",
    "metric1": { "value": "2,3M", "label": "Impressions" },
    "metric2": { "value": "8,4%", "label": "Taux d'engagement" },
    "metric3": { "value": "12", "label": "Créateurs activés" },
    "tag": "Luxe · Parfumerie"
  },
  "case2": {
    "brand": "Retailer Premium",
    "campaign": "Pop-up activation · Marais, Paris",
    "metric1": { "value": "+340%", "label": "Reach vs objectif" },
    "metric2": { "value": "48h", "label": "Délai d'activation" },
    "metric3": { "value": "7", "label": "Créateurs présents" },
    "tag": "Retail · Événementiel"
  },
  "case3": {
    "brand": "Institution culturelle",
    "campaign": "Ambassade long terme · 6 mois",
    "metric1": { "value": "15", "label": "Assets livrés" },
    "metric2": { "value": "4", "label": "Plateformes activées" },
    "metric3": { "value": "100%", "label": "Droits cédés" },
    "tag": "Culturel · Institutionnel"
  }
},
"brief": {
  "metadata": {
    "title": "Déposer un brief — In Real Art Agence",
    "description": "Décrivez votre projet créateur en 2 minutes. Notre équipe vous répond sous 48h avec une proposition personnalisée."
  },
  "hero": {
    "eyebrow": "Agence Créateurs",
    "title": "Votre brief,",
    "titleAccent": "notre casting.",
    "subtitle": "Décrivez votre projet en quelques champs. Notre équipe revient vers vous sous 48h avec une sélection de créateurs et une estimation."
  },
  "form": {
    "company": "Nom & entreprise",
    "projectType": "Type de projet",
    "projectTypes": {
      "ugc": "UGC",
      "campaign": "Campagne",
      "partnership": "Partenariat long terme",
      "event": "Événement"
    },
    "vertical": "Verticale",
    "verticals": {
      "luxury": "Luxe",
      "lifestyle": "Lifestyle",
      "cultural": "Culturel",
      "institutional": "Institutionnel",
      "other": "Autre"
    },
    "platforms": "Plateforme(s) cible(s)",
    "platformOptions": {
      "instagram": "Instagram",
      "tiktok": "TikTok",
      "youtube": "YouTube",
      "linkedin": "LinkedIn",
      "print": "Print"
    },
    "budget": "Budget indicatif",
    "budgetOptions": {
      "under2k": "< 2 000 €",
      "2to5k": "2 000 – 5 000 €",
      "5to15k": "5 000 – 15 000 €",
      "above15k": "15 000 €+"
    },
    "deadline": "Deadline souhaitée",
    "description": "Description du projet",
    "descriptionPlaceholder": "Décrivez votre projet, vos objectifs, vos références visuelles...",
    "email": "Email de contact",
    "rgpd": "J'accepte que mes données soient utilisées pour traiter ma demande",
    "submit": "Recevoir une proposition sous 48h",
    "successTitle": "Brief reçu — merci.",
    "successMessage": "Notre équipe vous recontacte dans les 48h avec une sélection personnalisée.",
    "errorMessage": "Une erreur est survenue. Réessayez ou contactez-nous directement."
  },
  "topCreateurs": {
    "filters": {
      "all": "Tous",
      "luxury": "Luxe",
      "lifestyle": "Lifestyle",
      "cultural": "Culturel",
      "institutional": "Institutionnel"
    }
  }
}
```

---

## Ordre d'implémentation recommandé

1. **Mise à jour i18n** (fr.json + en.json) — prérequis pour tout
2. **AgenceHero** — ajouter 2e CTA + pointer `/agence/brief`
3. **AgenceCaseStudies** — nouveau composant statique
4. **AgencePage** — intégrer AgenceCaseStudies
5. **AgenceTopCreateurs** — ajouter filtre verticale
6. **AgenceBriefForm** + page `/agence/brief`
7. **API route** `/api/agence/brief`
8. **proxy.ts** — whitelist `/agence/brief`

---

## Acceptance criteria

- [ ] Hero affiche 2 CTA distincts (déposer brief + rejoindre agence)
- [ ] Lien "Déposer un brief" pointe vers `/agence/brief`
- [ ] Section cas clients visible avec 3 cartes et métriques
- [ ] Grille créateurs filtrée par switch verticale
- [ ] Page `/agence/brief` accessible avec formulaire 8 champs
- [ ] Soumission formulaire envoie email via Brevo
- [ ] `/agence/brief` ajouté à `KNOWN_STATIC_ROUTES` dans proxy.ts
- [ ] Clés i18n fr.json + en.json complètes
