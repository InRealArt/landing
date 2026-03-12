'use client'

import { useMemo } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import { ArtistCategory } from '@/actions/artistCategoryActions'
import { ArtistData } from '@/actions/artistActions'
import ArtistCategoryGrid from '@/components/artists/ArtistCategoryGrid'
import CategoryBreadcrumb from '@/components/artists/CategoryBreadcrumb'

interface ArtistCategoryPageClientProps {
  category: ArtistCategory
  initialArtists: ArtistData[]
}

export default function ArtistCategoryPageClient({ 
  category, 
  initialArtists 
}: ArtistCategoryPageClientProps) {
  const { language } = useLanguageStore()

  // Traductions de la catégorie
  const displayCategory = useMemo(() => {
    return {
      ...category,
      name: category.translations?.name?.[language] || category.name,
      description: category.translations?.description?.[language] || category.description
    }
  }, [category, language])

  return (
    <div className="min-h-screen bg-backgroundColor text-textColor">
      {/* Hero Section */}
      <section 
        className="relative w-full h-96 md:h-[500px] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: displayCategory.imageUrl 
            ? `url(${displayCategory.imageUrl})` 
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        {/* Overlay pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-backgroundColor/40" />
        
        {/* Contenu du hero */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="max-w-screen-2xl mx-auto px-10 text-center">
            <span className="section-number text-white/70">Nos Artistes</span>
            <h1 className="text-6xl md:text-8xl serif text-white mb-6">
              <span className="italic text-gold-accent">{displayCategory.name}</span>
            </h1>
            {displayCategory.description && (
              <p className="text-[11px] uppercase tracking-[0.3em] text-white/70 max-w-3xl mx-auto leading-relaxed">
                {displayCategory.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Breadcrumb et Grille d'artistes */}
      <div className="py-16">
        <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4">
          {/* <CategoryBreadcrumb categoryName={displayCategory.name} /> */}
        </div>
        <ArtistCategoryGrid artists={initialArtists} />
      </div>
    </div>
  )
}
