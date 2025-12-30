# ✅ ÉTAPE 1 TERMINÉE : Optimisation des Fonts

## 🎯 Objectif

Remplacer l'import Google Fonts CSS par `next/font/google` pour :

- Éliminer les requêtes réseau externes (privacy + vitesse)
- Auto-hébergement des fonts
- Préchargement optimisé
- Réduction du FOIT (Flash of Invisible Text)
- **Impact estimé : -15% à -25% sur Speed Index**

---

## ✅ Modifications Effectuées

### 1. **Nouveau fichier : `src/config/fonts.ts`**

Configuration centralisée des fonts avec :

- ✅ Unbounded (pour titres h1-h6)
- ✅ Bricolage Grotesque (pour texte body/p/span)
- ✅ Inter (utilitaire, non préchargé)
- ✅ `display: 'swap'` pour affichage immédiat du fallback
- ✅ `adjustFontFallback: true` pour réduire CLS
- ✅ Préchargement activé pour fonts principales

### 2. **Modifié : `src/app/layout.tsx`**

- ✅ Import des fonts depuis `@/config/fonts`
- ✅ Variables CSS appliquées sur `<html>` : `${unbounded.variable} ${bricolageGrotesque.variable}`
- ✅ Classe Bricolage appliquée sur `<body>` pour le texte par défaut

### 3. **Modifié : `src/app/globals.css`**

- ✅ **SUPPRIMÉ** : `@import url('https://fonts.googleapis.com/...')` ← Cause majeure de lenteur
- ✅ Mise à jour des classes `.bricolage-grotesque` et `.unbounded` pour utiliser les variables CSS
- ✅ Mise à jour des règles `p, span` et `h1-h6` pour utiliser `var(--font-*)`

### 4. **Modifié : `tailwind.config.ts`**

- ✅ Mise à jour `fontFamily.bricolage` vers `var(--font-bricolage)`
- ✅ Mise à jour `fontFamily.unbounded` vers `var(--font-unbounded)`
- ✅ Mise à jour des utilities `.text-simulator` et `.hero-title`

### 5. **Ajouté : `package.json` scripts**

- ✅ Scripts de test Lighthouse ajoutés
- ✅ Outils installés : `@lhci/cli`, `lighthouse`, `@next/bundle-analyzer`

---

## 📊 Comment Tester

### Test 1 : Vérification Visuelle

```bash
npm run dev
```

- Ouvrez http://localhost:3000
- ✅ Les fonts doivent s'afficher correctement
- ✅ Pas de flash/changement de police au chargement
- ✅ Titres en Unbounded (sans-serif épais)
- ✅ Textes en Bricolage Grotesque (serif moderne)

### Test 2 : Build Production

```bash
npm run build
```

- ✅ Le build doit réussir sans erreurs
- ✅ Vérifier qu'il n'y a pas d'avertissements de fonts

### Test 3 : Test Lighthouse (Build Production)

```bash
# Terminal 1 : Build et démarrage serveur production
npm run build
npm run start

# Terminal 2 : Tests Lighthouse
npm run lighthouse        # Test Desktop
npm run lighthouse:mobile # Test Mobile (recommandé)
```

**Métriques à surveiller** :

- ✅ **Speed Index** : Devrait améliorer de 0.5s - 1.5s
- ✅ **First Contentful Paint (FCP)** : Amélioration attendue
- ✅ **Largest Contentful Paint (LCP)** : Peut s'améliorer légèrement
- ✅ **Cumulative Layout Shift (CLS)** : Devrait rester stable/s'améliorer

### Test 4 : Inspection Réseau (DevTools)

1. Ouvrir Chrome DevTools → Network
2. Filtrer par "Font"
3. ✅ **Aucune requête vers fonts.googleapis.com ou fonts.gstatic.com**
4. ✅ Les fonts doivent être servies depuis `/_next/static/media/`

---

## 🔍 Avant / Après

### ❌ AVANT (Problème)

```css
/* globals.css */
@import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque...");
```

- **Problème** : Requête externe bloquante
- **Impact** : ~800ms - 1.5s de délai
- **Privacy** : Données envoyées à Google
- **Fiabilité** : Dépend de fonts.googleapis.com

### ✅ APRÈS (Optimisé)

```typescript
// fonts.ts
import { Unbounded, Bricolage_Grotesque } from "next/font/google";
export const unbounded = Unbounded({
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});
```

- **Avantage** : Fonts auto-hébergées dans `/_next/static/media/`
- **Impact** : Préchargement + pas de requête externe
- **Privacy** : Aucune donnée externe
- **Fiabilité** : 100% contrôle

---

## 🚨 Points de Vigilance

### 1. **Vérifier les imports custom de fonts**

Si d'autres composants importent des fonts directement, il faut les mettre à jour :

```typescript
// ❌ À ÉVITER
@import url('https://fonts.googleapis.com/...')

// ✅ UTILISER
import { unbounded } from '@/config/fonts'
```

### 2. **CSS inline avec font-family**

Recherchez dans le code les styles inline qui utilisent :

```typescript
style={{ fontFamily: 'Unbounded' }} // ❌ Risqué
```

Remplacez par :

```typescript
className = "font-unbounded"; // ✅ Utilise Tailwind
```

### 3. **Vérifier les CSS modules/SCSS**

Si vous avez des fichiers `.module.css` ou `.scss` avec des références de fonts, mettez-les à jour.

---

## 📈 Résultats Attendus

### Métriques Lighthouse (estimations)

| Métrique        | Avant  | Après  | Amélioration |
| --------------- | ------ | ------ | ------------ |
| **Speed Index** | ~5.0s  | ~3.8s  | **-24%** ⭐  |
| **FCP**         | ~2.5s  | ~1.8s  | **-28%** ⭐  |
| **LCP**         | ~4.0s  | ~3.5s  | **-12%**     |
| **TBT**         | ~600ms | ~550ms | **-8%**      |

---

## 🎉 Validation

Pour valider que l'étape 1 est complète et réussie :

✅ **1. Le build production fonctionne**

```bash
npm run build
```

✅ **2. Les fonts s'affichent correctement en dev et prod**

```bash
npm run dev
npm run start
```

✅ **3. Aucune requête externe vers Google Fonts** (DevTools Network)

✅ **4. Speed Index amélioré de 10-25%** (Lighthouse)

---

## ➡️ Prochaine Étape

**ÉTAPE 2 : Optimisation Scripts Tiers (GTM, Umami, ReCAPTCHA)**

- Impact estimé : -20% à -30% sur Speed Index
- Fichiers : `GoogleTag.tsx`, `UmamiAnalytics.tsx`, `layout.tsx`

---

## 🛠️ Commandes Utiles

```bash
# Build production
npm run build

# Lancer serveur production
npm run start

# Test Lighthouse complet
npm run lighthouse

# Test Lighthouse Mobile
npm run lighthouse:mobile

# Test Lighthouse Desktop
npm run lighthouse:desktop

# Dev mode
npm run dev
```

---

**Date de complétion** : 30 décembre 2025  
**Impact réel** : À mesurer après test Lighthouse  
**Status** : ✅ PRÊT POUR VALIDATION
