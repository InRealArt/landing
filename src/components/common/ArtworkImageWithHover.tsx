'use client'

import { useState } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import OptimizedContentImage from './OptimizedContentImage'
import LoadingSpinner from './LoadingSpinner'

interface ArtworkImageWithHoverProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  onViewDetails: () => void
}

export default function ArtworkImageWithHover({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  onViewDetails
}: ArtworkImageWithHoverProps) {
  const { t } = useLanguageStore()
  const [isHovered, setIsHovered] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)

  const handleImageLoad = () => {
    setIsImageLoading(false)
  }

  const handleImageError = () => {
    setIsImageLoading(false)
  }

  return (
    <div
      className={`relative group overflow-hidden rounded-lg min-h-[400px] ring-1 ring-borderColor/50 hover:ring-purpleColor/30 transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Loader pendant le chargement de l'image principale */}
      {isImageLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#1A1A1A]">
          <LoadingSpinner size="md" showText={false} />
        </div>
      )}

      {/* Image principale */}
      <OptimizedContentImage
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full transition-transform duration-300 group-hover:scale-105 ${
          isImageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={priority}
        isDecorative={false}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {/* Overlay avec bouton au survol */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={onViewDetails}
          className="bg-purpleColor hover:bg-purpleColor/90 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
          aria-label={t('artwork.viewDetails')}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span>{t('artwork.viewDetails')}</span>
        </button>
      </div>

      {/* Effet de brillance au survol */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 transition-all duration-700 ${
          isHovered ? 'translate-x-full' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transform: isHovered ? 'translateX(100%) skewX(-12deg)' : 'translateX(-100%) skewX(-12deg)'
        }}
      />
    </div>
  )
}
