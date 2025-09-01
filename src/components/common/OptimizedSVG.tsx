'use client'

import Image from 'next/image'

interface OptimizedSVGProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}

const OptimizedSVG = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
}: OptimizedSVGProps) => {
  // Les SVG ne bénéficient pas de l'optimisation Next.js
  // Utiliser la propriété unoptimized pour éviter les transformations
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      unoptimized={true}
      style={{
        maxWidth: '100%',
        height: 'auto',
      }}
    />
  )
}

export default OptimizedSVG
