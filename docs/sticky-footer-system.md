# Système de Sticky Footer

## Vue d'ensemble

Le système de sticky footer permet d'afficher des messages promotionnels ou informatifs en bas de page de manière dynamique et configurable. Il est entièrement géré via la base de données et peut être paramétré pour s'afficher sur toutes les pages ou sur des pages spécifiques.

## Architecture

### 1. Base de données (Prisma)

La table `StickyFooter` dans le schéma `landingUi` contient :

```prisma
model StickyFooter {
  id                    Int       @id @default(autoincrement())
  activeOnAllPages      Boolean   @default(false)
  activeOnSpecificPages Boolean   @default(false)
  specificPages         String[]
  endValidityDate       DateTime? @db.Date
  title                 String?
  text                  String?
  textButton            String?
  buttonUrl             String?

  @@schema("landingUi")
}
```

### 2. Actions Prisma (`stickyFooterActions.ts`)

- `getActiveStickyFooter(currentPage?)` : Récupère le sticky footer actif
- `getAllStickyFooters()` : Récupère tous les sticky footers (admin)
- `createStickyFooter(data)` : Crée un nouveau sticky footer
- `updateStickyFooter(id, data)` : Met à jour un sticky footer
- `deleteStickyFooter(id)` : Supprime un sticky footer

### 3. Composants React

#### `StickyFooter.tsx`

Composant d'affichage avec :

- **Layout vertical** : Titre, texte, bouton empilés verticalement
- **Bouton de fermeture élégant** : Croix positionnée en haut à droite
- **Animation d'apparition/disparition** : Transitions fluides
- **Gestion du localStorage** : Mémorisation des fermetures utilisateur
- **Design responsive et accessible** : Adaptatif et respectueux des standards
- **Support des liens externes** : Avec icône d'indication

#### `StickyFooterManager.tsx`

Composant wrapper qui :

- Récupère les données depuis la base
- Gère la logique d'affichage conditionnel
- Convertit les pathnames en format de page

#### `StickyFooterAdmin.tsx`

Interface d'administration pour :

- Créer/modifier/supprimer des sticky footers
- Configurer les pages cibles
- Gérer les dates de validité

## Utilisation

### 1. Configuration automatique

Le sticky footer s'affiche automatiquement dans le layout principal (`layout.tsx`) via le composant `StickyFooterManager`.

### 2. Logique d'affichage

1. **Priorité globale** : Si `activeOnAllPages = true`, le sticky footer s'affiche sur toutes les pages
2. **Pages spécifiques** : Si `activeOnSpecificPages = true`, vérifie si la page actuelle est dans `specificPages`
3. **Date de validité** : Vérifie que `endValidityDate` n'est pas dépassée
4. **Contenu** : Vérifie qu'au moins `title` ou `text` est présent

### 3. Mapping des pages

Le système convertit automatiquement les pathnames en valeurs de l'enum `LandingPage` :

```typescript
const pathMapping = {
  "/": "root",
  "/artists": "artists",
  "/marketplace": "marketplace",
  // ... etc
};
```

### 4. Persistance des fermetures

Les utilisateurs peuvent fermer un sticky footer. Cette action est mémorisée dans le localStorage pour éviter de le réafficher.

## Configuration

### Créer un sticky footer

```typescript
// Via l'interface d'administration ou directement en base
const stickyFooter = await createStickyFooter({
  activeOnAllPages: true,
  activeOnSpecificPages: false,
  specificPages: [],
  endValidityDate: new Date("2024-12-31"),
  title: "Nouvelle fonctionnalité !",
  text: "Découvrez notre nouvelle fonctionnalité de trading.",
  textButton: "En savoir plus",
  buttonUrl: "https://inrealart.com/features",
});
```

### Sticky footer pour pages spécifiques

```typescript
const stickyFooter = await createStickyFooter({
  activeOnAllPages: false,
  activeOnSpecificPages: true,
  specificPages: ["artists", "marketplace"],
  endValidityDate: null,
  title: "Promotion spéciale",
  text: "Profitez de 20% de réduction sur les œuvres d'art !",
  textButton: "Voir les œuvres",
  buttonUrl: "/marketplace",
});
```

## Personnalisation

### Styles CSS

Le composant utilise des classes Tailwind CSS personnalisables :

```css
/* Couleurs par défaut */
.bg-gradient-to-r.from-purple-600.to-blue-600

/* Animation */
.transform.transition-all.duration-300.ease-in-out

/* Layout vertical */
.flex.flex-col.items-center.text-center.space-y-4

/* Titre */
.text-xl.font-bold.leading-tight

/* Texte */
.text-base.opacity-90.leading-relaxed.max-w-2xl

/* Bouton d'action */
.bg-white.text-purple-600.hover:bg-gray-100.hover:scale-105

/* Bouton de fermeture */
.absolute.top-0.right-0.p-2.rounded-full
```

### Comportement

- **Délai d'apparition** : 1 seconde après le chargement
- **Animation** : Slide up depuis le bas
- **Fermeture** : Animation de slide down
- **Responsive** : S'adapte aux écrans mobiles

## Bonnes pratiques

### 1. Contenu

- Gardez les titres courts et percutants
- Le texte doit être concis (2-3 lignes max)
- Utilisez des call-to-action clairs

### 2. Ciblage

- Privilégiez les pages spécifiques plutôt que "toutes les pages"
- Testez sur différentes pages avant déploiement
- Utilisez les dates de validité pour les promotions temporaires

### 3. Performance

- Le système utilise des Server Components pour le chargement initial
- Les données sont mises en cache par Next.js
- Le localStorage évite les re-affichages inutiles

### 4. Accessibilité

- Bouton de fermeture avec `aria-label`
- Support du focus clavier
- Contraste de couleurs respecté

## Dépannage

### Le sticky footer ne s'affiche pas

1. Vérifiez que `activeOnAllPages` ou `activeOnSpecificPages` est `true`
2. Vérifiez la date de validité
3. Vérifiez que la page actuelle est dans `specificPages`
4. Vérifiez qu'au moins `title` ou `text` est renseigné

### Problèmes de performance

1. Vérifiez que Prisma est correctement configuré
2. Surveillez les logs de la base de données
3. Utilisez le cache Next.js pour les données statiques

### Styles cassés

1. Vérifiez que Tailwind CSS est correctement configuré
2. Vérifiez les classes CSS personnalisées
3. Testez sur différents navigateurs
