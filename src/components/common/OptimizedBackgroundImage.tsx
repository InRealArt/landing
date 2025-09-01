'use client'

import Image from 'next/image'
import { useImageOptimization } from '@/hooks/useImageOptimization'

interface OptimizedBackgroundImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  children?: React.ReactNode
  overlay?: boolean
  overlayColor?: string
  overlayOpacity?: number
}

const OptimizedBackgroundImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  children,
  overlay = false,
  overlayColor = 'rgba(0, 0, 0, 0.3)',
  overlayOpacity = 0.3,
}: OptimizedBackgroundImageProps) => {
  const { shouldOptimize, quality, unoptimized } = useImageOptimization({
    src,
    width,
    height,
    isBackground: true,
  })

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Image de fond optimisée */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="absolute inset-0 w-full h-full object-cover"
        priority={false}
        quality={quality}
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
            backgroundColor: overlayColor,
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
