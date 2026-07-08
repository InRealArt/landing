# Home Hero Featured Slider — Design Spec

Date: 2026-07-08

## Contexte

Dans `HomeHero.tsx`, la zone "Featured contextuelle par persona" (lignes 264-319) affiche
aujourd'hui une seule image statique (l'œuvre de la semaine OU l'artiste de la semaine),
selon le toggle de persona sélectionné en haut du hero (Collectionneur / Artiste).

Objectif : remplacer cette zone statique par un slider élégant et moderne qui fait défiler
automatiquement "artiste de la semaine" et "œuvre de la semaine", indépendamment du toggle
persona. Le texte du claim/CTA en dessous (headline, subheadline, CTA) reste inchangé et
continue de dépendre du toggle persona comme aujourd'hui.

## Décisions validées

1. **Contenu du slider** : fusionne les featured des 2 personas actives — `featuredArtwork`
   (œuvre de la semaine) et `featuredArtist` (artiste de la semaine). Le slider est
   indépendant du toggle persona ; celui-ci ne pilote plus que le claim/CTA en dessous.
   `featuredPost` (persona enterprise, actuellement commentée dans `PROFILES`) n'est pas
   inclus tant que ce persona n'est pas réactivé.
2. **Cas 1 ou 0 item** : si un seul des deux featured est non-null, le slider affiche ce
   slide unique sans autoplay ni pagination. Si les deux sont null, la zone ne s'affiche pas
   du tout (comportement actuel conservé).
3. **Contenu par slide** : badge ("Œuvre de la semaine" / "Artiste de la semaine"), lien de
   clic (`/presale` ou `/artists/[slug]`), et texte descriptif sous l'image sont tous liés
   au slide actif — pas au toggle persona.

## Architecture

### Nouveau composant : `src/components/home/HomeHeroFeaturedSlider.tsx`

Client component, extrait de la zone "Featured contextuelle" actuelle. Reçoit en props :

```ts
interface HomeHeroFeaturedSliderProps {
  featuredArtwork: FeaturedArtwork | null
  featuredArtist: FeaturedArtist | null
}
```

Construit en interne un tableau de slides typé :

```ts
interface FeaturedSlide {
  key: 'artwork' | 'artist'
  href: string
  imageUrl: string
  alt: string
  badgeLabel: string       // texte déjà résolu (i18n via t())
  descriptionText: string  // texte discret sous l'image, déjà résolu
}
```

- Si `featuredArtwork` non-null → slide `artwork` (href `/presale`).
- Si `featuredArtist` non-null → slide `artist` (href `/artists/${featuredArtist.slug}`).
- `slides.length === 0` → le composant retourne `null`.
- `slides.length === 1` → rendu du slide unique sans Swiper autoplay/pagination (juste le
  markup visuel statique, pour éviter le poids inutile d'un slider à un seul état).
- `slides.length >= 2` → Swiper avec `Autoplay`, `EffectFade`, `Pagination`.

### Intégration dans `HomeHero.tsx`

- Remplace le bloc `<div ref={featuredRef} className="mb-12">...</div>` (lignes 265-319) par
  `<HomeHeroFeaturedSlider featuredArtwork={featuredArtwork} featuredArtist={featuredArtist} />`.
- Supprime le calcul `hasFeaturedContent` lié à `active` (n'est plus utilisé pour cette zone).
- `featuredRef` et l'animation GSAP de transition liée au changement de persona (lignes
  112-119, 137-144) sont retirées, puisque la zone featured ne réagit plus au changement de
  persona — elle vit sa propre vie via Swiper.
- `HomeHero.tsx` continue de recevoir `featuredArtwork`, `featuredArtist`, `featuredPost` via
  `HomeHeroWrapper.tsx` sans changement de ce côté (le wrapper ne change pas).

## Design visuel

### Dimensions et layout

- Largeur : `max-w-4xl` (élargi depuis l'actuel `max-w-2xl`), centré dans le container du
  hero ; marges gauche/droite données par le padding existant de la section
  (`px-6 sm:px-12 lg:px-24 xl:px-32`).
- Ratio : `aspect-[4/3] sm:aspect-[16/9]` — resserré sur mobile, panoramique dès `sm`.
  Remplace les hauteurs fixes actuelles (`h-[420px] sm:h-[520px]`).
- Coins nets, pas de `rounded-*` — cohérent avec les cards persona et l'esthétique
  anguleuse du site.

### Par slide

- Image de fond en `object-cover`, transition `scale` légère au survol (`group-hover/img:scale-[1.03]`,
  comme aujourd'hui).
- Overlay dégradé `bg-gradient-to-t from-black via-black/50 to-transparent opacity-80`
  (identique à l'existant) pour la lisibilité du badge.
- Badge en haut à gauche : `bg-black/70 text-gold-accent text-[9px] uppercase tracking-[0.3em]
  px-3 py-1.5 montserrat backdrop-blur-sm` (identique au style actuel).
- Gradient bas additionnel `h-24 bg-gradient-to-t from-black/60 to-transparent` (identique).
- Texte discret sous l'image : `text-white/30 text-xs leading-relaxed`, dans un container
  `max-w-4xl` aligné avec l'image, qui change avec un court fondu synchronisé au slide actif.

### Transition et autoplay

- `EffectFade` de Swiper (crossfade pur, ~600ms), pas de swipe horizontal.
- Autoplay : `delay: 3000`, `disableOnInteraction: false`, `pauseOnMouseEnter: true`.
- `loop: true` quand `slides.length >= 2`.

### Indicateurs (pagination)

- Dots custom : fins traits horizontaux plutôt que des ronds — bullet Swiper personnalisé
  (`renderBullet`), `bg-white/30` inactif → `bg-gold-accent` actif.
- Positionnés en bas à droite de l'image, par-dessus l'overlay (`swiper-pagination` stylée
  en `absolute bottom-4 right-4 z-10`).
- `clickable: true` pour navigation manuelle.

### Accessibilité

- Chaque slide (`<a>`) porte un `aria-label` décrivant le contenu (ex: "Œuvre de la semaine :
  {titre}").
- Les bullets de pagination Swiper héritent de leur comportement accessible par défaut
  (boutons focusables).

## Dépendances

Aucune nouvelle dépendance : `swiper` est déjà utilisé dans `HeroArtistSlider.tsx`. Ajout du
module `EffectFade` (fait partie du package `swiper` déjà installé, import
`swiper/modules` + CSS `swiper/css/effect-fade`).

## Hors périmètre

- `featuredPost` / persona enterprise reste ignoré (persona commentée dans `PROFILES`).
- Le texte du claim/CTA (headline, subheadline, CTA, Calendly) sous le slider n'est pas
  modifié.
- Pas de nouvelle route ni de nouvelle donnée serveur : les données viennent déjà de
  `HomeHeroWrapper.tsx` sans changement.
