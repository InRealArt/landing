# TEMPLATE PAGE ARTISTE SEO - INREALART.COM
## Structure optimisée pour tripler le trafic organique en 30 jours

---

## 1. MÉTADONNÉES SEO CRITIQUES

### Title Tag (55-60 caractères)
**Format:** `[Prénom Nom] - [Spécialité] | Biographie, Œuvres & Prix | InRealArt`

**Exemple:** `Adélaïde Leferme - Artiste Peintre Abstraite | Bio, Œuvres & Cote | InRealArt`

**Règles:**
- Nom complet artiste en début
- Spécialité unique (peintre abstraite, sculpteur contemporain, photographe)
- Mots-clés transactionnels: Œuvres, Prix, Cote
- Marque InRealArt en fin

### Meta Description (150-155 caractères)
**Format:** `Découvrez [Prénom Nom], [style] [nationalité]. Biographie complète, [X] œuvres originales de [€min]-[€max], expositions & acheter en ligne. [USP InRealArt]`

**Exemple:** `Découvrez Adélaïde Leferme, peintre abstraite française contemporaine. 45+ œuvres de 800€-12000€, biographie, expositions 2025. LOA disponible dès 89€/mois.`

**Éléments obligatoires:**
- Nom complet + style + nationalité
- Nombre d'œuvres disponibles
- Fourchette de prix concrète
- USP InRealArt (LOA, fractionnement, garantie authenticité)
- Verbe d'action (Découvrez, Explorez, Achetez)

### URL Canonical
`https://www.inrealart.com/artists/[slug-prenom-nom]`

**Règles slug:**
- Tout en minuscules
- Tirets pour espaces
- Pas d'accents: é → e, è → e, etc.
- Prénom-Nom (ex: adelaide-leferme)

---

## 2. STRUCTURE HTML & HIÉRARCHIE

### H1 - Nom complet de l'artiste (UNIQUE sur la page)
**Format:** `[Prénom Nom] - [Titre professionnel principal]`

**Exemples:**
- `Adélaïde Leferme - Artiste Peintre Abstraite Contemporaine`
- `Stefan Beiu - Sculpteur et Plasticien Roumain`
- `Catherine Senechal - Peintre Coloriste Française`

**Règles:**
- 1 seul H1 par page
- Nom exact et complet (pas de diminutif)
- Ajouter titre professionnel après tiret
- Ne JAMAIS mettre "Biographie" ou "Œuvres" dans le H1

### Sous-titre introductif (paragraphe, pas un heading)
`[Ville d'origine/résidence] • [Style principal] • Active depuis [année] • [X] œuvres créées • [X] expositions`

**Exemple:** `Paris • Art abstrait lyrique • Active depuis 2008 • 180+ œuvres créées • 35 expositions`

### Structure H2 (sections principales)
1. H2: `Biographie de [Prénom Nom]`
2. H2: `Style artistique et démarche créative`
3. H2: `Œuvres de [Prénom Nom] disponibles à l'achat`
4. H2: `Expositions et événements`
5. H2: `Collections publiques et privées`
6. H2: `Cote et valeur des œuvres`
7. H2: `Artistes similaires à découvrir`
8. H2: `Questions fréquentes sur [Prénom Nom]`

### Structure H3 (sous-sections)
**Sous H2 "Biographie":**
- H3: `Origines et formation artistique`
- H3: `Parcours professionnel et évolution artistique`
- H3: `Prix et distinctions`
- H3: `Aujourd'hui et projets en cours`

**Sous H2 "Expositions":**
- H3: `Expositions à venir`
- H3: `Expositions passées notables`

---

## 3. DONNÉES STRUCTURÉES SCHEMA.ORG (JSON-LD)

### Schema Person (à placer dans <head>)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "[Prénom Nom]",
  "alternateName": "[Pseudonyme si applicable]",
  "jobTitle": "Artiste Peintre",
  "description": "[Bio courte 150-200 caractères - reprise de la meta description]",
  "birthDate": "YYYY-MM-DD",
  "birthPlace": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "[Ville]",
      "addressCountry": "[Code pays ISO]"
    }
  },
  "nationality": {
    "@type": "Country",
    "name": "[Nationalité]"
  },
  "url": "https://www.inrealart.com/artists/[slug]",
  "image": "https://www.inrealart.com/images/artists/[slug]-portrait-500x500.jpg",
  "sameAs": [
    "https://www.instagram.com/[username]",
    "https://www.artsy.net/artist/[slug]",
    "https://www.linkedin.com/in/[username]"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "InRealArt",
    "url": "https://www.inrealart.com"
  },
  "award": [
    "Prix X - Année",
    "Prix Y - Année"
  ],
  "knowsAbout": [
    "Peinture abstraite",
    "Acrylique sur toile",
    "Art lyrique"
  ],
  "hasOccupation": {
    "@type": "Occupation",
    "name": "Artiste Peintre",
    "occupationalCategory": "Arts visuels"
  }
}
```

### Schema VisualArtwork (pour CHAQUE œuvre affichée)

```json
{
  "@context": "https://schema.org",
  "@type": "VisualArtwork",
  "name": "[Titre de l'œuvre]",
  "creator": {
    "@type": "Person",
    "name": "[Prénom Nom Artiste]",
    "url": "https://www.inrealart.com/artists/[slug]"
  },
  "image": {
    "@type": "ImageObject",
    "url": "[URL image haute résolution]",
    "width": "1200",
    "height": "1200"
  },
  "artform": "Peinture",
  "artMedium": "Acrylique sur toile",
  "artworkSurface": "Toile",
  "width": {
    "@type": "QuantitativeValue",
    "value": "[largeur en cm]",
    "unitCode": "CMT"
  },
  "height": {
    "@type": "QuantitativeValue",
    "value": "[hauteur en cm]",
    "unitCode": "CMT"
  },
  "dateCreated": "YYYY",
  "offers": {
    "@type": "Offer",
    "price": "[prix numérique]",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "url": "https://www.inrealart.com/artwork/[slug-oeuvre]",
    "seller": {
      "@type": "Organization",
      "name": "InRealArt"
    }
  }
}
```

### Schema BreadcrumbList

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Accueil",
      "item": "https://www.inrealart.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Artistes",
      "item": "https://www.inrealart.com/artists"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "[Prénom Nom]",
      "item": "https://www.inrealart.com/artists/[slug]"
    }
  ]
}
```

