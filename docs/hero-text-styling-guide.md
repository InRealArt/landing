# Guide de Style Hero Text

## Vue d'ensemble

Ce guide explique comment utiliser le système de style unifié pour les textes de hero sur le site. La solution utilise des classes CSS personnalisées et un composant réutilisable pour assurer la cohérence et la lisibilité.

## Classes CSS Personnalisées

### `.hero-text-container`

- **Fonction** : Conteneur principal avec fond blur et ombre
- **Propriétés** :
  - `backdrop-filter: blur(4px)` - Effet de flou d'arrière-plan
  - `background-color: rgba(0, 0, 0, 0.4)` - Fond noir semi-transparent
  - `border-radius: 0.5rem` - Coins arrondis
  - `box-shadow` - Ombre portée pour la profondeur
  - `padding` responsive - Espacement adaptatif
  - `max-width: 56rem` - Largeur maximale

### `.hero-title`

- **Fonction** : Style pour les titres principaux
- **Propriétés** :
  - `color: white` - Texte blanc
  - `text-shadow: 0 4px 6px rgba(0, 0, 0, 0.3)` - Ombre portée pour la lisibilité
  - `font-family: Bricolage Grotesque` - Police de caractères
  - `font-weight: 700` - Gras

### `.hero-subtitle`

- **Fonction** : Style pour les sous-titres
- **Propriétés** :
  - `color: white` - Texte blanc
  - `text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3)` - Ombre portée plus subtile

## Composant HeroText

### Utilisation de base

```tsx
import HeroText from "@/components/common/HeroText";

<HeroText title="Mon Titre" subtitle="Ma description" />;
```

### Utilisation avancée

```tsx
<HeroText
  title="Mon Titre"
  subtitle="Ma description"
  titleClassName="text-4xl md:text-6xl mb-4"
  subtitleClassName="text-lg max-w-2xl"
  className="max-w-3xl"
>
  <button className="mt-4 bg-purple-600 text-white px-6 py-2 rounded">
    Mon Bouton
  </button>
</HeroText>
```

### Props du composant

| Prop                | Type        | Requis | Description                                   |
| ------------------- | ----------- | ------ | --------------------------------------------- |
| `title`             | `string`    | ✅     | Titre principal                               |
| `subtitle`          | `string`    | ❌     | Sous-titre optionnel                          |
| `children`          | `ReactNode` | ❌     | Contenu additionnel (boutons, etc.)           |
| `className`         | `string`    | ❌     | Classes CSS additionnelles pour le conteneur  |
| `titleClassName`    | `string`    | ❌     | Classes CSS additionnelles pour le titre      |
| `subtitleClassName` | `string`    | ❌     | Classes CSS additionnelles pour le sous-titre |

## Migration des Composants Existants

### Avant (exemple ArtistsHero)

```tsx
<div className="backdrop-blur-sm bg-black/40 rounded-lg p-4 sm:p-6 md:p-8 max-w-4xl shadow-2xl">
  <h1 className="bricolage-grotesque text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight text-white drop-shadow-lg">
    {t("artists.hero.title")}
  </h1>
  <p className="text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl leading-relaxed text-white drop-shadow-md">
    {t("artists.hero.subtitle")}
  </p>
</div>
```

### Après

```tsx
<HeroText
  title={t("artists.hero.title")}
  subtitle={t("artists.hero.subtitle")}
  titleClassName="text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl mb-2 sm:mb-3 md:mb-4 leading-tight"
  subtitleClassName="text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl leading-relaxed"
/>
```

## Avantages

1. **Cohérence** : Style uniforme sur tous les heroes
2. **Maintenabilité** : Modifications centralisées dans Tailwind config
3. **Lisibilité** : Texte blanc avec ombres portées pour tous les modes
4. **Responsive** : Padding et tailles adaptatifs
5. **Flexibilité** : Classes additionnelles personnalisables

## Composants à Migrer

- [ ] `src/components/marketplace/Hero.tsx`
- [ ] `src/components/academy/AcademyHero.tsx`
- [ ] `src/components/about/AboutHero.tsx`
- [ ] `src/components/team/TeamHero.tsx`
- [ ] `src/components/joinInRealArt/JoinInRealArtHero.tsx`
- [ ] `src/components/joinInRealArt/JoinIraHero.tsx`
- [ ] `src/components/blog/Hero.tsx`
- [ ] `src/components/usecase/companies/Hero.tsx`
- [ ] `src/components/usecase/leasing/Hero.tsx`
- [ ] `src/components/usecase/fractionate/Hero.tsx`
- [ ] `src/components/usecase/lending/Hero.tsx`
- [ ] `src/components/artists/Hero.tsx`
- [ ] `src/components/token/TokenHero.tsx`
- [ ] `src/components/presale/TokenHero.tsx`
