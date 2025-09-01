'use client'

import Image from 'next/image'
import { useImageOptimization } from '@/hooks/useImageOptimization'
import { shouldOptimizeImage, getOptimalQuality, getResponsiveSizes } from '@/config/imageConfig'

interface OptimizedContentImageProps {
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
  isDecorative?: boolean
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
  ...props
}: OptimizedContentImageProps) => {
  const { shouldOptimize, priority: optimizedPriority, unoptimized } = useImageOptimization({
    src,
    width,
    height,
    priority,
    isDecorative,
  })

  // Utiliser notre configuration personnalisée
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