### Schema FAQPage (si section FAQ présente)

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Où est né(e) [Nom Artiste] ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Réponse complète 50-100 mots incluant ville, pays, contexte historique si pertinent]"
      }
    },
    {
      "@type": "Question",
      "name": "Quelle est la technique de prédilection de [Nom Artiste] ?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Réponse détaillée sur la technique principale, supports, matériaux]"
      }
    }
  ]
}
```

---

## 4. STRUCTURE CONTENU DÉTAILLÉE

### SECTION 1: Hero / Introduction (Above the fold)

**Éléments visuels:**
- Portrait de l'artiste: 500x500px minimum, format carré, optimisé WebP
- Alt text portrait: `Portrait de [Prénom Nom], [style] [nationalité]`
- Exemple: `Portrait d'Adélaïde Leferme, peintre abstraite française`

**Éléments textuels:**
- H1: Nom complet + titre professionnel
- Sous-titre: stats visuelles (voir section 2)
- Accroche 1-2 phrases (max 200 caractères):
  * Angle unique de l'artiste
  * Ce qui le distingue dans son domaine
  * Émotion ou vision artistique

**Exemple accroche:**
> "Adélaïde Leferme explore les frontières de l'abstraction lyrique à travers des compositions vibrantes où la couleur devient langage. Son travail interroge la mémoire émotionnelle et l'invisible qui structure nos existences."

**Statistiques clés (badges visuels):**
```
[Icône palette] 45+ œuvres disponibles
[Icône euro] 800€ - 12 000€
[Icône calendrier] Active depuis 2008
[Icône médaille] 8 prix & distinctions
[Icône galerie] 35 expositions
```

