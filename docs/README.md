# 📚 Documentation Technique - In Real Art

Bienvenue dans la documentation technique du projet In Real Art Landing Page.

---

## 📁 Structure de la Documentation

### 🚀 [speed-optimization/](./speed-optimization/)

**Optimisation des Performances et Speed Index**

Documentation complète sur l'optimisation progressive du Speed Index en 7 étapes :

- Plan d'optimisation détaillé
- Guide d'implémentation par étape
- Outils de test (Lighthouse CI)
- Métriques et résultats

**📖 Commencez ici** : [speed-optimization/README.md](./speed-optimization/README.md)

---

### 🎨 Frontend & UI

#### [hero-text-styling-guide.md](./hero-text-styling-guide.md)

Guide de style pour les textes Hero avec backdrop-filter et effets visuels.

#### [breadcrumb-best-practices.md](./breadcrumb-best-practices.md)

Bonnes pratiques pour l'implémentation du fil d'Ariane (breadcrumb).

#### [newsletter-popup-implementation.md](./newsletter-popup-implementation.md)

Documentation de l'implémentation de la popup newsletter avec timing et conditions.

#### [sticky-footer-system.md](./sticky-footer-system.md)

Système de footer sticky configurable par page.

---

### 🖼️ Images & Médias

#### [image-optimization-guide.md](./image-optimization-guide.md)

Guide complet d'optimisation des images :

- Formats (WebP, AVIF)
- Next.js Image component
- Lazy loading
- Responsive images

---

### 🔍 SEO & Référencement

#### [seo-posts-system.md](./seo-posts-system.md)

Documentation du système de posts SEO :

- Structure des articles
- Métadonnées
- Schema.org
- Optimisation référencement

#### [html-translations-guide.md](./html-translations-guide.md)

Guide pour gérer les traductions avec HTML dans les contenus.

---

### 📊 Analytics & Tracking

#### [gtm-cookies-documentation.md](./gtm-cookies-documentation.md)

Documentation sur l'implémentation de Google Tag Manager et la gestion des cookies.

#### [new-gtm-implementation.md](./new-gtm-implementation.md)

Nouvelle implémentation de GTM avec consentement cookies.

#### [gtm-correction-issue.md](./gtm-correction-issue.md)

Résolution des problèmes GTM identifiés.

---

### ⚡ [optimisations/](./optimisations/)

**Dossier des optimisations diverses**

Documentation des optimisations techniques spécifiques.

---

## 🛠️ Guides Pratiques

### Performance Testing

```bash
# Test Lighthouse complet
npm run lighthouse

# Test mobile
npm run lighthouse:mobile

# Test desktop
npm run lighthouse:desktop

# Analyse bundle
npm run analyze
```

### Development

```bash
# Serveur de développement
npm run dev

# Build production
npm run build

# Serveur production
npm run start
```

---

## 🎯 Métriques de Performance Actuelles

| Métrique    | Objectif | Status                     |
| ----------- | -------- | -------------------------- |
| Speed Index | < 2.5s   | 🔄 En cours d'optimisation |
| FCP         | < 1.5s   | 🔄 En cours d'optimisation |
| LCP         | < 2.5s   | 🔄 En cours d'optimisation |
| CLS         | < 0.1    | ✅                         |

Voir [speed-optimization/](./speed-optimization/) pour le détail des optimisations.

---

## 📝 Conventions

### Nommage des Fichiers

- Utiliser des noms descriptifs en kebab-case
- Préfixer avec le domaine si nécessaire (ex: `gtm-*`, `seo-*`)
- Utiliser `.md` pour Markdown

### Structure des Documents

1. **Titre principal** avec emoji descriptif
2. **Introduction** : Contexte et objectif
3. **Contenu** : Sections structurées avec exemples
4. **Références** : Liens et ressources externes
5. **Historique** : Date de création et mises à jour

---

## 🔗 Ressources Externes

### Next.js

- [Documentation officielle](https://nextjs.org/docs)
- [Optimisations Next.js](https://nextjs.org/docs/app/building-your-application/optimizing)

### Performance

- [Web.dev](https://web.dev/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse/)

### SEO

- [Google Search Central](https://developers.google.com/search)
- [Schema.org](https://schema.org/)

---

## 📅 Dernière Mise à Jour

**Date** : 30 décembre 2025  
**Version** : 1.0

---

## 💡 Contribution

Pour ajouter ou modifier la documentation :

1. Créer/modifier le fichier dans le dossier approprié
2. Suivre les conventions de nommage
3. Mettre à jour ce README si nécessaire
4. Documenter les changements dans l'historique du document
