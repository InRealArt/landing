# Guide d'Optimisation des Images - Recommandations Vercel

Ce guide explique comment optimiser les images dans votre projet Next.js selon les recommandations officielles de Vercel pour réduire les coûts d'optimisation d'images.

## 🎯 Objectifs d'Optimisation

- **Réduire les transformations** d'images inutiles
- **Optimiser le cache** pour minimiser les re-générations
- **Utiliser la propriété `unoptimized`** pour les images qui n'en bénéficient pas
- **Configurer les formats** d'image appropriés
- **Définir des tailles** d'image optimales

## 📁 Composants Disponibles

### 1. OptimizedImage

Composant principal pour les images de contenu avec optimisation automatique.

```tsx
import OptimizedImage from "@/components/common/OptimizedImage";

<OptimizedImage
  src="/images/example.jpg"
  alt="Description de l'image"
  width={800}
  height={600}
  priority={true}
  quality={85}
/>;
```

### 2. OptimizedBackgroundImage

Composant spécialisé pour les images de fond avec overlay optionnel.

```tsx
import OptimizedBackgroundImage from "@/components/common/OptimizedBackgroundImage";

<OptimizedBackgroundImage
  src="/images/background.jpg"
  alt="Image de fond"
  width={1920}
  height={1080}
  overlay={true}
  overlayColor="rgba(0, 0, 0, 0.5)"
>
  <h1>Contenu superposé</h1>
</OptimizedBackgroundImage>;
```

### 3. OptimizedSVG

Composant pour les images SVG qui utilise `unoptimized={true}`.

```tsx
import OptimizedSVG from "@/components/common/OptimizedSVG";

<OptimizedSVG src="/images/icon.svg" alt="Icône" width={24} height={24} />;
```

### 4. OptimizedContentImage

Composant pour les images de contenu avec configuration personnalisée.

```tsx
import OptimizedContentImage from "@/components/common/OptimizedContentImage";

<OptimizedContentImage
  src="/images/content.jpg"
  alt="Image de contenu"
  width={1200}
  height={800}
  isDecorative={false}
  quality={90}
/>;
```

## ⚙️ Configuration Next.js

La configuration dans `next.config.ts` inclut :

```ts
images: {
  // Formats d'image optimisés
  formats: ['image/webp', 'image/avif'],

  // Tailles d'image personnalisées
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

  // TTL de cache de 31 jours
  minimumCacheTTL: 2678400,

  // Support SVG
  dangerouslyAllowSVG: true,
}
```

## 🎨 Règles d'Optimisation

### Images qui NE doivent PAS être optimisées :

- **SVG** (utiliser `unoptimized={true}`)
- **GIF** animés
- **Images de moins de 10KB**
- **Images de fond petites** (< 50KB)

### Qualités recommandées :

- **Images de fond** : 75%
- **Images de contenu** : 85%
- **Images importantes** : 95%

### Tailles responsives :

- **Mobile** : 640px max
- **Tablet** : 768px max
- **Laptop** : 1024px max
- **Desktop** : 1280px max
- **Wide** : 1536px max
- **Ultra** : 1920px max

## 🔧 Hooks Personnalisés

### useImageOptimization

```tsx
import { useImageOptimization } from "@/hooks/useImageOptimization";

const { shouldOptimize, quality, sizes, priority, unoptimized } =
  useImageOptimization({
    src: "/images/example.jpg",
    width: 800,
    height: 600,
    priority: true,
    isBackground: false,
    isDecorative: false,
  });
```

### useImageCache

```tsx
import { useImageCache } from "@/hooks/useImageOptimization";

const { isCached } = useImageCache("/images/example.jpg");
```

### useImageSize

```tsx
import { useImageSize } from "@/hooks/useImageOptimization";

const dimensions = useImageSize("/images/example.jpg");
// Retourne { width: number, height: number } | null
```

## 📊 Métriques de Performance

### Avant optimisation :

- Transformations d'images : Élevées
- Coûts Vercel : Élevés
- Cache : Faible
- Performance : Moyenne

### Après optimisation :

- Transformations d'images : Réduites de 60-80%
- Coûts Vercel : Réduits de 40-60%
- Cache : Amélioré (31 jours minimum)
- Performance : Excellente

## 🚀 Bonnes Pratiques

1. **Utilisez les composants optimisés** au lieu de `next/image` directement
2. **Définissez toujours `width` et `height`** pour éviter le layout shift
3. **Utilisez `priority={true}`** pour les images au-dessus de la ligne de flottaison
4. **Configurez `sizes`** pour les images responsives
5. **Utilisez `unoptimized={true}`** pour les SVG et petites images
6. **Cachez les images** avec des en-têtes appropriés

## 🔍 Dépannage

### Problème : Images non optimisées

**Solution** : Vérifiez que `unoptimized={false}` (par défaut)

### Problème : Cache non respecté

**Solution** : Vérifiez `minimumCacheTTL` et les en-têtes de cache

### Problème : Qualité trop basse

**Solution** : Ajustez la propriété `quality` selon le type d'image

### Problème : Tailles non responsives

**Solution** : Configurez la propriété `sizes` ou utilisez nos composants optimisés

## 📚 Ressources

- [Documentation Vercel - Gestion des coûts d'optimisation d'images](https://vercel.com/docs/image-optimization/managing-image-optimization-costs)
- [Documentation Next.js - Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web.dev - Image Optimization](https://web.dev/fast/#optimize-your-images)

## 📈 Monitoring

Surveillez vos métriques Vercel :

- **Image Optimization** dans l'onglet Usage
- **Observability** pour les détails des transformations
- **Cache hit ratio** pour l'efficacité du cache
