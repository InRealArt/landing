'use client'

import Image from 'next/image'
import { useImageOptimization } from '@/hooks/useImageOptimization'
import { shouldOptimizeImage, getOptimalQuality, getResponsiveSizes } from '@/config/imageConfig'

interface OptimizedContentImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  isDecorative?: boolean
  onLoad?: () => void
  onError?: () => void
}

const OptimizedContentImage = ({
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
  isDecorative = false,
  onLoad,
  onError,
  ...props
}: OptimizedContentImageProps) => {
  // Utiliser des valeurs par défaut pour éviter l'appel conditionnel du hook
  const defaultWidth = width ?? 0
  const defaultHeight = height ?? 0
  
  const { shouldOptimize, priority: optimizedPriority, unoptimized } = useImageOptimization({
    src,
    width: defaultWidth,
    height: defaultHeight,
    priority,
    isDecorative,
  })

  // Si width et height ne sont pas fournis, utiliser fill pour un affichage naturel
  if (!width || !height) {
    return (
      <div className={`relative w-full h-full ${className}`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          priority={optimizedPriority}
          quality={getOptimalQuality(false, isDecorative, quality)}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          unoptimized={!shouldOptimizeImage(src, 0, 0, false)}
          onLoad={onLoad}
          onError={onError}
          {...props}
        />
      </div>
    )
  }

  // Utiliser notre configuration personnalisée pour les dimensions spécifiées
  const shouldOptimizeCustom = shouldOptimizeImage(src, width, height, false)
  const optimalQuality = getOptimalQuality(false, isDecorative, quality)
  const responsiveSizes = getResponsiveSizes(width, sizes)

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto"
        priority={optimizedPriority}
        sizes={responsiveSizes}
        quality={optimalQuality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        unoptimized={!shouldOptimizeCustom}
        onLoad={onLoad}
        onError={onError}
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
        {...props}
      />
    </div>
  )
}

export default OptimizedContentImage
