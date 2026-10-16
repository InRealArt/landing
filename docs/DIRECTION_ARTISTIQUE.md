# Direction artistique — In Real Art

> Charte graphique et règles CSS du site inrealart.com, rédigée pour être réutilisée
> sur un nouveau site (par un développeur ou fournie telle quelle à une IA).
> Source de vérité : `src/app/globals.css`, `tailwind.config.ts`, `src/config/fonts.ts`
> et les composants récents (Header, heros Home/Agence). État au 11/10/2026.
> Remplace `design-system-DA-report.md` (juillet 2026), dont certaines valeurs sont périmées.

---

## 0. L'esprit en une phrase

**Une galerie d'art contemporain haut de gamme, sur papier blanc ou mur noir.**
Beaucoup de vide, des titres serif fins en italique, des petites capitales très espacées,
des filets de 1 px, un seul accent : l'**or doux `#b89c72`**. Rien de criard, pas d'ombres
lourdes, pas de dégradés colorés, très peu d'arrondis. Le mouvement est lent et fluide
(courbes « expo out »), jamais rebondissant.

**À faire** : contraste noir/blanc, typo qui porte la hiérarchie, or utilisé avec parcimonie
(un mot de titre, un filet, un état hover/actif).
**À éviter** : couleurs saturées, boutons arrondis « SaaS », icônes partout, gras épais,
cartes à ombres portées, texte centré sur de longs paragraphes.

---

## 1. Couleurs

### 1.1 Palette de marque

