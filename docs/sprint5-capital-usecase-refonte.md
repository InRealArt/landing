# Sprint 5 — Refonte Page Capital `/usecase`

**Source** : InRealArt_Refonte_CMO_Dev.docx — Page 5 "Cas d'usage / Leasing / /usecase → /capital"  
**Score actuel** : 5.5/10  
**Objectif** : Transformer `/usecase` en hub B2B structuré avec avantages fiscaux chiffrés, simulateur LOA inline, sélecteur de profil et formulaire de contact qualifié.

---

## Diagnostic CMO (problèmes identifiés)

| # | Problème | Impact |
|---|----------|--------|
| P1 | Scénarios sans résultats chiffrés (ROI absent) | Social proof B2B insuffisant |
| P2 | Simulateur LOA dans le footer uniquement — absent du parcours | Friction conversion |
| P3 | Pas de sélecteur "type d'entreprise" pour personnaliser le discours | Message générique |
| P4 | CTA final = lien `/contact` générique (ex-Calendly) | Perte de leads qualifiés |
| P5 | Aucun PDF / plaquette commerciale téléchargeable | Lead magnet absent |
| P6 | Avantages fiscaux mentionnés sans chiffres | Argumentation faible |

---

## Structure de page cible (CMO)

```
ZONE 1 — Hero + sélecteur profil (PME / Grand groupe / Hôtel / Promoteur / Résidentiel)
ZONE 2 — 3 chiffres fiscaux clés
ZONE 3 — Scénarios avec ROI chiffrés
ZONE 4 — Simulateur LOA inline (composant natif)
ZONE 5 — Section impact existante (stats +63%, +50%, +30%)
ZONE 6 — Double CTA : Plaquette + RDV formulaire interne
ZONE 7 — FAQ
```

---

## Implémentation réalisée

### ✅ Fichiers créés

| Fichier | Description |
|---------|-------------|
| `src/components/usecase/UseCaseFiscalStats.tsx` | Section fond sombre, 3 stats fiscales (100% / 5 ans / TVA) avec GSAP |
| `src/components/usecase/UseCaseInlineSimulator.tsx` | Wrapper section autour de `LoaSimulatorClient` |
| `src/components/usecase/capital/CapitalContactForm.tsx` | Formulaire B2B qualifié (7 champs + RGPD + reCAPTCHA) |
| `src/components/usecase/capital/CapitalContactPage.tsx` | Hero + formulaire pour `/usecase/capital/contact` |
| `src/app/usecase/capital/contact/page.tsx` | Route Next.js App Router avec metadata |
| `src/actions/capitalContactAction.ts` | Server Action : Zod + `verifyRecaptchaToken` + `sendEmailViaBrevo` + `esc()` |

### ✅ Fichiers modifiés

| Fichier | Changement |
|---------|------------|
| `src/components/usecase/Header.tsx` | + sélecteur 5 profils (toggle buttons), tagline dynamique par profil |
| `src/components/usecase/UseCaseScenarios.tsx` | + champ `roi` par scénario, affiché entre description et pills |
| `src/components/usecase/UseCaseCtaFinal.tsx` | Double CTA : "Télécharger la plaquette" + "Prendre rendez-vous" → `/usecase/capital/contact` |
| `src/app/usecase/page.tsx` | + `UseCaseFiscalStats` après Hero, + `UseCaseInlineSimulator` après Scénarios, metadata enrichie |
| `src/proxy.ts` | + `/usecase/capital/contact` dans KNOWN_STATIC_ROUTES |
| `src/locales/fr.json` + `en.json` | + clés `usecase.intro.profiles`, `usecase.fiscal`, `usecase.inlineSimulator`, `usecase.ctaFinal.buttonPrimary/Secondary`, `usecase.scenarios.scenario{1,2,3}.roi`, `usecase.capital.contact` |

---

## Champs formulaire `/usecase/capital/contact`

| Champ | Type | Options |
|-------|------|---------|
| Nom & entreprise | text | — |
| Email | email | — |
| Secteur | toggle buttons | Hôtellerie / Immobilier / PME / Grand groupe / Autre |
| Taille entreprise | select | 1-10 / 10-50 / 50-250 / 250+ |
| Budget LOA indicatif | select | < 5K / 5-20K / 20-50K / 50K+ |
| Besoin | toggle buttons | Leasing / Investissement / Conseil / Autre |
| Message | textarea | 1000 chars max |
| RGPD | checkbox | required |

---

## ROI par scénario (données statiques)

| Scénario | ROI affiché |
|----------|-------------|
| Sièges Sociaux & Identité | +18% satisfaction équipes · 100% charges déductibles |
| Hôtellerie de Prestige | +12% valeur perçue chambre · ROI positif dès 18 mois |
| Immobilier & Résidentiel | +8% prix de vente · Délai de vente réduit de 23% |

---

## Avantages fiscaux (zone 2)

| Stat | Valeur | Label |
|------|--------|-------|
| 1 | 100% | Déductible du résultat imposable |
| 2 | 5 ans | Durée d'amortissement comptable |
| 3 | TVA | Récupérable sur les loyers LOA |

---

## Acceptance criteria

- [x] Hero affiche sélecteur 5 profils avec tagline dynamique
- [x] Section fiscale visible avec 3 chiffres sur fond sombre
- [x] Chaque scénario affiche son ROI chiffré
- [x] Simulateur LOA accessible inline depuis la page principale
- [x] Double CTA final (plaquette + formulaire RDV)
- [x] Page `/usecase/capital/contact` accessible avec formulaire 8 champs
- [x] Soumission via Server Action (Zod + reCAPTCHA + Brevo)
- [x] `/usecase/capital/contact` ajouté à `KNOWN_STATIC_ROUTES`
- [x] TypeScript strict — zéro erreur `tsc --noEmit`
- [x] Clés i18n fr.json + en.json complètes

---

## Travaux complémentaires (hors sprint)

- [ ] **P5 — Plaquette PDF** : créer le PDF téléchargeable et brancher le CTA "Télécharger la plaquette" (actuellement pointe vers `/contact?sujet=plaquette-capital`)
- [ ] **Sous-pages Capital** recommandées par le CMO non encore créées :
  - `/capital/leasing` — page leasing LOA détaillée (existe déjà sous `/usecase/leasing`)
  - `/capital/investissement` — guide éditorial SEO
  - `/capital/cas-clients` — 3 à 5 études de cas B2B avec métriques
- [ ] **Alias `/capital`** → rediriger `/capital` vers `/usecase` si le CMO confirme le changement d'URL
- [ ] **ROI données** : remplacer les chiffres statiques par des données sourçables/validées par l'équipe
