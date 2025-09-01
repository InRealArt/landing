import { useState, useEffect, useMemo } from 'react'

interface ImageOptimizationConfig {
    src: string
    width: number
    height: number
    priority?: boolean
    isBackground?: boolean
    isDecorative?: boolean
}

interface OptimizedImageConfig {
    shouldOptimize: boolean
    quality: number
    sizes: string | undefined
    priority: boolean
    unoptimized: boolean
}

export const useImageOptimization = ({
    src,
    width,
    height,
    priority = false,
    isBackground = false,
    isDecorative = false,
}: ImageOptimizationConfig): OptimizedImageConfig => {
    const [isLoaded, setIsLoaded] = useState(false)

    // Déterminer si l'image doit être optimisée
    const shouldOptimize = useMemo(() => {
        // Ne pas optimiser les SVG
        if (src.endsWith('.svg')) return false

        // Ne pas optimiser les images de moins de 10KB (approximatif)
        if (width * height < 10000) return false

        // Ne pas optimiser les images animées
        if (src.endsWith('.gif')) return false

        // Ne pas optimiser les images de fond si elles sont petites
        if (isBackground && width * height < 50000) return false

        return true
    }, [src, width, height, isBackground])

    // Déterminer la qualité optimale
    const quality = useMemo(() => {
        if (!shouldOptimize) return 100

        // Qualité réduite pour les images de fond ou décoratives
        if (isBackground || isDecorative) {
            return 75
        }

        // Qualité standard pour les images de contenu
        return 85
    }, [shouldOptimize, isBackground, isDecorative])

    // Déterminer les tailles responsives
    const sizes = useMemo(() => {
        if (!shouldOptimize) return undefined

        // Tailles par défaut basées sur la largeur de l'image
        if (width <= 384) return '(max-width: 640px) 100vw, 384px'
        if (width <= 640) return '(max-width: 768px) 100vw, 640px'
        if (width <= 750) return '(max-width: 1024px) 100vw, 750px'
        if (width <= 828) return '(max-width: 1280px) 100vw, 828px'
        if (width <= 1080) return '(max-width: 1536px) 100vw, 1080px'

        return '(max-width: 1920px) 100vw, 1920px'
    }, [shouldOptimize, width])

    // Déterminer la priorité
    const optimizedPriority = useMemo(() => {
        // Priorité élevée pour les images au-dessus de la ligne de flottaison
        if (priority) return true

        // Priorité pour les images importantes
        if (width > 1080 && height > 600) return true

        return false
    }, [priority, width, height])

    // Déterminer si l'image doit être non optimisée
    const unoptimized = useMemo(() => {
        return !shouldOptimize
    }, [shouldOptimize])

    // Gestion du chargement
    useEffect(() => {
        if (src) {
            setIsLoaded(false)
        }
    }, [src])

    return {
        shouldOptimize,
        quality,
        sizes,
        priority: optimizedPriority,
        unoptimized,
    }
}

// Hook pour la gestion du cache des images
export const useImageCache = (src: string) => {
    const [isCached, setIsCached] = useState(false)

    useEffect(() => {
        if (src) {
            // Vérifier si l'image est en cache
            const img = new Image()
            img.src = src

            if (img.complete) {
                setIsCached(true)
            } else {
                img.onload = () => setIsCached(true)
                img.onerror = () => setIsCached(false)
            }
        }
    }, [src])

    return { isCached }
}

// Hook pour la gestion de la taille des images
export const useImageSize = (src: string) => {
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null)

    useEffect(() => {
        if (src) {
            const img = new Image()
            img.src = src

            img.onload = () => {
                setDimensions({
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                })
            }

            img.onerror = () => {
                setDimensions(null)
            }
        }
    }, [src])

    return dimensions
}
