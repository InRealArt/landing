# Plan d'Optimisation du Speed Index - In Real Art

## 📊 Analyse Initiale

### Problèmes Identifiés

1. **Fonts Non Optimisées** ⚠️ PRIORITÉ HAUTE

   - Utilisation de fonts locales sans optimisation Next.js
   - Pas d'utilisation de `next/font/local`
   - Risque de Layout Shift (CLS)
   - Impact: Fort sur Speed Index

2. **Scripts Tiers Bloquants** ⚠️ PRIORITÉ HAUTE

   - Google Tag Manager chargé sans stratégie
   - Umami Analytics chargé immédiatement
   - Script theme-init.js avec `async` mais pourrait être optimisé
   - Impact: Très fort sur Speed Index

3. **Composants Non Lazy-Loadés** ⚠️ PRIORITÉ MOYENNE

   - Tous les composants de la page d'accueil chargés immédiatement
   - Components: ArtistSlider, ArtworkSlider, Partners, Team, FAQ, etc.
   - Composants below-the-fold chargés immédiatement
   - Impact: Moyen sur Speed Index

4. **Images Non Priorisées** ⚠️ PRIORITÉ HAUTE

   - Images du Hero/Intro sans attribut `priority`
   - Pas de placeholder/blur visible
   - Impact: Fort sur Speed Index

5. **Providers Multiples** ⚠️ PRIORITÉ BASSE
   - 6 providers imbriqués dans le layout
   - Overhead de rendu initial
   - Impact: Faible sur Speed Index

---

## 🎯 Plan d'Action Progressif (7 Étapes)

### **ÉTAPE 1: Optimisation des Fonts** ✅ À COMMENCER

**Périmètre**: Fichiers de fonts + layout.tsx
**Impact Estimé**: -15% à -25% sur Speed Index
**Risque**: Faible

**Actions**:

- [ ] Créer un fichier `src/config/fonts.ts` avec next/font/local
- [ ] Optimiser les 4 fonts BricolageGrotesque
- [ ] Appliquer dans layout.tsx
- [ ] Ajouter `display: 'swap'` et `preload: true`

**Fichiers à modifier**:

- `src/config/fonts.ts` (nouveau)
- `src/app/layout.tsx`
- `src/app/globals.css` (vérification @font-face)

---

### **ÉTAPE 2: Optimisation Scripts Tiers**

**Périmètre**: GTM, Umami, ReCAPTCHA
**Impact Estimé**: -20% à -30% sur Speed Index
**Risque**: Moyen (vérifier tracking)

**Actions**:

- [ ] Utiliser Next.js Script avec strategy="lazyOnload" pour GTM
- [ ] Différer Umami Analytics
- [ ] Charger ReCAPTCHA uniquement sur les pages avec formulaires
- [ ] Vérifier que le tracking fonctionne toujours

**Fichiers à modifier**:

- `src/components/common/GoogleTag.tsx`
- `src/components/common/UmamiAnalytics.tsx`
- `src/app/layout.tsx`

---

### **ÉTAPE 3: Optimisation Images Hero/Above-the-Fold**

**Périmètre**: Composant Intro (Hero)
**Impact Estimé**: -10% à -20% sur Speed Index
**Risque**: Faible

**Actions**:

- [ ] Ajouter `priority={true}` aux images du Hero
- [ ] Ajouter `placeholder="blur"` avec blurDataURL
- [ ] Optimiser les tailles d'images pour mobile/desktop
- [ ] Utiliser `sizes` appropriées

**Fichiers à modifier**:

- `src/components/home/Intro.tsx`

---

### **ÉTAPE 4: Lazy Loading des Composants Below-the-Fold**

**Périmètre**: Page d'accueil - composants sous la ligne de flottaison
**Impact Estimé**: -5% à -15% sur Speed Index
**Risque**: Faible

**Actions**:

- [ ] Lazy load: ArtistSlider, ArtworkSlider, Partners
- [ ] Lazy load: Team, FAQWrapper
- [ ] Ajouter des Loading Skeletons simples
- [ ] Utiliser React.lazy + Suspense

**Fichiers à modifier**:

- `src/app/page.tsx`
- Créer skeletons légers si nécessaire

---

### **ÉTAPE 5: Optimisation CSS Critique**

**Périmètre**: globals.css et styles inline
**Impact Estimé**: -5% à -10% sur Speed Index
**Risque**: Moyen

