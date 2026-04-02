'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import OptimizedContentImage from './OptimizedContentImage'
import LoadingSpinner from './LoadingSpinner'
import FirebaseImageLoader from './FirebaseImageLoader'
import { useCloudStorageImage } from '@/hooks/useCloudStorageImage'

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
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const { src: imgSrc, status, onLoad, onError } = useCloudStorageImage(src)
  const isImageLoading = status === 'loading' || status === 'retrying'

  return (
    <div
      className={`relative group overflow-hidden rounded-lg min-h-[400px] ring-1 ring-borderColor/50 hover:ring-purpleColor/30 transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Loader pendant le chargement de l'image principale */}
      {isImageLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#1A1A1A]">
          {status === 'retrying' ? <FirebaseImageLoader /> : <LoadingSpinner size="md" showText={false} />}
        </div>
      )}

      {/* Image principale */}
      <OptimizedContentImage
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full transition-transform duration-300 group-hover:scale-105 ${
          isImageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        priority={priority}
        isDecorative={false}
        onLoad={onLoad}
        onError={onError}
      />

      {/* Overlay au survol — dégradé bas vers haut, galerie éditoriale */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-end pb-10 transition-opacity duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)',
        }}
      >
        {/* Étiquette section-number au-dessus du bouton */}
        <span
          className={`block text-[0.55rem] uppercase tracking-[0.45em] text-white/60 mb-4 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
            isHovered ? 'translate-y-0' : 'translate-y-3'
          }`}
          style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
          aria-hidden="true"
        >
          In Real Art
        </span>

        {/* CTA ghost — bord blanc, remplit blanc au survol */}
        <button
          onClick={onViewDetails}
          className={`border border-white/70 text-white/90 hover:border-white hover:bg-white hover:text-black px-8 py-3 text-[0.6rem] uppercase tracking-[0.3em] transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
          style={{ fontFamily: 'var(--font-montserrat), sans-serif' }}
          aria-label={t('artwork.viewDetails')}
        >
          {t('artwork.viewDetails')}
        </button>

        {/* Filet or en bas de l'overlay */}
        <div
          className={`absolute bottom-0 left-0 h-[2px] transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
            isHovered ? 'w-full' : 'w-0'
          }`}
          style={{ backgroundColor: 'var(--gold-accent)' }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
