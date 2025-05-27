# Système de Gestion des Posts SEO

Ce document explique le nouveau système de gestion des posts SEO qui remplace les données statiques par des données dynamiques provenant de la base de données.

## Architecture

### Store Zustand (`useSeoPostStore`)

Le store principal gère deux types de posts :

- **Featured Post** : Le post épinglé (pinned) affiché en vedette
- **Published Posts** : Tous les posts avec le statut `PUBLISHED`

#### Fonctionnalités principales :

- ✅ Gestion du cache intelligent par langue
- ✅ Pagination avec "Load More"
- ✅ Exclusion automatique du post épinglé
- ✅ Gestion des états de chargement et d'erreur
- ✅ Refresh et retry automatiques

### Actions Server (`seoPostActions`)

#### `getFeaturedPost(languageId: number)`

Récupère le post épinglé pour une langue donnée.

#### `getPublishedPosts(languageId, limit, offset, excludeIds)`

Récupère les posts publiés avec pagination et possibilité d'exclusion.

#### `getLanguageIdByCode(languageCode: string)`

Convertit un code de langue en ID de base de données.

### Hooks Personnalisés (`useSeoPostsData`)

#### `useSeoPostsData(options)`

Hook générique pour gérer les posts SEO avec options configurables :

```typescript
const {
  posts, // Posts SEO bruts
  blogPosts, // Posts convertis en format BlogPost
  isLoading, // État de chargement
  error, // Erreur éventuelle
  hasMore, // Y a-t-il plus de posts ?
  loadMore, // Fonction pour charger plus
  retry, // Fonction pour réessayer
  refresh, // Fonction pour rafraîchir
} = useSeoPostsData({
  excludeFeatured: true, // Exclure le post épinglé
  autoFetch: true, // Fetch automatique
  limit: 6, // Nombre de posts par page
});
```

#### `useOtherPosts()`

Hook spécialisé pour les "autres posts" (excluant le featured).

#### `useAllPublishedPosts()`

Hook spécialisé pour tous les posts publiés.

### Utilitaires (`seoPostUtils`)

#### `seoPostToBlogPost(seoPost: SeoPost): BlogPost`

Convertit un SeoPost en BlogPost pour la compatibilité avec les composants existants.

#### `seoPostsToBlogPosts(seoPosts: SeoPost[]): BlogPost[]`

Convertit un tableau de SeoPost en BlogPost.

#### `filterPostsByTags(posts, tags)` et `searchPosts(posts, query)`

Fonctions utilitaires pour filtrer et rechercher dans les posts.

## Composants

### `SeoPostsList`

Composant générique et réutilisable pour afficher une liste de posts SEO :

```tsx
<SeoPostsList
  title="Mes Posts 🔥"
  excludeFeatured={true}
  limit={6}
  showLoadMore={true}
  className="pb-20"
/>
```

### `OthersPosts`

Composant simplifié qui utilise `SeoPostsList` avec des paramètres prédéfinis.

## Optimisation SEO

### Métadonnées dynamiques

Le système génère automatiquement les métadonnées SEO côté serveur via `generateMetadata()` dans `src/app/blog/[id]/page.tsx` :

- **Title** : `{post.title} | In Real Art`
- **Description** : `post.metaDescription`
- **Keywords** : `post.metaKeywords`
- **Open Graph** : Titre, description, image, dates de publication
- **Twitter Cards** : Optimisées pour le partage social
- **URL Canonique** : Générée automatiquement

### Données structurées JSON-LD

Le champ `jsonLd` de la table `SeoPost` permet de stocker des données structurées personnalisées. Voici des exemples optimaux :