**Actions**:

- [ ] Extraire le CSS critique (above-the-fold)
- [ ] Inliner le CSS critique dans le <head>
- [ ] Différer le chargement du CSS non-critique
- [ ] Minimiser les imports CSS globaux

**Fichiers à modifier**:

- `src/app/globals.css`
- `src/app/layout.tsx`

---

### **ÉTAPE 6: Optimisation des Providers**

**Périmètre**: Providers Context
**Impact Estimé**: -2% à -5% sur Speed Index
**Risque**: Moyen

**Actions**:

- [ ] Analyser les providers nécessaires au SSR
- [ ] Déplacer certains providers en Client Components
- [ ] Optimiser ThemeProvider avec cookie SSR
- [ ] Réduire les re-renders

**Fichiers à modifier**:

- `src/contexts/ThemeContext.tsx`
- `src/components/providers/LanguageProvider.tsx`

---

### **ÉTAPE 7: Optimisation Avancée - Code Splitting**

**Périmètre**: Bundle JavaScript global
**Impact Estimé**: -5% à -10% sur Speed Index
**Risque**: Faible

**Actions**:

- [ ] Analyser le bundle avec @next/bundle-analyzer
- [ ] Identifier les grosses dépendances
- [ ] Dynamic imports pour librairies lourdes (chart.js, swiper, etc.)
- [ ] Tree shaking des composants non utilisés

**Fichiers à modifier**:

- `next.config.ts`
- Divers composants avec librairies lourdes

---

## 🛠️ Outils de Test Recommandés

### 1. **Lighthouse CI** (Recommandé - Identique à PageSpeed Insights)

```bash
npm install -g @lhci/cli
```

**Usage**:

```bash
# Test Desktop (3 runs) - Configuration par défaut
npm run lighthouse

# Test Mobile (3 runs) - Émulation smartphone avec throttling
npm run lighthouse:mobile

# Test Desktop uniquement (3 runs)
npm run lighthouse:desktop
```

**Configuration**:
- Desktop : `lighthouserc.json` (preset: desktop, pas de throttling majeur)
- Mobile : `lighthouserc-mobile.json` (preset: perf, émulation Moto G Power, throttling 4G)

### 2. **Web Vitals CLI**

```bash
npm install --save-dev web-vitals
```

### 3. **Unlighthouse** (Scan complet du site)

```bash
npm install -g @unlighthouse/cli
```

**Usage**:

```bash
unlighthouse --site http://localhost:3000
```

### 4. **PageSpeed Insights API** (Automatique)

```bash
npm install psi
```

### 5. **Yellow Lab Tools** (Alternative complète)

URL: https://yellowlab.tools/

---

## 📈 Métriques Cibles

### Avant Optimisation (Estimation)

- **Speed Index**: 4.5s - 6.0s
- **LCP**: 3.5s - 5.0s
- **FCP**: 2.0s - 3.0s
- **TBT**: 400ms - 800ms

### Après Optimisation (Objectif)

- **Speed Index**: < 2.5s ⭐
- **LCP**: < 2.5s ⭐
- **FCP**: < 1.5s ⭐
- **TBT**: < 200ms ⭐

---

## 📝 Méthode de Validation

Après chaque étape:

1. **Build Production**

   ```bash
   npm run build
   npm run start
   ```

2. **Test Lighthouse** (3 runs)

   ```bash
   # Test Desktop
   npm run lighthouse
   
   # Test Mobile (recommandé aussi)
   npm run lighthouse:mobile
   ```

3. **Comparer les métriques**

   - Noter Speed Index avant/après
   - Vérifier pas de régression visuelle
   - Comparer Desktop ET Mobile
   - Résultats dans `.lighthouseci/`

4. **Validation Fonctionnelle**
   - Vérifier que tout fonctionne
   - Tester les interactions clés
   - Vérifier le tracking analytics

---

## 🚀 Prêt à Commencer

**Étape 1 (Fonts)** est prête à être implémentée.

Voulez-vous que je commence par l'optimisation des fonts ?

**Commande de test à installer maintenant**:

```bash
npm install --save-dev @lhci/cli lighthouse
```

---

## 📚 Ressources

- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Speed Index sur Web.dev](https://web.dev/speed-index/)
- [Core Web Vitals](https://web.dev/vitals/)
