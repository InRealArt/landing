'use client'

import { useState, useEffect } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import OptimizedContentImage from './OptimizedContentImage'
import LoadingSpinner from './LoadingSpinner'

interface ArtworkImageModalProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  currentIndex: number
  onIndexChange: (index: number) => void
  artworkName: string
}

export default function ArtworkImageModal({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange,
  artworkName
}: ArtworkImageModalProps) {
  const { t } = useLanguageStore()
  const [isAnimating, setIsAnimating] = useState(false)
  const [isImageLoading, setIsImageLoading] = useState(true)

  // Gestion des touches clavier
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.key === 'ArrowLeft') {
        handlePrevious()
      } else if (event.key === 'ArrowRight') {
        handleNext()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, images.length])

  // Empêcher le scroll du body quand la modale est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Réinitialiser le loader quand l'index change
  useEffect(() => {
    setIsImageLoading(true)
  }, [currentIndex])

  const handlePrevious = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setIsImageLoading(true)
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    onIndexChange(newIndex)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setIsImageLoading(true)
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    onIndexChange(newIndex)
    setTimeout(() => setIsAnimating(false), 300)
  }

  const handleImageLoad = () => {
    setIsImageLoading(false)
  }

  const handleImageError = () => {
    setIsImageLoading(false)
  }

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      {/* Bouton de fermeture */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white hover:text-gray-300 transition-colors duration-200"
        aria-label={t('artwork.closeModal')}
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Bouton précédent */}
      {images.length > 1 && (
        <button
          onClick={handlePrevious}
          disabled={isAnimating}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white hover:text-gray-300 transition-colors duration-200 disabled:opacity-50"
          aria-label={t('artwork.previousImage')}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Bouton suivant */}
      {images.length > 1 && (
        <button
          onClick={handleNext}
          disabled={isAnimating}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white hover:text-gray-300 transition-colors duration-200 disabled:opacity-50"
          aria-label={t('artwork.nextImage')}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Contenu de la modale */}
      <div className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Loader pendant le chargement */}
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <LoadingSpinner size="md" showText={true} />
            </div>
          )}

          <OptimizedContentImage
            src={images[currentIndex]}
            alt={`${artworkName} - Image ${currentIndex + 1}`}
            width={1200}
            height={800}
            className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
              isAnimating ? 'opacity-50' : isImageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            priority={true}
            quality={95}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      </div>

      {/* Indicateurs de pagination */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => onIndexChange(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Compteur d'images */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  )
}
