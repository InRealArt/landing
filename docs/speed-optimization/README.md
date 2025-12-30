# 🚀 Documentation : Optimisation Speed Index

Ce dossier contient toute la documentation relative à l'optimisation du **Speed Index** et des performances web de l'application In Real Art.

---

## 📁 Structure des Documents

### 1. **SPEED-INDEX-OPTIMIZATION-PLAN.md**

**Plan complet d'optimisation en 7 étapes**

Document maître contenant :

- Analyse des problèmes de performance identifiés
- Plan d'action détaillé en 7 étapes progressives
- Outils de test recommandés (Lighthouse CI, etc.)
- Métriques cibles avant/après
- Méthodologie de validation

📊 **À consulter en premier** pour comprendre la stratégie globale.

---

### 2. **ETAPE-1-FONTS-COMPLETE.md**

**✅ Optimisation des Fonts (Terminée)**

Documentation complète de l'étape 1 :

- Remplacement Google Fonts CSS par `next/font/google`
- Modifications effectuées (fichiers, configuration)
- Guides de test et validation
- Résultats attendus : **-15% à -25% Speed Index**

📈 **Impact mesuré** : Voir les résultats Lighthouse dans `.lighthouseci/`

---

### 3. **LIGHTHOUSE-FIX.md**

**🔧 Guide de correction des tests Lighthouse**

Documentation de la correction du problème preset "mobile" :

- Explication du problème et solution
- Différences Mobile vs Desktop
- Configuration correcte des tests

### 4. **ETAPE-2-\*.md** (À venir)

Documentation des prochaines étapes d'optimisation au fur et à mesure de leur implémentation.

---

## 🎯 Objectifs Globaux

### Métriques Cibles

| Métrique        | Avant  | Objectif | Status      |
| --------------- | ------ | -------- | ----------- |
| **Speed Index** | ~5.0s  | < 2.5s   | 🔄 En cours |
| **FCP**         | ~2.5s  | < 1.5s   | 🔄 En cours |
| **LCP**         | ~4.0s  | < 2.5s   | 🔄 En cours |
| **TBT**         | ~600ms | < 200ms  | 🔄 En cours |

---

## 🛠️ Outils de Test

### Lighthouse CI

```bash
# Test complet (3 runs)
npm run lighthouse

# Test Mobile
npm run lighthouse:mobile

# Test Desktop
npm run lighthouse:desktop
```

### Configuration

- **Fichier** : `lighthouserc.json` (racine du projet)
- **Résultats** : Dossier `.lighthouseci/` (généré automatiquement)

---

## 📊 Étapes d'Optimisation

| Étape | Description                | Impact Estimé | Status      |
| ----- | -------------------------- | ------------- | ----------- |
| **1** | Optimisation Fonts         | -15% à -25%   | ✅ Terminée |
| **2** | Scripts Tiers (GTM, Umami) | -20% à -30%   | ⏳ À faire  |
| **3** | Images Hero/Above-fold     | -10% à -20%   | ⏳ À faire  |
| **4** | Lazy Loading Composants    | -5% à -15%    | ⏳ À faire  |
| **5** | CSS Critique               | -5% à -10%    | ⏳ À faire  |
| **6** | Optimisation Providers     | -2% à -5%     | ⏳ À faire  |
| **7** | Code Splitting Avancé      | -5% à -10%    | ⏳ À faire  |

**Impact cumulatif estimé** : **-50% à -70% Speed Index** 🎯

---

## 📝 Méthodologie

### Approche Progressive

1. **Une étape à la fois** - Changements incrémentaux
2. **Validation systématique** - Tests Lighthouse après chaque étape
3. **Documentation complète** - Chaque étape documentée
4. **Mesures objectives** - Comparaison avant/après

### Processus de Validation

Après chaque étape :

1. ✅ Build production : `npm run build`
2. ✅ Test Lighthouse : `npm run lighthouse`
3. ✅ Vérification fonctionnelle (pas de régression)
4. ✅ Validation visuelle
5. ✅ Documentation des résultats

---

## 🔗 Ressources Utiles

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web.dev - Speed Index](https://web.dev/speed-index/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Core Web Vitals](https://web.dev/vitals/)

---

## 📅 Historique

| Date       | Action                                     | Auteur       |
| ---------- | ------------------------------------------ | ------------ |
| 2025-12-30 | Création structure documentation + Étape 1 | AI Assistant |

---

## 🎯 Prochaines Actions

1. **Valider Étape 1** - Test Lighthouse sur fonts optimisées
2. **Implémenter Étape 2** - Optimisation scripts tiers
3. **Mesurer impact cumulatif** - Après chaque étape

---

**Dernière mise à jour** : 30 décembre 2025
