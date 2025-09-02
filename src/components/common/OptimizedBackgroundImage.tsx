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
  children?: React.ReactNode
  overlay?: boolean
  overlayColor?: string
  overlayOpacity?: number
  priority?: boolean
  quality?: number
}

const OptimizedBackgroundImage = ({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  children,
  overlay = false,
  overlayColor = 'rgba(0, 0, 0, 0.3)',
  overlayOpacity = 0.3,
  priority = false,
  quality: customQuality,
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
        quality={finalQuality}
        unoptimized={unoptimized}
        sizes="100vw"
        style={{
          objectPosition: 'center',
        }}
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
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  )
}

export default OptimizedBackgroundImage
