'use client'

// Animation de skeleton personnalisée
const shimmerAnimation = 'animate-shimmer'

// Styles CSS pour l'animation shimmer personnalisée
const shimmerStyles = `
  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
  
  .animate-shimmer {
    background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
    background-size: 200px 100%;
    animation: shimmer 1.5s infinite;
  }
`

// Composant de skeleton pour le hero des artistes
function ArtistsHeroSkeleton() {
  return (
    <div className="relative h-[400px] lg:h-[500px] w-full overflow-hidden">
      {/* Image de fond skeleton */}
      <div className="absolute inset-0 bg-gray-700 animate-pulse" />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />
      
      {/* Contenu skeleton */}
      <div className="relative z-20 h-full flex items-center justify-center">
        <div className="text-center px-4">
          <div className={`h-12 w-96 bg-gray-600 rounded ${shimmerAnimation} mx-auto mb-4`} />
          <div className={`h-6 w-80 bg-gray-600 rounded ${shimmerAnimation} mx-auto`} />
        </div>
      </div>
    </div>
  )
}

// Composant de skeleton pour la grille d'artistes
function ArtistsGridSkeleton() {
  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Titre skeleton */}
        <div className="text-center mb-12">
          <div className={`h-10 w-64 bg-gray-600 rounded ${shimmerAnimation} mx-auto mb-4`} />
          <div className={`w-24 h-1 bg-gray-600 rounded-full mx-auto ${shimmerAnimation}`} />
        </div>
        
        {/* Filtres skeleton */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <div className={`h-10 w-24 bg-gray-600 rounded-full ${shimmerAnimation}`} />
          <div className={`h-10 w-32 bg-gray-600 rounded-full ${shimmerAnimation}`} />
          <div className={`h-10 w-28 bg-gray-600 rounded-full ${shimmerAnimation}`} />
          <div className={`h-10 w-36 bg-gray-600 rounded-full ${shimmerAnimation}`} />
        </div>
        
        {/* Grille d'artistes skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="group">
              {/* Image artiste skeleton */}
              <div className={`w-full h-64 bg-gray-600 rounded-lg mb-4 ${shimmerAnimation}`} />
              
              {/* Informations skeleton */}
              <div className="space-y-2">
                <div className={`h-6 w-3/4 bg-gray-600 rounded ${shimmerAnimation}`} />
                <div className={`h-4 w-1/2 bg-gray-600 rounded ${shimmerAnimation}`} />
                <div className={`h-4 w-2/3 bg-gray-600 rounded ${shimmerAnimation}`} />
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination skeleton */}
        <div className="flex justify-center mt-12">
          <div className="flex space-x-2">
            <div className={`h-10 w-10 bg-gray-600 rounded ${shimmerAnimation}`} />
            <div className={`h-10 w-10 bg-gray-600 rounded ${shimmerAnimation}`} />
            <div className={`h-10 w-10 bg-gray-600 rounded ${shimmerAnimation}`} />
            <div className={`h-10 w-10 bg-gray-600 rounded ${shimmerAnimation}`} />
            <div className={`h-10 w-10 bg-gray-600 rounded ${shimmerAnimation}`} />
          </div>
        </div>
      </div>
    </section>
  )
}

// Composant de skeleton pour le slider des catégories
function CategoriesSliderSkeleton() {
  return (
    <section className="w-full mb-16 mt-24">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className={`h-8 w-64 bg-gray-600 rounded ${shimmerAnimation}`} />
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 rounded-full bg-gray-600 ${shimmerAnimation}`} />
            <div className={`w-12 h-12 rounded-full bg-gray-600 ${shimmerAnimation}`} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className={`h-64 rounded-2xl bg-gray-600 ${shimmerAnimation}`} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Composant principal de skeleton pour la page des artistes
export default function ArtistsPageSkeleton() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shimmerStyles }} />
      <div className="min-h-screen bg-backgroundColor">
        {/* Hero section skeleton */}
        <ArtistsHeroSkeleton />
        
        {/* Slider des catégories skeleton */}
        <CategoriesSliderSkeleton />
        
        {/* Grille d'artistes skeleton */}
        <ArtistsGridSkeleton />
      </div>
    </>
  )
}