#### Exemple pour un article de blog :

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Pourquoi opter pour le leasing d'œuvres d'art en entreprise ?",
  "description": "Découvrez les avantages du leasing d'art pour les entreprises : flexibilité, optimisation fiscale et amélioration de l'image de marque.",
  "image": [
    "https://firebasestorage.googleapis.com/v0/b/inrealartlanding-3a094.appspot.com/o/blog%2Fleasing-entreprise%2FWhite%20Minimalist%20Art%20Exhibition%20Event%20Instagram%20Post.jpg?alt=media&token=eeec92bd-7a2d-4f14-b409-7fda919fded5"
  ],
  "datePublished": "2025-01-26T10:00:00Z",
  "dateModified": "2025-01-26T15:30:00Z",
  "author": {
    "@type": "Person",
    "name": "Elodie Crespel",
    "url": "https://inrealart.com/team/elodie-crespel"
  },
  "publisher": {
    "@type": "Organization",
    "name": "In Real Art",
    "logo": {
      "@type": "ImageObject",
      "url": "https://inrealart.com/icons/Logo.png",
      "width": 101,
      "height": 32
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://inrealart.com/blog/leasing-entreprise"
  },
  "articleSection": "Business",
  "keywords": "leasing, art, entreprise, défiscalisation, optimisation fiscale",
  "wordCount": 850,
  "timeRequired": "PT3M",
  "inLanguage": "fr-FR",
  "about": [
    {
      "@type": "Thing",
      "name": "Leasing d'art",
      "description": "Solution de financement pour l'acquisition d'œuvres d'art en entreprise"
    },
    {
      "@type": "Thing",
      "name": "Défiscalisation",
      "description": "Avantages fiscaux liés à l'acquisition d'œuvres d'art"
    }
  ]
}
```

#### Exemple pour un article sur un artiste :

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Découvrez l'univers artistique de Marc Pfelzer",
  "description": "Plongez dans l'œuvre de Marc Pfelzer, artiste contemporain reconnu pour ses créations uniques.",
  "image": ["https://example.com/marc-pfelzer-artwork.jpg"],
  "datePublished": "2025-01-26T10:00:00Z",
  "dateModified": "2025-01-26T15:30:00Z",
  "author": {
    "@type": "Person",
    "name": "Équipe In Real Art"
  },
  "publisher": {
    "@type": "Organization",
    "name": "In Real Art",
    "logo": {
      "@type": "ImageObject",
      "url": "https://inrealart.com/icons/Logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://inrealart.com/blog/marc-pfelzer-artiste"
  },
  "about": {
    "@type": "Person",
    "@id": "https://inrealart.com/artists/marc-pfelzer",
    "name": "Marc Pfelzer",
    "jobTitle": "Artiste contemporain",
    "description": "Artiste français spécialisé dans l'art contemporain",
    "url": "https://inrealart.com/artists/marc-pfelzer"
  },
  "mentions": [
    {
      "@type": "CreativeWork",
      "name": "Collection Marc Pfelzer",
      "url": "https://inrealart.com/marketplace?artist=marc-pfelzer"
    }
  ]
}
```

### Breadcrumb avec données structurées

Le système génère automatiquement un breadcrumb avec JSON-LD :

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Accueil",
      "item": "https://inrealart.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://inrealart.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Titre de l'article"
    }
  ]
}
```

### Bonnes pratiques SEO

1. **Remplir le champ `jsonLd`** avec des données structurées appropriées
2. **Optimiser `metaDescription`** (150-160 caractères)
3. **Utiliser `metaKeywords`** pertinents (5-10 mots-clés)
4. **Ajouter `mainImageAlt`** pour l'accessibilité
5. **Définir `estimatedReadTime`** pour l'UX
6. **Utiliser des `listTags`** cohérents

## Utilisation

### Afficher les autres posts (excluant le featured)

```tsx
import { useOtherPosts } from "@/hooks/useSeoPostsData";

function MyComponent() {
  const { blogPosts, isLoading, loadMore, hasMore } = useOtherPosts();

  return (
    <div>
      {blogPosts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
      {hasMore && <button onClick={loadMore}>Load More</button>}
    </div>
  );
}
```

### Afficher tous les posts publiés

```tsx
import { useAllPublishedPosts } from "@/hooks/useSeoPostsData";

function AllPostsPage() {
  const { blogPosts, isLoading } = useAllPublishedPosts();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {blogPosts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### Utilisation avancée avec options personnalisées

```tsx
import { useSeoPostsData } from "@/hooks/useSeoPostsData";

function CustomPostsList() {
  const { posts, isLoading, error, hasMore, loadMore, retry } = useSeoPostsData(
    {
      excludeFeatured: false, // Inclure le post épinglé
      autoFetch: true,
      limit: 12,
    }
  );

  if (error) {
    return (
      <div>
        <p>Erreur: {error}</p>
        <button onClick={retry}>Réessayer</button>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
        </div>
      ))}
      {hasMore && (
        <button onClick={loadMore} disabled={isLoading}>
          {isLoading ? "Chargement..." : "Charger plus"}
        </button>
      )}
    </div>
  );
}
```

## Avantages

1. **Performance** : Cache intelligent et pagination
2. **Réutilisabilité** : Composants et hooks génériques
3. **Maintenabilité** : Code propre et bien structuré
4. **UX** : États de chargement, erreurs et retry
5. **Flexibilité** : Options configurables pour différents cas d'usage
6. **Type Safety** : TypeScript complet
7. **Compatibilité** : Conversion automatique vers les types existants

## Migration

L'ancien système avec des données statiques a été remplacé par ce nouveau système dynamique. Les composants existants comme `BlogPostCard` continuent de fonctionner grâce à la conversion automatique des types.

## Prochaines étapes

- [ ] Ajouter la recherche et le filtrage par tags
- [ ] Implémenter le cache avec persistance locale
- [ ] Ajouter des métriques de performance
- [ ] Optimiser les requêtes avec des index de base de données
