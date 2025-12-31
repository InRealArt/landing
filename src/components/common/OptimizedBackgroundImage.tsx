'use client'

import Image from 'next/image'
import { useImageOptimization } from '@/hooks/useImageOptimization'

interface OptimizedBackgroundImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  contentClassName?: string
  children?: React.ReactNode
  overlay?: boolean
  overlayColor?: string
  overlayOpacity?: number
  priority?: boolean
  fetchPriority?: 'auto' | 'high' | 'low'
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  sizes?: string
}

const OptimizedBackgroundImage = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  contentClassName = '',
  children,
  overlay = false,
  overlayColor = 'rgba(0, 0, 0, 0.3)',
  overlayOpacity = 0.3,
  priority = false,
  fetchPriority,
  quality: customQuality,
  placeholder,
  blurDataURL,
  sizes,
}: OptimizedBackgroundImageProps) => {
  // Valeurs par défaut pour le hook d'optimisation
  const defaultWidth = width || 1920
  const defaultHeight = height || 1080

  const { shouldOptimize, quality: optimizedQuality, unoptimized } = useImageOptimization({
    src,
    width: defaultWidth,
    height: defaultHeight,
    isBackground: true,
  })

  // Utiliser la qualité personnalisée si fournie, sinon celle optimisée
  const finalQuality = customQuality || optimizedQuality

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Image de fond optimisée */}
      <Image
        src={src}
        alt={alt}
        {...(fill ?
          { fill: true } :
          { width: defaultWidth, height: defaultHeight }
        )}
        className="absolute inset-0 w-full h-full object-cover"
        priority={priority}
        fetchPriority={fetchPriority || (priority ? 'high' : undefined)}
        quality={finalQuality}
        unoptimized={unoptimized}
        sizes={sizes || "100vw"}
        style={{
          objectPosition: 'center',
        }}
        {...(placeholder && { placeholder })}
        {...(blurDataURL && { blurDataURL })}
      />

      {/* Overlay optionnel */}
      {overlay && (
        <div
          className="absolute inset-0"
          style={{
            background: overlayColor,
            opacity: overlayOpacity,
          }}
        />
      )}

      {/* Contenu superposé */}
      {children && (
        <div className={`relative z-10 ${contentClassName}`}>
          {children}
        </div>
      )}
    </div>
  )
}

export default OptimizedBackgroundImage
