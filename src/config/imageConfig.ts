// Configuration des images selon les recommandations Vercel
// https://vercel.com/docs/image-optimization/managing-image-optimization-costs

export const IMAGE_CONFIG = {
    // Formats d'image supportés (réduire le nombre de transformations)
    formats: ['image/webp', 'image/avif'] as const,

    // Qualités d'image (réduire la taille et les coûts)
    qualities: {
        low: 75,      // Images de fond, décoratives
        medium: 85,   // Images de contenu standard
        high: 95,     // Images importantes, portraits
    },

    // Tailles d'image optimisées (réduire les transformations)
    sizes: {
        // Images de petite taille
        small: [16, 32, 48, 64, 96, 128, 256, 384],

        // Tailles d'écran
        device: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],

        // Tailles d'image par défaut
        default: [16, 32, 48, 64, 96, 128, 256, 384],
    },

    // TTL de cache (réduire les transformations)
    cache: {
        // Cache minimum de 31 jours
        minimumTTL: 2678400,

        // Cache pour les images statiques
        static: 31536000, // 1 an

        // Cache pour les images dynamiques
        dynamic: 86400, // 1 jour
    },

    // Règles d'optimisation
    optimization: {
        // Images qui ne doivent PAS être optimisées
        skipOptimization: {
            // Images de moins de 10KB
            minSize: 10000,

            // Formats qui ne bénéficient pas de l'optimisation
            formats: ['.svg', '.gif'],

            // Images de fond petites
            backgroundMinSize: 50000,
        },

        // Priorité des images
        priority: {
            // Images au-dessus de la ligne de flottaison
            aboveFold: true,

            // Images importantes (largeur > 1080px et hauteur > 600px)
            important: {
                minWidth: 1080,
                minHeight: 600,
            },
        },
    },

    // Configuration des tailles responsives
    responsive: {
        // Breakpoints pour les tailles d'image
        breakpoints: {
            mobile: 640,
            tablet: 768,
            laptop: 1024,
            desktop: 1280,
            wide: 1536,
            ultra: 1920,
        },

        // Tailles par défaut basées sur la largeur
        defaultSizes: {
            384: '(max-width: 640px) 100vw, 384px',
            640: '(max-width: 768px) 100vw, 640px',
            750: '(max-width: 1024px) 100vw, 750px',
            828: '(max-width: 1280px) 100vw, 828px',
            1080: '(max-width: 1536px) 100vw, 1080px',
            1920: '(max-width: 1920px) 100vw, 1920px',
        },
    },

    // Configuration des placeholders
    placeholders: {
        // Types de placeholder supportés
        types: ['blur', 'empty'] as const,

        // Qualité du placeholder blur
        blurQuality: 10,

        // Taille du placeholder blur
        blurSize: 8,
    },
}

// Fonction utilitaire pour déterminer si une image doit être optimisée
export const shouldOptimizeImage = (
    src: string,
    width: number,
    height: number,
    isBackground = false
): boolean => {
    const { optimization } = IMAGE_CONFIG

    // Ne pas optimiser les SVG
    if (src.endsWith('.svg')) return false

    // Ne pas optimiser les GIF
    if (src.endsWith('.gif')) return false

    // Ne pas optimiser les images de moins de 10KB
    if (width * height < optimization.skipOptimization.minSize) return false

    // Ne pas optimiser les images de fond petites
    if (isBackground && width * height < optimization.skipOptimization.backgroundMinSize) return false

    return true
}

// Fonction utilitaire pour déterminer la qualité optimale
export const getOptimalQuality = (
    isBackground = false,
    isDecorative = false,
    baseQuality = 85
): number => {
    const { qualities } = IMAGE_CONFIG

    if (isBackground || isDecorative) {
        return Math.min(baseQuality, qualities.low)
    }

    return baseQuality
}

// Fonction utilitaire pour déterminer les tailles responsives
export const getResponsiveSizes = (
    width: number,
    customSizes?: string
): string => {
    if (customSizes) return customSizes

    const { responsive: { defaultSizes } } = IMAGE_CONFIG

    // Trouver la taille appropriée
    const sizes = Object.keys(defaultSizes)
        .map(Number)
        .sort((a, b) => a - b)

    for (const size of sizes) {
        if (width <= size) {
            return defaultSizes[size as keyof typeof defaultSizes]
        }
    }

    // Taille par défaut pour les grandes images
    return defaultSizes[1920]
}
