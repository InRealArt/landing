'use client'

import { useLanguageStore } from '@/store/languageStore'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  text?: string
  className?: string
}

export default function LoadingSpinner({ 
  size = 'md', 
  showText = true, 
  text,
  className = '' 
}: LoadingSpinnerProps) {
  const { t } = useLanguageStore()

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  }

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Spinner personnalisé avec double anneau */}
      <div className="relative">
        {/* Anneau principal */}
        <div className={`${sizeClasses[size]} border-4 border-purpleColor/20 border-t-purpleColor rounded-full animate-spin`}></div>
        {/* Anneau secondaire (rotation inverse) */}
        <div 
          className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-purpleColor/60 rounded-full animate-spin`}
          style={{ 
            animationDirection: 'reverse', 
            animationDuration: '1.5s' 
          }}
        ></div>
      </div>
      
      {/* Texte de chargement */}
      {showText && (
        <p className={`text-white font-medium animate-pulse ${textSizeClasses[size]}`}>
          {text || t('artwork.loadingImage')}
        </p>
      )}
    </div>
  )
}
