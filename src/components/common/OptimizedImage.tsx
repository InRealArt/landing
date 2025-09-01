'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  unoptimized?: boolean
}

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  unoptimized = false,
  ...props
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)

  // Déterminer si l'image doit être optimisée
  const shouldOptimize = () => {
    // Ne pas optimiser les SVG
    if (src.endsWith('.svg')) return false
    
    // Ne pas optimiser les images de moins de 10KB (approximatif)
    if (width * height < 10000) return false
    
    // Ne pas optimiser les images animées
    if (src.endsWith('.gif')) return false
    
    return !unoptimized
  }

  // Gestion des erreurs de chargement
  const handleError = () => {
    setIsLoading(false)
    // Fallback vers l'image originale en cas d'erreur
    setImageSrc(src)
  }

  // Gestion du chargement réussi
  const handleLoad = () => {
    setIsLoading(false)
  }

  // Déterminer les tailles responsives appropriées
  const getResponsiveSizes = () => {
    if (sizes) return sizes
    
    // Tailles par défaut basées sur la largeur de l'image
    if (width <= 384) return '(max-width: 640px) 100vw, 384px'
    if (width <= 640) return '(max-width: 768px) 100vw, 640px'
    if (width <= 750) return '(max-width: 1024px) 100vw, 750px'
    if (width <= 828) return '(max-width: 1280px) 100vw, 828px'
    if (width <= 1080) return '(max-width: 1536px) 100vw, 1080px'
    
    return '(max-width: 1920px) 100vw, 1920px'
  }

  // Déterminer la qualité optimale
  const getOptimalQuality = () => {
    // Qualité réduite pour les images de fond ou décoratives
    if (className.includes('bg-') || className.includes('decoration')) {
      return Math.min(quality, 75)
    }
    
    // Qualité standard pour les images de contenu
    return quality
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={priority}
        sizes={getResponsiveSizes()}
        quality={getOptimalQuality()}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        unoptimized={!shouldOptimize()}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
      
      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
    </div>
  )
}

export default OptimizedImage