**CTA primaires:**
- Bouton 1: `Voir toutes les œuvres` (lien vers #oeuvres)
- Bouton 2: `Simuler un achat LOA` (lien vers simulateur avec pré-remplissage)

---

### SECTION 2: Biographie complète (H2)

**Objectif:** 800-1200 mots minimum, structuré chronologiquement

#### H3: Origines et formation artistique (200-300 mots)

**Éléments obligatoires:**
- Lieu et date de naissance exacte
- Contexte familial/social influençant la vocation
- Formation académique détaillée:
  * Nom des écoles d'art (avec ville)
  * Diplômes obtenus (avec années)
  * Professeurs marquants ou mentors
- Influences artistiques précoces
- Première rencontre avec l'art (anecdote si disponible)
- Contexte historique/artistique de l'époque

**Mots-clés à intégrer:**
- "[Nom artiste] biographie"
- "formation [nom artiste]"
- "parcours artistique [nom artiste]"
- "[école d'art] [ville]"

**Exemple structure:**
> Née à [Ville] en [année], [Prénom Nom] grandit dans [contexte]. Dès [âge], elle manifeste un intérêt pour [domaine artistique], encouragée par [influence]. Sa formation débute à [École] où elle obtient son [diplôme] en [année]. C'est durant ces années qu'elle rencontre [mentor/artiste], qui oriente définitivement son approche vers [style/technique].

#### H3: Parcours professionnel et évolution artistique (300-400 mots)

**Éléments obligatoires:**
- Première exposition (date, lieu, contexte, réception)
- Évolution du style par périodes créatives:
  * Période 1 (années X-Y): caractéristiques
  * Période 2 (années X-Y): évolution, rupture ou continuité
  * Période actuelle: aboutissement
- Collaborations avec galeries prestigieuses
- Tournant créatif majeur (événement, rencontre, voyage)
- Reconnaissance critique (citations de critiques d'art si disponibles)

**Mots-clés à intégrer:**
- "œuvres [nom artiste]"
- "style [nom artiste]"
- "[nom artiste] galerie [ville]"
- "évolution artistique [nom artiste]"

#### H3: Prix et distinctions (150-200 mots)

**Format liste chronologique inverse:**
```
📌 2024 - Prix X - [Institution] - [Ville]
📌 2022 - Résidence d'artiste - [Lieu] - [Durée]
📌 2020 - Commande publique - [Commanditaire] - [Œuvre]
📌 2018 - Prix Y - [Contexte]
```

**Éléments à détailler pour chaque prix:**
- Nom complet du prix
- Année d'obtention
- Institution organisatrice
- Contexte (nombre de candidats, jury prestigieux, etc.)
- Impact sur la carrière

**Mots-clés:**
- "[nom artiste] prix"
- "distinctions [nom artiste]"
- "[nom prix] [année]"

#### H3: Aujourd'hui et projets en cours (150-200 mots)

**Éléments obligatoires:**
- Lieu de résidence actuel / atelier
- Projets en cours ou à venir (2025-2026)
- Évolution récente du travail
- Ambitions futures
- Message/philosophie actuelle

**Ton:** Plus personnel, prospectif, engageant

---

### SECTION 3: Style et technique (H2)

**Objectif:** 300-500 mots - analyse approfondie du style visuel

**Paragraphe 1: Description visuelle globale (100-150 mots)**
- Impression générale du travail
- Univers visuel caractéristique
- Premier impact sur le spectateur

**Paragraphe 2: Technique et matériaux (100-150 mots)**
- Technique principale (huile, acrylique, mixte, sculpture, etc.)
- Techniques secondaires
- Supports privilégiés (toile, papier, bois, métal)
- Processus de création (du croquis à l'œuvre finale)
- Outils spécifiques

**Paragraphe 3: Palette et composition (100-150 mots)**
- Palette de couleurs dominante
- Utilisation de la lumière
- Principes de composition
- Traitement de l'espace
- Rythme visuel

**Paragraphe 4: Thématiques et influences (100-150 mots)**
- Thèmes récurrents
- Sujets privilégiés
- Influences artistiques:
  * Mouvements (expressionnisme abstrait, nouveau réalisme, etc.)
  * Artistes (références historiques ou contemporaines)
  * Autres influences (littérature, philosophie, nature)

**Citation de l'artiste (encadré):**
> "Citation directe de l'artiste sur sa démarche créative, sa vision, ou son processus"
> — [Prénom Nom], [Année] / [Source si applicable]

**Mots-clés à intégrer:**
- "[style] [nom artiste]"
- "technique [nom artiste]"
- "démarche créative [nom artiste]"
- "art [abstrait/figuratif/etc.] contemporain"
- "influences [nom artiste]"

---

### SECTION 4: Œuvres disponibles (H2)

**Texte d'introduction (50-100 mots):**
> [Prénom Nom] propose actuellement [X] œuvres originales à la vente sur InRealArt. Chaque pièce est accompagnée de son certificat d'authenticité et peut être acquise en achat direct ou via notre système de location avec option d'achat (LOA) dès [€X]/mois.

**Système de filtres (sidebar ou top):**
```
□ Technique
  ☑ Acrylique (23)
  ☐ Huile (12)
  ☐ Mixte (8)

□ Format
  ☐ Petit (< 50cm)
  ☑ Moyen (50-100cm)
  ☐ Grand (> 100cm)

□ Prix
  ☐ < 1000€
  ☑ 1000€ - 5000€
  ☐ > 5000€

□ Année
  ☑ 2024-2025
  ☐ 2020-2023
  ☐ Avant 2020

□ Disponibilité
  ☑ En stock
  ☐ Sur commande
```

**Affichage grille œuvres:**
- Format: grille 3 colonnes desktop / 1 colonne mobile
- Chaque carte œuvre contient:
  * Image optimisée 600x600px WebP
  * Alt text: `[Titre œuvre] par [Nom Artiste] - [Technique] [Dimensions]`
  * Exemple: `Abstraction bleue n°12 par Adélaïde Leferme - Acrylique sur toile 80x100cm`
  * Titre de l'œuvre (H3 ou strong)
  * Dimensions (HxLxP en cm)
  * Technique
  * Année de création
  * Prix TTC
  * Badge "LOA dès XX€/mois"
  * Bouton "Voir les détails"

**Ordre d'affichage par défaut:** Plus récent → Plus ancien

**Lazy loading:** Activer après les 6 premières œuvres

**Mots-clés page œuvre (dans URL et contenu):**
- "acheter [titre oeuvre] [nom artiste]"
- "[nom artiste] [technique]"
- "œuvre originale [nom artiste]"

---

### SECTION 5: Expositions et événements (H2)

#### H3: Expositions à venir

**Format liste avec design cards:**

```
┌─────────────────────────────────────────┐
│ 📅 15 Mars - 30 Avril 2025              │
│                                         │
│ EXPOSITION SOLO                         │
│ "Vibrations chromatiques"              │
│                                         │
│ 📍 Galerie Art Contemporain, Paris     │
│ 🔗 En savoir plus                       │
└─────────────────────────────────────────┘
```

**Informations par exposition:**
- Dates exactes (jour/mois/année)
- Type (solo, collective, salon)
- Titre de l'exposition
- Lieu précis (galerie + ville)
- Lien externe si disponible

#### H3: Expositions passées notables

**Sélection des 10-15 plus prestigieuses (ordre chronologique inverse)**

**Format tableau responsive:**

| Année | Type | Titre | Lieu |
|-------|------|-------|------|
| 2024 | Solo | "Mémoires liquides" | Galerie X, Paris |
| 2023 | Collective | Salon d'Automne | Grand Palais, Paris |
| 2022 | Solo | "Horizons abstraits" | Centre d'Art Y, Lyon |

**Mots-clés:**
- "exposition [nom artiste] [année]"
- "[nom artiste] galerie [ville]"
- "[nom artiste] salon [nom salon]"

---

### SECTION 6: Collections publiques et privées (H2)

**Texte intro (50 mots):**
> Les œuvres de [Prénom Nom] figurent dans de prestigieuses collections publiques et privées en France et à l'international, témoignant de la reconnaissance de son travail par les institutions et collectionneurs avertis.

**Liste collections publiques:**
- 🏛️ [Nom Musée], [Ville], [Pays]
- 🏛️ [Nom Fondation], [Ville], [Pays]
- 🏛️ [Nom Centre d'Art], [Ville], [Pays]

**Collections privées:**
- Nombreuses collections privées en France, Belgique, Suisse
- [Préciser collectionneur si information publique]

**Publications et catalogues:**
- 📖 [Titre catalogue], [Éditeur], [Année]
- 📰 Article dans [Nom revue], [Date]
- 📚 Monographie: [Titre], [Auteur], [Année]

---

### SECTION 7: Cote et investissement (H2)

**Paragraphe 1: Évolution du marché (150 mots)**
- Fourchette de prix actuelle: [€min - €max]
- Évolution sur 5 ans (pourcentage si données disponibles)
- Prix moyen selon format/technique
- Records de vente aux enchères (si applicable)

**Paragraphe 2: Pourquoi investir (200 mots)**

**Sous-titres (strong):**

**Reconnaissance critique**
- Présence dans collections muséales
- Prix et distinctions
- Couverture médiatique

**Potentiel d'appréciation**
- Artiste en milieu de carrière (phase montante)
- Ou: artiste établi (valeur stable)
- Demande croissante du marché pour [style]

**Rareté et unicité**
- Production limitée ([X] œuvres/an)
- Technique maîtrisée rare
- Signature stylistique reconnaissable

**Accessibilité via LOA**
> InRealArt permet d'acquérir les œuvres de [Nom] via location avec option d'achat, facilitant l'investissement dans l'art pour [€X]/mois avec possibilité d'achat à terme.

**CTA:**
- Bouton: `Simuler un achat LOA`
- Lien: `Demander une expertise`

**Mots-clés:**
- "cote [nom artiste]"
- "prix œuvre [nom artiste]"
- "investir art [nom artiste]"
- "valeur [nom artiste]"

---

### SECTION 8: Artistes similaires (H2)

**Objectif:** Maillage interne + augmentation temps sur site + découverte

**Introduction (50 mots):**
> Si vous appréciez le travail de [Prénom Nom], vous pourriez également être intéressé(e) par ces artistes qui partagent une sensibilité ou une approche similaire.

**Format: Grille 3 colonnes (desktop) / 1 colonne (mobile)**

**Chaque carte artiste contient:**
- Portrait miniature 200x200px (format carré, WebP)
- Nom complet
- Style en 3-5 mots
- Description courte (50 mots max):
  * Point commun avec l'artiste principal
  * Spécificité unique
  * 1-2 mots-clés techniques
- Lien: `Découvrir [Nom]`

**Critères de sélection des artistes similaires:**
- Même style ou mouvement artistique
- Technique comparable
- Palette de couleurs similaire
- Thématiques proches
- Même génération ou parcours

**Nombre recommandé:** 4-6 artistes

**Exemple carte:**

```
┌─────────────────────────────────┐
│     [Portrait Stefan Beiu]      │
│                                 │
│      Stefan Beiu               │
│   Sculpteur abstrait roumain   │
│                                 │
│ Comme Adélaïde, Stefan explore │
│ les formes organiques abstraites│
│ mais dans le volume et la matière│
│                                 │
│      [Découvrir Stefan]         │
└─────────────────────────────────┘
```

---

### SECTION 9: FAQ (H2)

**Objectif:** Capturer featured snippets Google + répondre aux questions courantes

**Format:** 6-8 questions avec réponses structurées

**Questions types obligatoires:**

**Q1: Où est né(e) [Nom Artiste] ?**
R: [Réponse 50-100 mots incluant ville, pays, date, contexte si pertinent]

**Q2: Quelle est la technique de prédilection de [Nom Artiste] ?**
R: [Réponse détaillée technique principale, supports, matériaux, processus]

**Q3: Combien coûte une œuvre de [Nom Artiste] ?**
R: [Fourchette précise selon format + mention LOA]

**Q4: Peut-on acheter les œuvres de [Nom Artiste] en LOA ?**
R: Oui, InRealArt propose la location avec option d'achat pour toutes les œuvres de [Nom]. À partir de [€X]/mois, vous pouvez...

**Q5: Où voir les œuvres de [Nom Artiste] ?**
R: [Galeries physiques + expositions en cours + collection InRealArt en ligne]

**Q6: [Nom Artiste] a-t-il/elle remporté des prix ?**
R: [Liste 3-5 prix principaux avec années]

**Q7: Quelle est la cote de [Nom Artiste] ?**
R: [Évolution du marché, fourchette prix, facteurs d'appréciation]

**Q8: Comment authentifier une œuvre de [Nom Artiste] ?**
R: Chaque œuvre vendue sur InRealArt est accompagnée d'un certificat d'authenticité signé par l'artiste...

**Format visuel FAQ:**
- Accordéon (réponses repliables)
- Ou: questions apparentes, réponses développées
- Schema FAQPage JSON-LD (voir section 3)

**Mots-clés questions:**
- "[nom artiste] technique"
- "prix [nom artiste]"
- "[nom artiste] biographie courte"
- "acheter [nom artiste]"

---

## 5. STRATÉGIE MOTS-CLÉS LONGUE TRAÎNE

### Mots-clés principaux (densité 1-2%)

**Intégration naturelle dans:**
- H1
- Premier paragraphe (100 premiers mots)
- H2 principaux
- Alt text images
- Meta title & description

**Liste mots-clés principaux:**
1. [Prénom Nom] (nom exact)
2. [Prénom Nom] artiste
3. [Prénom Nom] peintre / sculpteur / photographe
4. artiste [style] [nationalité]
5. [style] contemporain français

**Exemple pour Adélaïde Leferme:**
- Adélaïde Leferme
- Adélaïde Leferme artiste
- Adélaïde Leferme peintre
- artiste abstraite française
- peinture abstraite contemporaine

### Mots-clés informationnels (section biographie)

**Objectif:** Capter recherches informatives top of funnel

1. [nom] biographie
2. qui est [nom]
3. parcours artistique [nom]
4. vie et œuvre [nom]
5. [nom] formation
6. [nom] influences
7. style [nom]
8. technique [nom]
9. démarche créative [nom]
10. philosophie artistique [nom]

### Mots-clés transactionnels (sections œuvres/achat)

**Objectif:** Capter intention d'achat bottom of funnel

1. acheter œuvre [nom]
2. [nom] œuvres à vendre
3. prix [nom]
4. cote [nom]
5. [nom] LOA
6. location avec option d'achat art [nom]
7. investir dans [nom]
8. acheter [technique] [nom]
9. œuvre originale [nom]
10. [nom] disponible

### Mots-clés de découverte (section similaires)

**Objectif:** Capter recherches exploratoires

1. artiste comme [nom]
2. artiste similaire à [nom]
3. peintre [style] contemporain
4. artiste [technique] [nationalité]
5. meilleurs artistes [style] français
6. artiste [style] à découvrir
7. jeune artiste [style]
8. artiste [ville/région]

### Mots-clés géolocalisés

**Si l'artiste a un ancrage géographique fort:**

1. artiste [ville]
2. peintre [région]
3. [nom] galerie [ville]
4. exposition [nom] [ville]
5. atelier artiste [ville]

**Exemple:**
- artiste Paris
- peintre abstraite parisienne
- Adélaïde Leferme galerie Paris
- exposition Adélaïde Leferme Paris

---

## 6. OPTIMISATIONS TECHNIQUES

### Performance & Core Web Vitals

**LCP (Largest Contentful Paint) < 2.5s:**
- Images hero optimisées WebP
- Portrait artiste: max 100KB
- Première œuvre visible: max 150KB
- Preload de l'image hero
- Critical CSS inline

**FID (First Input Delay) < 100ms:**
- JavaScript différé ou async
- Pas de render-blocking scripts
- Event handlers optimisés

**CLS (Cumulative Layout Shift) < 0.1:**
- Dimensions explicites sur toutes les images
- Pas de contenu injecté dynamiquement above fold
- Skeleton loaders si nécessaire

**Autres optimisations:**
- Compression Gzip/Brotli activée
- Minification CSS/JS
- Lazy loading images après les 6 premières
- CDN pour assets statiques
- Cache browser (1 an pour images)

### Images

**Formats:**
- Format principal: WebP
- Fallback: JPG/PNG
- SVG pour logos et icônes

**Dimensions recommandées:**
- Portrait artiste: 500x500px (carré)
- Œuvres grille: 600x600px (carré)
- Œuvres zoom: 1200x1200px
- Bannière hero si applicable: 1920x600px

**Compression:**
- WebP: qualité 80-85%
- JPG: qualité 75-80%
- Optimisation avec ImageOptim, Squoosh, ou Sharp

**Alt text obligatoire:**
- Portrait: `Portrait de [Prénom Nom], [style] [nationalité]`
- Œuvre: `[Titre] par [Nom Artiste] - [Technique] [Dimensions]`
- Jamais d'alt vide sauf images purement décoratives

**Lazy loading:**
```html
<img src="image.webp" alt="..." loading="lazy" width="600" height="600">
```

### Internal Linking

**Liens sortants de la page artiste:**
- Vers 4-6 artistes similaires (ancres: "Découvrir [Nom]")
- Vers articles blog mentionnant l'artiste (ancres: titre article)
- Vers page galerie/collection principale
- Vers simulateur LOA (ancre contextualisée)
- Vers page "Toutes les œuvres" si catalogue étendu

**Ancres descriptives (jamais "cliquez ici"):**
✅ "Découvrir les œuvres de Stefan Beiu"
✅ "En savoir plus sur la technique acrylique"
✅ "Simuler un achat LOA pour cette œuvre"
❌ "Cliquez ici"
❌ "En savoir plus"
❌ "Voir"

**Densité:** 1 lien interne tous les 150-200 mots

### Mobile First

**Design responsive:**
- Breakpoints: 320px, 768px, 1024px, 1440px
- Images adaptatives avec srcset
- Navigation hamburger mobile

**Typographie mobile:**
- Police minimum: 16px (pour éviter zoom automatique iOS)
- Interligne: 1.5
- Contraste minimum: 4.5:1

**CTA touch-friendly:**
- Taille minimum: 44x44px (Apple HIG)
- Espacement entre CTA: minimum 8px
- Zone de tap étendue

**Performance mobile:**
- Objectif: < 3s sur 3G
- Images mobile spécifiques (plus petites)
- Moins de contenu above fold

### Indexation & Crawlabilité

**URL structure:**
- Propre: `/artists/[slug-prenom-nom]`
- Pas de paramètres dynamiques
- Minuscules uniquement
- Tirets pour séparateurs (pas underscores)

**Sitemap XML:**
- Inclusion de toutes les pages artistes
- Priority: 0.8 (pages importantes)
- Changefreq: monthly
- Lastmod: date dernière modification

**Robots.txt:**
```
User-agent: *
Allow: /artists/
Disallow: /artists/preview/
Disallow: /artists/draft/

Sitemap: https://www.inrealart.com/sitemap.xml
```

**Canonical:**
- Self-referencing canonical sur chaque page
- Éviter duplicate content

**Hreflang (si multilingue):**
```html
<link rel="alternate" hreflang="fr" href="https://www.inrealart.com/artists/adelaide-leferme" />
<link rel="alternate" hreflang="en" href="https://www.inrealart.com/en/artists/adelaide-leferme" />
<link rel="alternate" hreflang="x-default" href="https://www.inrealart.com/artists/adelaide-leferme" />
```

---

## 7. STRATÉGIE CONTENU BLOG (BOOST SEO)

**Objectif:** Créer du contenu complémentaire avec liens internes vers pages artistes

### Article type 1: Portrait approfondi

**Titre:** "Découvrez [Prénom Nom], [style] [nationalité] contemporain(e)"

**Longueur:** 1500-2000 mots

**Structure:**
1. Introduction accrocheuse (anecdote, citation, contexte)
2. Analyse approfondie du style unique (300 mots)
3. Zoom sur 3-4 œuvres emblématiques (400 mots)
4. Interview ou citations de l'artiste (300 mots)
5. Pourquoi s'intéresser à cet artiste aujourd'hui (200 mots)
6. CTA: "Voir toutes les œuvres de [Nom]"

**Mots-clés ciblés:**
- "découvrir [nom artiste]"
- "portrait artiste [nom]"
- "[nom] art contemporain"

**Liens internes:**
- Vers page artiste principale (ancre nom complet)
- Vers pages œuvres mentionnées
- Vers artistes similaires

**Fréquence publication:** 1 article / nouvel artiste sur la plateforme

---

### Article type 2: Guide investissement

**Titre:** "Pourquoi investir dans l'art de [Prénom Nom] en 2025 ?"

**Longueur:** 1200-1500 mots

**Structure:**
1. État du marché de [style] (200 mots)
2. Reconnaissance et légitimité de l'artiste (300 mots)
3. Analyse de la cote et potentiel (400 mots)
4. Comment acheter/investir via InRealArt (300 mots)
5. Témoignages collectionneurs (si disponible) (200 mots)

**Mots-clés:**
- "investir art [nom]"
- "potentiel [nom]"
- "cote [nom] évolution"

**CTA:**
- "Simuler un achat LOA"
- "Demander une expertise"

**Fréquence:** 1 article / artiste établi avec cote montante

---

### Article type 3: Listicle comparatif

**Titre:** "Top 10 artistes [style] contemporains à suivre en 2025"

**Longueur:** 2000-2500 mots

**Structure:**
- Introduction sur le [style] contemporain (200 mots)
- 10 artistes avec:
  * Portrait miniature
  * Bio courte (100 mots)
  * 1-2 œuvres représentatives
  * Pourquoi le suivre
  * Lien vers page artiste

**Critères sélection:**
- Mix artistes établis + émergents
- Diversité géographique
- Tous disponibles sur InRealArt

**Mots-clés:**
- "meilleurs artistes [style]"
- "artistes [style] à suivre"
- "top artistes contemporains [style]"

**Fréquence:** 1 article / trimestre (mise à jour annuelle)

---

### Article type 4: Interview / Behind the scenes

**Titre:** "Dans l'atelier de [Prénom Nom] : rencontre avec [style]"

**Longueur:** 1500-2000 mots

**Structure:**
1. Introduction: contexte de la rencontre
2. L'atelier: description, ambiance, organisation (300 mots)
3. Interview Q&A (800 mots):
   - Processus créatif
   - Inspirations actuelles
   - Projets en cours
   - Vision de l'art
4. Photos exclusives atelier + œuvres en cours
5. Œuvres disponibles à l'achat

**Médias:**
- 8-12 photos haute qualité
- Vidéo courte (1-2 min) si possible
- Ambiance sonore atelier (optionnel)

**Mots-clés:**
- "atelier [nom artiste]"
- "interview [nom artiste]"
- "processus créatif [nom]"

**Fréquence:** 1 article / artiste star ou nouvel arrivant majeur

---

### Article type 5: Analyse technique

**Titre:** "[Technique] chez [Prénom Nom] : décryptage d'un savoir-faire unique"

**Longueur:** 1000-1500 mots

**Structure:**
1. Histoire de la technique (contexte historique) (200 mots)
2. Spécificités de l'approche de l'artiste (400 mots)
3. Étapes du processus (avec schémas/photos) (400 mots)
4. Ce qui rend son travail unique (200 mots)

**Mots-clés:**
- "[technique] [nom artiste]"
- "technique artistique [style]"
- "savoir-faire [nom]"

**Fréquence:** 1 article / artiste avec technique rare ou signature

---

## 8. MÉTRIQUES DE SUCCÈS (KPIs)

### Trafic organique (Google Analytics 4)

**Métriques primaires:**
- Sessions organiques par page artiste: **objectif min 50/mois**
- Users organiques: **objectif min 40/mois**
- Pages vues organiques: **objectif min 150/mois**

**Suivi temporel:**
- Benchmark J0 (avant optimisation)
- Mesure J+7, J+15, J+30
- Objectif: +200% à J+30

**Segmentation:**
- Desktop vs Mobile
- Nouveau vs Returning
- Par source organique (Google, Bing, etc.)

---

### Positionnement (Google Search Console)

**Requêtes prioritaires:**

**Priorité 1 - Nom exact artiste:**
- "[Prénom Nom]": **Top 1 obligatoire**
- "[Prénom Nom] artiste": **Top 3**
- "[Prénom Nom] peintre/sculpteur": **Top 3**

**Priorité 2 - Informationnelles:**
- "[nom] biographie": **Top 10**
- "[nom] œuvres": **Top 10**
- "qui est [nom]": **Top 20**

**Priorité 3 - Transactionnelles:**
- "acheter œuvre [nom]": **Top 20**
- "[nom] prix": **Top 20**
- "[nom] à vendre": **Top 30**

**Métriques Search Console:**
- Impressions totales: **objectif min 500/mois**
- Clics totaux: **objectif min 20/mois**
- CTR moyen: **objectif > 3%**
- Position moyenne: **objectif < 20**

**Featured snippets:**
- Objectif: min 1 question FAQ en position 0
- Questions ciblées (FAQ section)

---

### Engagement (GA4)

**Temps sur page:**
- Objectif: **> 3 minutes**
- Benchmark moyen industrie: 1m30s
- Top performers: 5-7 minutes

**Taux de rebond:**
- Objectif: **< 60%**
- Benchmark moyen: 70-80%
- Top performers: 40-50%

**Pages par session:**
- Objectif: **> 2.5 pages**
- Indicateur de navigation interne efficace

**Scroll depth:**
- 25%: > 90% des visiteurs
- 50%: > 70% des visiteurs
- 75%: > 50% des visiteurs
- 100%: > 30% des visiteurs

**Interactions:**
- Clics vers œuvres: **objectif min 15% des visiteurs**
- Clics CTA LOA: **objectif min 5%**
- Clics artistes similaires: **objectif min 10%**

---

### Conversion (GA4 Events)

**Micro-conversions:**

**Simulation LOA:**
- Événement: `loa_simulation_started`
- Objectif: **5% des visiteurs organiques**
- Top performers: 8-10%

**Contact artiste/galerie:**
- Événement: `contact_form_submitted`
- Objectif: **2% des visiteurs**

**Ajout wishlist:**
- Événement: `artwork_wishlisted`
- Objectif: **3% des visiteurs**

**Macro-conversions:**

**Ajout panier:**
- Événement: `add_to_cart`
- Objectif: **1% des visiteurs organiques**
- Valeur moyenne panier: tracking

**Achat complété:**
- Événement: `purchase`
- Objectif: **0.5% des visiteurs** (ou 50% des paniers)

**ROI SEO:**
- Coût acquisition organique: ~0€
- Valeur moyenne transaction: [€X]
- ROI à J+30: calculer conversion value / coût optimisations

---

### Indexation (Search Console)

**Pages indexées:**
- Statut: indexé & éligible
- Vérifier absence erreurs 404, 5xx
- Couverture: 100% des pages artistes

**Découverte:**
- Via sitemap: vérifier soumission
- Crawl récent: < 7 jours

**Mobile usability:**
- 0 erreur mobile
- All pages mobile-friendly

**Core Web Vitals:**
- LCP: Good (> 75% URLs)
- FID: Good (> 75% URLs)
- CLS: Good (> 75% URLs)

---

## 9. CHECKLIST PRÉ-PUBLICATION

### ✅ SEO On-Page

- [ ] Title optimisé (55-60 caractères, mots-clés principaux)
- [ ] Meta description (150-155 caractères, CTA inclus)
- [ ] URL slug propre (/artists/prenom-nom, minuscules, tirets)
- [ ] H1 unique avec nom complet artiste
- [ ] Structure H2/H3 logique et SEO-friendly (8-10 H2 minimum)
- [ ] Mots-clés principaux dans 100 premiers mots
- [ ] Densité mots-clés naturelle (1-2%, pas de sur-optimisation)
- [ ] Alt text sur toutes les images (descriptif et mots-clés)
- [ ] 4-6 liens internes pertinents (ancres descriptives)
- [ ] Canonical URL définie (self-referencing)
- [ ] Open Graph tags (Facebook)
- [ ] Twitter Card tags

### ✅ Données Structurées

- [ ] Schema.org Person intégré (JSON-LD dans <head>)
- [ ] Schema.org VisualArtwork pour chaque œuvre
- [ ] Schema.org BreadcrumbList
- [ ] Schema.org FAQPage (si section FAQ présente)
- [ ] Validation avec Google Rich Results Test (0 erreur)
- [ ] Validation avec Schema.org Validator

### ✅ Contenu

- [ ] Biographie minimum 800 mots
- [ ] Section style et technique présente (300-500 mots)
- [ ] Minimum 4 œuvres affichées avec infos complètes
- [ ] Expositions listées (passées + à venir)
- [ ] Section FAQ avec minimum 6 questions
- [ ] Artistes similaires (4-6) avec liens
- [ ] CTA clairs et visibles (simulateur LOA, contact, œuvres)
- [ ] Ton professionnel et engageant (pas de jargon excessif)
- [ ] Citations ou interview si disponible
- [ ] Call-to-action contextualisés

### ✅ Technique

- [ ] Images optimisées WebP + fallback JPG
- [ ] Dimensions explicites sur toutes images
- [ ] Lazy loading activé (après 6 premières images)
- [ ] Temps chargement < 2.5s (LCP)
- [ ] Mobile responsive validé sur 3 devices minimum
- [ ] Core Web Vitals OK (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] HTTPS actif (SSL valide)
- [ ] Compression Gzip/Brotli activée
- [ ] Cache browser configuré
- [ ] CSS/JS minifiés
- [ ] Aucun lien brisé (404)
- [ ] Sitemap.xml mis à jour avec nouvelle URL

### ✅ Post-Publication

- [ ] Soumission URL dans Google Search Console
- [ ] Indexation demandée (Inspect URL → Request Indexing)
- [ ] Vérification indexation après 24-48h
- [ ] Article blog complémentaire publié avec lien interne
- [ ] Partage social avec UTM (Facebook, Instagram, LinkedIn)
- [ ] Email newsletter si applicable (segment collectionneurs)
- [ ] Monitoring GA4 activé (événements configurés)
- [ ] Monitoring GSC activé (requêtes suivies)
- [ ] Ajout dans calendrier de révision (J+7, J+30, J+90)

### ✅ Qualité

- [ ] Orthographe et grammaire vérifiées
- [ ] Dates et informations factuelles vérifiées
- [ ] Cohérence avec autres pages artistes (template unifié)
- [ ] Test sur navigateurs: Chrome, Firefox, Safari, Edge
- [ ] Test sur devices: Desktop, Tablet, Mobile
- [ ] Accessibilité: contraste, taille police, navigation clavier
- [ ] Temps chargement testé sur 3G (< 5s acceptable mobile)

---

## 10. PLAN D'ACTION 30 JOURS

### Semaine 1 (J1-J7): Audit & Préparation

**Jour 1-2: Audit de l'existant**
- Inventaire pages artistes actuelles
- Benchmark positions Search Console
- Benchmark trafic GA4 (derniers 30 jours)
- Liste artistes prioritaires (top 10 par trafic potentiel)

**Jour 3-4: Collecte contenu**
- Biographies complètes (sources: artistes, galeries, communiqués)
- Photos haute qualité (portraits, œuvres, ateliers)
- Listes expositions/prix (vérification dates)
- Citations artistes si disponibles

**Jour 5-7: Optimisation technique**
- Installation plugin Schema.org
- Configuration lazy loading images
- Optimisation images existantes (WebP)
- Tests Core Web Vitals

---

### Semaine 2 (J8-J14): Déploiement pages prioritaires

**Jour 8-10: Pages artistes top 5**
- Application template complet
- Intégration contenu optimisé
- Ajout Schema.org
- Tests mobiles

**Jour 11-12: Pages artistes 6-10**
- Même process
- Focus sur mots-clés spécifiques par artiste

**Jour 13-14: Soumission & monitoring**
- Soumission URLs Search Console
- Configuration tracking GA4
- Mise à jour sitemap.xml

---

### Semaine 3 (J15-J21): Contenu blog & maillage interne

**Jour 15-17: Articles blog**
- 3 articles portrait (1 par jour)
- Liens internes vers pages artistes

**Jour 18-19: Optimisation maillage**
- Ajout section "Artistes similaires" sur toutes pages
- Optimisation ancres de liens
- Liens depuis blog vers pages artistes

**Jour 20-21: Réseaux sociaux**
- 10 posts (1 artiste/jour)
- Trafic vers pages optimisées
- UTM tracking

---

### Semaine 4 (J22-J30): Analyse & itération

**Jour 22-24: Analyse intermédiaire**
- Positions Search Console (évolution)
- Trafic GA4 (évolution vs benchmark)
- Identification quick wins

**Jour 25-27: Optimisations secondaires**
- Pages artistes 11-20
- Amélioration pages top 10 si nécessaire
- Ajustement mots-clés

**Jour 28-30: Rapport final**
- Dashboard KPIs
- Analyse ROI
- Recommandations mois 2

---

## TEMPLATES PRÊTS À L'EMPLOI

### Template Title

```
[Prénom Nom] - [Spécialité] | Biographie, Œuvres & Prix | InRealArt
```

**Exemples:**
- `Adélaïde Leferme - Artiste Peintre Abstraite | Bio, Œuvres & Cote | InRealArt`
- `Stefan Beiu - Sculpteur Contemporain Roumain | Œuvres & Expositions | InRealArt`
- `Catherine Senechal - Peintre Coloriste Française | Art & Prix | InRealArt`

---

### Template Meta Description

```
Découvrez [Prénom Nom], [style] [nationalité]. Biographie complète, [X] œuvres originales de [€min]-[€max], expositions 2025 & acheter en ligne. LOA dès [€X]/mois sur InRealArt.
```

**Exemples:**
- `Découvrez Adélaïde Leferme, peintre abstraite française contemporaine. 45+ œuvres de 800€-12000€, biographie, expositions 2025. LOA dès 89€/mois.` (155 car.)
- `Stefan Beiu, sculpteur roumain. 30 sculptures originales 1500€-25000€, biographie complète, expositions. Achat LOA disponible dès 150€/mois.` (145 car.)

---

### Template Introduction Biographie

```
Né(e) à [Ville] en [année], [Prénom Nom] est un(e) [spécialité] [nationalité] dont le travail explore [thématique principale]. Formé(e) à [École/Institution], [il/elle] développe depuis [année] un univers artistique singulier caractérisé par [trait distinctif]. Ses œuvres, présentes dans [X] collections [publiques/privées], témoignent d'une recherche constante sur [axe de recherche].
```

**Exemple rempli:**
> Née à Paris en 1975, Adélaïde Leferme est une artiste peintre française dont le travail explore les frontières de l'abstraction lyrique. Formée aux Beaux-Arts de Paris, elle développe depuis 2008 un univers artistique singulier caractérisé par une palette chromatique intense et des compositions gestuelles. Ses œuvres, présentes dans 12 collections publiques et de nombreuses collections privées internationales, témoignent d'une recherche constante sur la mémoire émotionnelle et l'invisible.

---

### Template Alt Text Images

**Portrait artiste:**
```
Portrait de [Prénom Nom], [style] [nationalité]
```
Exemple: `Portrait d'Adélaïde Leferme, peintre abstraite française`

**Œuvre:**
```
[Titre œuvre] par [Prénom Nom] - [Technique] [Dimensions HxL cm]
```
Exemple: `Abstraction bleue n°12 par Adélaïde Leferme - Acrylique sur toile 80x100cm`

**Exposition/événement:**
```
[Nom Artiste] lors de [événement], [lieu], [année]
```
Exemple: `Adélaïde Leferme lors du vernissage Salon d'Automne, Grand Palais Paris, 2024`

---

### Template FAQ Question

**Q: Où est né(e) [Nom Artiste] ?**
R: [Prénom Nom] est né(e) à [Ville], [Pays], le [Date]. [Contexte supplémentaire 1-2 phrases si pertinent: environnement familial, contexte culturel, influence de la région].

**Q: Quelle est la technique de prédilection de [Nom Artiste] ?**
R: [Prénom Nom] travaille principalement [technique principale] sur [support principal]. [Il/Elle] utilise également [techniques secondaires]. Son processus créatif se caractérise par [spécificité technique unique].

**Q: Combien coûte une œuvre de [Nom Artiste] ?**
R: Les œuvres de [Prénom Nom] sont proposées entre [€min] et [€max] selon le format, la technique et la période de création. Les œuvres [format moyen/technique courante] se situent généralement autour de [€moyen]. InRealArt propose également l'achat en location avec option d'achat (LOA) à partir de [€X]/mois.

---

## RESSOURCES & OUTILS

### Outils SEO

**Audit & Recherche:**
- Google Search Console (positions, impressions, CTR)
- Google Analytics 4 (trafic, engagement, conversions)
- Screaming Frog (crawl technique, erreurs)
- Ahrefs / SEMrush (keywords, concurrence)

**Optimisation:**
- Google Rich Results Test (Schema.org validation)
- PageSpeed Insights (Core Web Vitals)
- Google Mobile-Friendly Test
- Schema.org Validator

**Contenu:**
- Hemingway Editor (lisibilité)
- Grammarly (orthographe EN)
- Antidote (orthographe FR)
- ChatGPT / Claude (génération contenu, reformulation)

### Outils Images

**Optimisation:**
- Squoosh (compression WebP)
- ImageOptim (batch optimization)
- TinyPNG (compression PNG/JPG)
- Cloudinary (CDN + optimisation automatique)

**Édition:**
- Photoshop / Affinity Photo
- Canva (templates réseaux sociaux)
- Remove.bg (suppression arrière-plan)

---

## CONCLUSION

Ce template complet couvre l'intégralité des optimisations nécessaires pour positionner efficacement les pages artistes d'InRealArt en 1ère page Google.

**Points clés de succès:**
1. **Contenu substantiel** (min 800 mots biographie)
2. **Schema.org** (Person + VisualArtwork)
3. **Mots-clés longue traîne** (informationnels + transactionnels)
4. **Maillage interne fort** (artistes similaires, blog)
5. **Performance technique** (Core Web Vitals)
6. **FAQ optimisée** (featured snippets)

**Suivi recommandé:**
- Hebdomadaire: positions Search Console
- Mensuel: trafic GA4, conversions
- Trimestriel: ROI global SEO

**Prochaines étapes:**
1. Appliquer template sur top 10 artistes
2. Mesurer résultats à J+30
3. Itérer sur pages artistes restantes
4. Développer stratégie contenu blog long terme

---

**Document créé par Maxime pour InRealArt - Février 2025**
**Version 1.0**