| Rôle | Valeur | Usage |
|---|---|---|
| Noir charbon | `#131313` | Fond du thème sombre |
| Noir premium | `#0f0f0f` | Sections noires forcées même en thème clair |
| Carte sombre | `#1d1c1c` | Fonds de cartes en sombre |
| Blanc toile | `#ffffff` | Fond du thème clair (thème **par défaut**) |
| Encre | `#000000` / `#ffffff` | Texte & bordures fortes (s'inverse selon le thème) |
| **Or doux** | **`#b89c72`** | **Accent unique** : mot-clé de titre, filet actif, hover |
| Reflet or | `#f1dfb8` | Brillance ponctuelle sur l'or (SVG, effets) |
| Gris doux | `#f8f8f8` / `#1f1f1f` | Fonds de blocs (clair / sombre) |
| Filet clair | `#eeeeee` / `#2a2a2a` | Bordures (clair / sombre) |
| Violet tech | `#6052ff` | Héritage « blockchain » — à réserver aux pages techniques, **pas** dans la DA galerie |

### 1.2 Tokens CSS (à copier tels quels)

Le thème est piloté par l'attribut `data-theme` sur `<html>` (défaut : `light`).

```css
:root {
  --background: #131313;
  --background-rgb: 19 19 19;
  --card: #1d1c1c;
  --text: #ffffff;
  --purple: #6052ff;
  --header-height: 90px;
  --footer-height: 300px;

  --canvas-bg: #ffffff;
  --gold-accent: #b89c72;
  --ink-black: #000000;
  --soft-gray: #f8f8f8;
  --border-light: #eeeeee;
}

[data-theme='light'] {
  --background: #ffffff;
  --background-rgb: 255 255 255;
  --text: #000000;
  --card: #fbfbfb;
  --gradient-start: rgba(255, 255, 255, 0.9);
  --gradient-end: rgba(255, 255, 255, 0);
  --border-color: #eeeeee;
  --stroke-color: rgba(0, 0, 0, 0.3);
  --shadow-color: rgba(0, 0, 0, 0.08);
  --gray-text: #000000;        /* ⚠ voir note ci-dessous */
  --background-grey: #fbfbfb;
  --canvas-bg: #ffffff;
  --gold-accent: #b89c72;
  --ink-black: #000000;
  --soft-gray: #f8f8f8;
  --border-light: #eeeeee;
}

[data-theme='dark'] {
  --background: #131313;
  --background-rgb: 19 19 19;
  --text: #ffffff;
  --card: #1d1c1c;
  --gradient-start: rgba(0, 0, 0, 0.9);
  --gradient-end: rgba(255, 255, 255, 0);
  --border-color: rgba(255, 255, 255, 0.1);
  --stroke-color: rgba(255, 255, 255, 0.3);
  --shadow-color: rgba(255, 255, 255, 0.08);
  --gray-text: #9ca3af;
  --background-grey: #1a1a1a;
  --canvas-bg: #131313;
  --soft-gray: #1f1f1f;
  --border-light: #2a2a2a;
  --ink-black: #ffffff;        /* l'encre s'inverse en sombre */
}
```

> **Note `--gray-text` en clair** : sur le site actuel il vaut `#000000` (choix de lisibilité
> récent). Le texte secondaire est en pratique obtenu par **opacité** :
> `text-textColor/60`, `text-black/70`, `text-white/50`. Pour un nouveau site, on peut
> remettre `#666666` si l'on veut un vrai gris.

### 1.3 Nuances dérivées (technique utilisée dans les composants récents)

Plutôt que multiplier les tokens, on dérive avec `color-mix` :

```css
--muted:     color-mix(in srgb, var(--text) 62%, transparent);  /* texte secondaire */
--line:      color-mix(in srgb, var(--text) 20%, transparent);  /* filets */
--gilt-soft: color-mix(in srgb, var(--gold-accent) 48%, transparent);
--gilt-wash: color-mix(in srgb, var(--gold-accent) 8%, transparent); /* fond hover */
```

### 1.4 Section « noir premium »

Une section peut rester noire même en thème clair (rupture de rythme, CTA, témoignages) :

```css
.section-dark-premium { background-color: #0f0f0f; color: #fff; }
[data-theme='dark'] .section-dark-premium { background-color: var(--background); color: var(--text); }

.section-dark-premium .section-dark-muted  { color: rgba(255,255,255,.5); }
.section-dark-premium .section-dark-card   { background: rgba(255,255,255,.05); border-color: rgba(255,255,255,.08); }
.section-dark-premium .section-dark-border { border-color: rgba(255,255,255,.1); }
.section-dark-premium .btn-cta             { border-color: rgba(255,255,255,.7); color: #fff; }
.section-dark-premium .btn-cta:hover       { background: #fff; color: #0f0f0f; }
```

---

## 2. Typographie

### 2.1 Polices (Google Fonts, chargées via `next/font`, `display: swap`)

| Rôle | Police | Variable | Poids / style |
|---|---|---|---|
| **Titres** (h1–h6, logo, chiffres décoratifs) | **Cormorant Garamond** | `--font-cormorant` | **300**, très souvent *italic* ; 300–700 dispo |
| **Texte courant & UI** (p, span, boutons, labels) | **Montserrat** | `--font-montserrat` | **300** par défaut ; 600 pour les petits labels |
| Display technique (badges, bouton pill du header) | Unbounded | `--font-unbounded` | 600, en très petit |
| Secondaire (héritage, simulateurs) | Bricolage Grotesque | `--font-bricolage` | rare, à ne pas reprendre |

Pour un nouveau site, **Cormorant Garamond + Montserrat suffisent** ; Unbounded en option
pour un seul élément de type badge.

```ts
// fonts.ts (Next.js)
import { Cormorant_Garamond, Montserrat } from 'next/font/google'

export const cormorant = Cormorant_Garamond({
  subsets: ['latin'], display: 'swap', variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'], style: ['normal', 'italic'],
})
export const montserrat = Montserrat({
  subsets: ['latin'], display: 'swap', variable: '--font-montserrat',
  weight: ['200', '300', '400', '500', '600', '700'],
})
```

Hors Next.js :
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=Montserrat:wght@200..700&display=swap" rel="stylesheet">
```

### 2.2 Règles de base

```css
html {
  font-size: 20px;            /* base rem du site (≈ +14 % vs 17.5px historique) */
  scroll-behavior: smooth;
  overflow-x: hidden;
}
body {
  color: var(--text);
  background: var(--background);
  font-family: var(--font-montserrat), Arial, Helvetica, sans-serif;
  margin: 0;
}
p, span {
  font-family: var(--font-montserrat), sans-serif;
  font-weight: 300;
}
h1, h2, h3, h4, h5, h6, .serif {
  font-family: var(--font-cormorant), Georgia, serif;
  font-weight: 300;
}
```

> La racine à **20px** fait que tout `rem` est grand : `text-xs` ≈ 15px, `text-sm` ≈ 17.5px.
> Si le nouveau site garde une racine à 16px, multiplier les tailles ci-dessous par 1,25.

### 2.3 Échelle et patterns typographiques

| Élément | Recette (Tailwind) | Notes |
|---|---|---|
| **Titre hero** | `serif italic text-4xl sm:text-6xl md:text-8xl leading-tight` | jusqu'à `lg:text-[8rem] leading-none` ; possible `tracking-[-0.015em] leading-[0.98]` |
| Titre avec accent | 1re ligne `serif` droite + 2e ligne `<em class="italic text-gold-accent">` | **signature du site** : un seul mot/ligne en or italique |
| Titre de section (h2) | `serif italic text-3xl md:text-5xl leading-tight` | |
| Titre de carte (h3) | `serif italic text-xl` à `text-2xl` | |
| **Eyebrow / sur-titre** | `.section-number` | 0.6rem, 600, uppercase, `letter-spacing: .5em` |
| Lede / chapô | `montserrat text-[0.95rem] sm:text-base leading-relaxed text-textColor/60 max-w-[48ch]` | un mot important en `text-textColor` |
| Sous-titre en capitales | `text-sm uppercase tracking-[0.3em] leading-relaxed text-black/70` | très fréquent sous les titres hero |
| Label / méta / tag | `text-xs uppercase tracking-[0.2em–0.35em]` | |
| Micro-label | `text-[0.6rem]`–`text-[8px] uppercase tracking-[0.3em]` | |
| Navigation | `text-sm uppercase tracking-[0.25em]` | actif/hover → or |
| Logo | `serif font-light uppercase tracking-[0.4em] text-xl` | `tracking-[0.15em]` sur mobile |
| Chiffre décoratif | `.step-number` : Cormorant 3rem, or, opacité .5 | étapes, processus |

**Letter-spacing** : la DA vit de ses capitales espacées. Valeurs utilisées, par fréquence :
`0.3em` › `0.2em` › `0.25em` › `0.4em` › `0.35em` › `0.15em` › `0.5em`.
Règle : plus le texte est petit, plus il est espacé.

```css
.section-number {
  display: block;
  margin-bottom: 1.5rem;
  font-family: var(--font-montserrat), sans-serif;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: #aaa;
}
[data-theme='light'] .section-number { color: #000; }

.step-number {
  display: block;
  margin-bottom: 1rem;
  font-family: var(--font-cormorant), serif;
  font-size: 3rem;
  line-height: 1;
  color: var(--gold-accent);
  opacity: 0.5;
}
```

### 2.4 Typo éditoriale (articles)

```css
.article { font-family: var(--font-montserrat); font-weight: 300; font-size: .875rem; line-height: 1.8; color: var(--ink-black); }
.article h1 { font-family: var(--font-cormorant); font-weight: 300; font-style: italic; font-size: 3rem; line-height: 1.1; margin-bottom: 2rem; }
.article h2 { font-family: var(--font-cormorant); font-weight: 300; font-style: italic; font-size: 1.75rem;
              border-bottom: 1px solid var(--border-light); padding-bottom: .75rem; margin-top: 3rem; }
.article h3 { font-family: var(--font-cormorant); font-weight: 300; font-style: italic; font-size: 1.3rem; }
.article blockquote { border-left: 2px solid var(--gold-accent); padding: 1rem 1.5rem; margin: 2rem 0;
                      font-family: var(--font-cormorant); font-style: italic; font-size: 1.3rem; background: var(--soft-gray); }
.article .intro { font-size: 1rem; line-height: 1.9; border-left: 2px solid var(--gold-accent); padding-left: 1.5rem; }
.article figcaption { font-style: italic; font-size: .7rem; letter-spacing: .2em; text-transform: uppercase;
                      color: var(--gray-text); border-top: 1px solid var(--border-light); padding: .75rem 1rem; }
.article .meta { font-size: .65rem; letter-spacing: .3em; text-transform: uppercase; color: var(--gray-text); }
.article a { color: var(--ink-black); text-decoration: none; border-bottom: 1px solid var(--border-light); transition: border-color .3s; }
.article a:hover { border-bottom-color: var(--gold-accent); }
```

---

## 3. Mise en page & espacements

| Élément | Valeur |
|---|---|
| Conteneur principal | `max-w-screen-2xl` (1536px) `mx-auto` |
| Conteneur de lecture | `max-w-screen-xl`, textes `max-w-xl` → `max-w-3xl`, ou `max-w-[48ch]` |
| Images pleine largeur | max 1440px |
| Gouttières horizontales | `px-5 sm:px-8 lg:px-10` (ou `px-3 sm:px-6 lg:px-10` pour le header) |
| Rythme vertical des sections | `py-20` / `py-24` mobile → `lg:py-32` (généreux) |
| Espace eyebrow → titre | 1.5rem ; titre → texte : `mb-6` à `mb-8` ; texte → CTA : `mt-12` |
| Header | fixe, 64px mobile / **90px** desktop ; contenu décalé de `calc(90px + 2rem)` |
| Grilles | 2 col mobile, 3–4 col desktop ; hero en `grid-cols-[1.05fr_1fr] gap-x-16` |
| Séparateurs | filets 1px `border-borderColor` (haut/bas), jamais de traits épais |

**Arrondis** : la DA est **carrée**. Boutons CTA, cartes œuvres, blocs : `border-radius: 0`.
Exceptions : tags/badges et pastilles en `rounded-full` ; bouton « pill » du header en `rounded-lg`.

**Ombres** : quasi inexistantes. Seule autorisée : `0 20px 40px rgba(0,0,0,.03)` au survol d'un bloc.

---

## 4. Composants

### 4.1 Boutons

Trois boutons, tous en Montserrat capitales espacées, **sans arrondi**.

```css
/* 1. CTA principal : contour → plein au survol */
.btn-cta {
  display: inline-flex; align-items: center; justify-content: center; text-align: center;
  margin-top: 1.5rem;
  padding: .9rem 1.8rem;
  border: 1px solid var(--ink-black);
  background: transparent;
  font-family: var(--font-montserrat), sans-serif;
  font-size: .6rem;
  letter-spacing: .25em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all .5s cubic-bezier(0.19, 1, 0.22, 1);
}
.btn-cta:hover { background: var(--ink-black); color: var(--background); }

/* 2. Action : plein encre → or au survol */
.btn-action {
  display: inline-block; text-align: center;
  padding: 1rem 2rem;
  background: var(--ink-black);
  color: var(--canvas-bg);
  font-family: var(--font-montserrat), sans-serif;
  font-size: .7rem;
  letter-spacing: .2em;
  text-transform: uppercase;
  transition: background .3s ease;
}
.btn-action:hover { background: var(--gold-accent); }

/* 3. Lien « magazine » : souligné → or au survol */
.btn-mag {
  display: inline-block;
  border-bottom: 1.5px solid var(--ink-black);
  font-family: var(--font-montserrat), sans-serif;
  font-size: .7rem; font-weight: 600;
  letter-spacing: .15em;
  text-transform: uppercase;
  transition: color .3s ease, border-color .3s ease;
}
.btn-mag:hover { color: var(--gold-accent); border-color: var(--gold-accent); }
```

Variante formulaire (envoi) : `px-12 py-5 bg-textColor text-backgroundColor text-[0.65rem] uppercase tracking-[0.3em] hover:opacity-80`.
Bouton secondaire discret : contour filet `--line`, hover → bordure or + fond `--gilt-wash`.

### 4.2 Header

- Fixe, `bg-backgroundColor/95 backdrop-blur-md border-b border-borderColor`, `z-50`.
- Logo à gauche (serif, capitales, `tracking-[0.4em]`), nav au centre, actions à droite.
- Liens : `text-sm uppercase tracking-[0.25em]`, hover/actif = `text-gold-accent`,
  avec un **filet or de 1px** sous le lien actif (`absolute bottom-0 h-px bg-gold-accent`, largeur animée 300ms).
- Bouton « pill » : `bg-textColor text-backgroundColor hover:bg-gold-accent hover:text-white
  text-xs font-unbounded font-semibold uppercase tracking-wider px-3 py-2 rounded-lg`.
- Menu burger sous `xl`, cible tactile ≥ 44×44px.

### 4.3 Cartes œuvres / images

```css
.artwork-image { background: #f9f9f9; border: 1px solid var(--border-light); overflow: hidden; }
.artwork-image img { width: 100%; height: 100%; object-fit: cover;
                     transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1); }
.artwork-container { transition: opacity .4s ease; }
.artwork-container:hover { opacity: .9; }
.artwork-container:hover .artwork-image img { transform: scale(1.03); }
```
Légende sous l'image : nom en `serif italic text-xl`, détails en micro-capitales espacées.

### 4.4 Portraits

Noir & blanc par défaut, couleur + léger zoom au survol :
```css
.member-image { filter: grayscale(100%); transition: transform 1s cubic-bezier(0.16,1,0.3,1), filter .6s; }
.member-card:hover .member-image { filter: grayscale(0); transform: scale(1.08); }
```

### 4.5 Blocs « avantage » / étapes

```css
.advantage-box { padding: 3rem; background: var(--soft-gray); border-top: 1px solid var(--border-light); transition: all .5s ease; }
.advantage-box:hover { background: #fff; box-shadow: 0 20px 40px rgba(0,0,0,.03); border-top-color: var(--gold-accent); }
[data-theme='dark'] .advantage-box:hover { background: var(--background); box-shadow: 0 20px 40px rgba(0,0,0,.3); }
```
Combiner avec `.step-number` (01, 02, 03 en Cormorant or à 50 %).

### 4.6 Tags, listes, liens de pied de page

```css
.tag-badge { display: inline-block; padding: .25rem 1rem; border: 1px solid var(--border-color);
             border-radius: 9999px; font-size: .875rem; color: var(--text); background: transparent; }

.footer-link { display: block; margin-bottom: .6rem; font-size: .8rem; color: var(--gray-text);
               transition: color .3s, transform .3s; }
.footer-link:hover { color: var(--ink-black); transform: translateX(5px); }

.artist-list-item { display: block; margin-bottom: .4rem; font-size: .75rem; letter-spacing: .03em; color: var(--gray-text); }
.artist-list-item:hover { color: var(--gold-accent); }
```

### 4.7 Formulaires

- Champs « soulignés » de préférence : seulement `border-bottom` 1px (`--line`), fond transparent,
  focus → bordure `--ink-black` ou or (`focus:border-gold-accent`).
- Champs encadrés : `border: 1px solid var(--border-light)`, fond `--canvas-bg`, `padding: .75rem 1rem`,
  Montserrat .875rem, **pas** de `box-shadow` ni de ring coloré au focus — juste la bordure qui fonce.
- Placeholder : `var(--gray-text)` (ou `rgba(255,255,255,.35)` en section noire).

### 4.8 Défilement horizontal & marquee

- Fondu des bords de carrousel : pseudo-éléments à 10 % de largeur,
  `linear-gradient(90deg, var(--gradient-start), var(--gradient-end))`.
- Logos partenaires en marquee : `animation: marquee 18s linear infinite` (translateX 0 → -50 %, contenu dupliqué).
- Rangées scrollables mobile : classe `.no-scrollbar` (scrollbar masquée).

---

## 5. Mouvement

### 5.1 Courbes signatures

| Nom | Courbe | Usage |
|---|---|---|
| **Expo out** | `cubic-bezier(0.19, 1, 0.22, 1)` | boutons, grands mouvements d'UI (0.5s) |
| **Zoom doux** | `cubic-bezier(0.16, 1, 0.3, 1)` | zoom d'images (1–2s) |
| GSAP | `power3.out` (le plus utilisé), `power2.out`, `expo.out` | entrées, timelines |
| Simple | `0.3s ease` | couleurs, bordures |

Durées : **lentes**. Couleurs 300ms, boutons 500ms, images 1.2–2s, entrées 0.8–0.9s.

### 5.2 Animations d'entrée (Tailwind)

```js
keyframes: {
  'fade-up':    { from: { opacity: 0, transform: 'translateY(40px)' }, to: { opacity: 1, transform: 'none' } },
  'fade-right': { from: { opacity: 0, transform: 'translateX(40px)' }, to: { opacity: 1, transform: 'none' } },
  'hairline-progress': { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } },
  'aura-breathe': { '0%,100%': { transform: 'scale(1)', opacity: .85 }, '50%': { transform: 'scale(1.08)', opacity: 1 } },
  marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
},
animation: {
  'fade-up':       'fade-up .8s ease-out .2s both',
  'fade-up-delay': 'fade-up .8s ease-out .38s both',
  'fade-right':    'fade-right .9s ease-out .38s both',
  'aura-breathe':  'aura-breathe 9s ease-in-out infinite',
  marquee:         'marquee 18s linear infinite',
}
```
Ordre classique d'un hero : eyebrow + titre (`fade-up`) → sous-titre + CTA (`fade-up-delay`) → visuel (`fade-right`).

### 5.3 Effets « premium » des heros récents (GSAP 3)

- Titre découpé ligne par ligne (SplitText) qui monte depuis un masque.
- Compteurs chiffrés animés, **filet de progression** horizontal (`hairline-progress`) pour les carrousels.
- **Aura** : halo flou or très léger qui « respire » derrière le visuel (9s).
- Léger parallax / tilt 3D sur les visuels, CTA « magnétique » au survol.
- Révélation par masque : `clip-path: inset(0 0 100% 0)` → `inset(0)`.

### 5.4 Obligatoire : mouvement réduit

Tout effet décoratif est coupé si `prefers-reduced-motion: reduce` (contenu affiché directement, pas d'autoplay).

---

## 6. Iconographie, images, détails

- Icônes : **lucide-react**, trait fin (`strokeWidth` 1–1.5), petites, monochromes. À utiliser avec parcimonie.
- Photos d'œuvres : sur fond neutre `#f9f9f9`, cadrage `object-cover`, filet 1px autour.
- Pas d'illustrations colorées ; les schémas sont en filets fins + or (cf. hero écosystème de la home).
- Focus clavier : `outline: 2px solid var(--gold-accent); outline-offset: 3px` sur `:focus-visible`.
- Texte détouré décoratif possible : `-webkit-text-stroke: 1px var(--stroke-color)`.
- Scrollbar fine (2px) pour les panneaux scrollables.

---

## 7. Kit de démarrage pour le nouveau site

### 7.1 `tailwind.config.ts` (Tailwind 3)

```ts
import type { Config } from 'tailwindcss'

export default {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        cormorant:  ['var(--font-cormorant)', 'Georgia', 'serif'],
        montserrat: ['var(--font-montserrat)', 'Arial', 'sans-serif'],
      },
      colors: {
        backgroundColor: 'rgb(var(--background-rgb) / <alpha-value>)',
        textColor:       'var(--text)',
        cardBackground:  'var(--card)',
        borderColor:     'var(--border-color)',
        grayText:        'var(--gray-text)',
        'gold-accent':   '#b89c72',
        'soft-gray':     'var(--soft-gray)',
        'border-light':  'var(--border-light)',
        'ink-black':     'var(--ink-black)',
      },
      height:  { headerSize: 'var(--header-height)' },
      spacing: { headerSize: 'calc(var(--header-height) + 2rem)' },
      // + keyframes / animation de la section 5.2
    },
  },
} satisfies Config
```

> **Tailwind v4** : déclarer les mêmes valeurs dans `@theme { --color-gold-accent: #b89c72; --font-cormorant: ...; }`
> et le dark mode par `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`.

### 7.2 Anti-flash du thème (dans `<head>`, avant React)

```html
<script>
  try {
    var t = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) { document.documentElement.setAttribute('data-theme', 'light'); }
</script>
```

### 7.3 Squelette d'une section type

```tsx
<section className="bg-backgroundColor py-24 lg:py-32">
  <div className="max-w-screen-2xl mx-auto px-5 sm:px-8 lg:px-10">
    <span className="section-number">01 — Collection</span>
    <h2 className="serif font-light text-4xl md:text-6xl leading-tight text-textColor mb-8">
      <span className="block">L'art véritable,</span>
      <em className="block italic text-gold-accent">enfin accessible</em>
    </h2>
    <p className="montserrat text-base leading-relaxed text-textColor/60 max-w-[48ch]">
      Un texte court, aéré, en Montserrat léger. <strong className="font-light text-textColor">Un mot clé ressort.</strong>
    </p>
    <a href="#" className="btn-cta mt-12">Découvrir la collection</a>
  </div>
</section>
```

---

## 8. Récapitulatif — les 12 règles

| # | Règle |
|---|---|
| 1 | Thème clair par défaut (`#fff`), thème sombre `#131313`, sections noires `#0f0f0f` pour rythmer |
| 2 | **Un seul accent : or `#b89c72`** (mot de titre, filet actif, hover) |
| 3 | Titres : Cormorant Garamond **300**, souvent *italic* |
| 4 | Texte & UI : Montserrat **300** ; petits labels en 600 |
| 5 | Labels en capitales, `letter-spacing` 0.2–0.5em, taille 0.6–0.75rem |
| 6 | Titre hero = ligne droite + ligne italique or |
| 7 | Aucun arrondi sauf tags (`rounded-full`) ; aucune ombre sauf hover très léger |
| 8 | Filets de 1px pour structurer, jamais de traits épais |
| 9 | CTA en contour qui se remplit au survol (`0.5s cubic-bezier(0.19,1,0.22,1)`) |
| 10 | Images : zoom 1.03–1.08 lent ; portraits N&B → couleur |
| 11 | Beaucoup de vide : sections `py-24`→`py-32`, conteneur 1536px, gouttières `px-5`→`px-10` |
| 12 | Animations lentes et fluides, toujours désactivables (`prefers-reduced-motion`) |
