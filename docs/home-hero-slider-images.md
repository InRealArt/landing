# Images du slider Hero (accueil)

Note technique sur les visuels du slider « Œuvre de la semaine » / « Artiste de la
semaine » affiché en haut de la page d'accueil
(`src/components/home/HomeHeroFeaturedSlider.tsx`).

## Contexte

Les visuels du slider viennent de sources externes : dimensions et qualités
**complètement disparates** (portrait, paysage, carré, petites ou grandes). Un
cadre fixe avec rognage (`object-cover`) n'était donc pas adapté — il coupait les
sujets (visage d'artiste, bord d'œuvre) et laissait des images petites pixellisées.

## Solution en place : double couche « galerie / cinéma »

`FeaturedSlideContent` rend chaque slide en **deux couches** dans un cadre fixe
(`aspect-[4/3]` mobile, `aspect-[16/9]` à partir de `sm`) :

1. **Couche fond** — la même image en `object-cover` (remplit le cadre), floutée
   (`blur-2xl`), assombrie (`brightness-[0.45]`), saturée (`saturate-150`) et
   légèrement zoomée (`scale-110`). Chargée en `quality={40}` et `aria-hidden`
   (décorative). Elle comble élégamment le vide autour de l'image, avec une ambiance
   colorée dérivée de l'image elle-même — au lieu de bandes noires vides.

2. **Couche premier plan** — l'image en `object-contain` : **entière, nette,
   jamais rognée**, quel que soit son ratio ou sa taille. Chargée en `quality={85}`.

Résultat : n'importe quelle source (petite, grande, portrait, paysage, carré)
s'affiche proprement sans rognage ni vide disgracieux.

## Points techniques

- Les deux couches passent par `next/image` (`fill`, `sizes`, format AVIF/WebP,
  `srcset` responsive, cache 31 jours). Le domaine R2 est autorisé dans
  `next.config.ts`.
- Le premier slide reçoit `priority` (LCP).
- Le slider s'étend jusqu'à `max-w-7xl` (1280px) ; `sizes` est plafonné en
  conséquence.

## Recommandation contenu (optionnelle, pour un rendu optimal)

La double couche gère tout, mais pour la **couche nette** un visuel plus grand rend
mieux qu'un tout petit :

- Idéalement **≥ 1280px** sur le grand côté. En dessous, l'image nette reste
  correcte mais peut légèrement manquer de définition sur grand écran.
- Le ratio n'a plus d'importance : portrait, paysage ou carré sont tous gérés
  proprement grâce au fond flou.
