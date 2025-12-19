'use client'

import { useLanguageStore } from '@/store/languageStore'

interface SoldStatusBadgeProps {
  isSold: boolean
  className?: string
}

export default function SoldStatusBadge({ isSold, className = '' }: SoldStatusBadgeProps) {
  const { t } = useLanguageStore()

  if (!isSold) {
    return null
  }
  
  return (
    <div className={`absolute top-3 right-3 z-10 ${className}`}>
      {/* Effet de glow en arrière-plan */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purpleColor/40 via-purpleColor/30 to-purpleColor/40 rounded-full blur-sm opacity-60 animate-pulse"></div>
      
      {/* Badge principal */}
      <div className="relative px-3 py-1.5 bg-gradient-to-r from-purpleColor/20 via-purpleColor/15 to-purpleColor/20 backdrop-blur-md rounded-full border border-purpleColor/40 shadow-lg shadow-purpleColor/20 flex items-center gap-1.5 group">
        {/* Icône de verrouillage pour évoquer l'exclusivité */}
        <svg
          className="w-3 h-3 text-purpleColor group-hover:scale-110 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        
        {/* Texte avec effet de brillance */}
        <span className="text-xs font-semibold bricolage-grotesque text-purpleColor tracking-wide relative">
          {t('artwork.sold') || 'Vendu'}
          {/* Effet de brillance au survol */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></span>
        </span>
        
        {/* Petite étoile pour l'exclusivité */}
        <svg
          className="w-2.5 h-2.5 text-purpleColor/70"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </div>
    </div>
  )
}

