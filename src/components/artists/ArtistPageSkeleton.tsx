'use client'

import { useEffect, useState } from 'react'

// Animation de skeleton personnalisée
const skeletonAnimation = 'animate-pulse'
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

// Composant de skeleton pour l'image de fond du hero
function HeroBackgroundSkeleton() {
  const [backgroundImage, setBackgroundImage] = useState('')

  useEffect(() => {
    // Sélectionner une image de fond aléatoire parmi les 5 disponibles (même logique que le composant réel)
    const randomImageNumber = Math.floor(Math.random() * 5) + 1
    setBackgroundImage(`/images/artistProfile/artiste_profile_${randomImageNumber}.webp`)
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shimmerStyles }} />
      <div className="relative h-[560px] lg:h-[700px] w-full overflow-hidden">
        {/* Image de fond réelle mais avec overlay de skeleton */}
        <div className="absolute inset-0">
          <div className="w-full h-full [&_img]:!object-center [&_img]:scale-110">
            {backgroundImage && (
              <img
                src={backgroundImage}
                alt=""
                className="w-full h-full opacity-20 blur-sm"
              />
            )}
          </div>
        </div>
        
        {/* Overlay de skeleton */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(19,19,19)] via-[rgb(19,19,19,0.8)] to-transparent z-10" />
        <div className="absolute inset-0 bg-gray-800/60 z-20" />

        {/* Contenu skeleton */}
        <div className="relative z-30 h-full flex items-end pb-8 lg:pb-12">
          <div className="max-w-90 xl:max-w-screen-xl mx-auto w-full px-4">
            {/* Carte skeleton de l'artiste */}
            <div className="relative max-w-sm h-80 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gray-700/80 backdrop-blur-sm">
              {/* Tags skeleton */}
              <div className="absolute top-4 left-4 right-4 z-10">
                <div className="flex flex-wrap gap-2">
                  <div className={`h-6 w-16 bg-gray-600 rounded-full ${shimmerAnimation}`} />
                  <div className={`h-6 w-20 bg-gray-600 rounded-full ${shimmerAnimation}`} />
                  <div className={`h-6 w-14 bg-gray-600 rounded-full ${shimmerAnimation}`} />
                </div>
              </div>

              {/* Informations skeleton en bas */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                {/* Année et pays skeleton */}
                <div className="mb-3">
                  <div className={`h-6 w-32 bg-gray-600 rounded-lg ${shimmerAnimation}`} />
                </div>
                
                {/* Nom skeleton */}
                <div className="space-y-2">
                  <div className={`h-8 w-40 bg-gray-600 rounded-lg ${shimmerAnimation}`} />
                  <div className={`h-8 w-36 bg-gray-600 rounded-lg ${shimmerAnimation}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Composant de skeleton pour la section d'informations
function ArtistInfoSkeleton() {
  return (
    <section className="pt-32 pb-16">
      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Colonne gauche - Informations skeleton */}
          <div className="space-y-6">
            {/* Année et pays skeleton */}
            <div className={`h-4 w-48 bg-gray-600 rounded ${shimmerAnimation}`} />
            
            {/* Nom skeleton */}
            <div className="space-y-2">
              <div className={`h-8 w-64 bg-gray-600 rounded ${shimmerAnimation}`} />
              <div className={`h-8 w-56 bg-gray-600 rounded ${shimmerAnimation}`} />
            </div>
            
            {/* Description skeleton */}
            <div className="space-y-2">
              <div className={`h-4 w-full bg-gray-600 rounded ${shimmerAnimation}`} />
              <div className={`h-4 w-full bg-gray-600 rounded ${shimmerAnimation}`} />
              <div className={`h-4 w-3/4 bg-gray-600 rounded ${shimmerAnimation}`} />
            </div>
            
            {/* Tags skeleton */}
            <div className="flex flex-wrap gap-2">
              <div className={`h-6 w-16 bg-gray-600 rounded-full ${shimmerAnimation}`} />
              <div className={`h-6 w-20 bg-gray-600 rounded-full ${shimmerAnimation}`} />
              <div className={`h-6 w-14 bg-gray-600 rounded-full ${shimmerAnimation}`} />
            </div>
          </div>
          
          {/* Colonne droite - Photo skeleton */}
          <div className="flex justify-center lg:justify-end">
            <div className="max-w-sm w-full">
              <div className={`w-full h-80 bg-gray-600 rounded-2xl ${shimmerAnimation}`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Composant de skeleton pour les œuvres d'art
function ArtistArtworksSkeleton() {
  return (
    <section className="relative max-w-90 xl:max-w-screen-xl m-auto py-16">
      <div className="px-4">
        {/* Titre skeleton */}
        <div className="mb-8">
          <div className={`h-8 w-64 bg-gray-600 rounded ${shimmerAnimation} mx-auto`} />
        </div>
        
        {/* Grille d'œuvres skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-4">
              {/* Image skeleton */}
              <div className={`w-full h-64 bg-gray-600 rounded-lg ${shimmerAnimation}`} />
              
              {/* Titre skeleton */}
              <div className="space-y-2">
                <div className={`h-4 w-3/4 bg-gray-600 rounded ${shimmerAnimation}`} />
                <div className={`h-4 w-1/2 bg-gray-600 rounded ${shimmerAnimation}`} />
              </div>
              
              {/* Prix skeleton */}
              <div className={`h-5 w-20 bg-gray-600 rounded ${shimmerAnimation}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Composant de skeleton pour la biographie
function ArtistBiographySkeleton() {
  return (
    <section className="py-16 lg:py-24 bg-backgroundColor">
      <div className="max-w-7xl mx-auto px-4">
        {/* Titre principal skeleton */}
        <div className="text-center mb-16">
          <div className={`h-10 w-64 bg-gray-600 rounded ${shimmerAnimation} mx-auto mb-4`} />
          <div className={`w-24 h-1 bg-gray-600 rounded-full mx-auto ${shimmerAnimation}`} />
        </div>

        {/* Layout en grille skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Image artiste skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className={`w-full h-96 lg:h-[600px] bg-gray-600 rounded-2xl ${shimmerAnimation}`} />
            </div>
          </div>
          
          {/* Contenu biographie skeleton */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Colonne gauche */}
              <div className="space-y-8">
                {/* Section 1 */}
                <div className="space-y-4">
                  <div className={`h-6 w-48 bg-gray-600 rounded ${shimmerAnimation}`} />
                  <div className="space-y-2">
                    <div className={`h-4 w-full bg-gray-600 rounded ${shimmerAnimation}`} />
                    <div className={`h-4 w-full bg-gray-600 rounded ${shimmerAnimation}`} />
                    <div className={`h-4 w-3/4 bg-gray-600 rounded ${shimmerAnimation}`} />
                  </div>
                </div>
                
                {/* Section 3 */}
                <div className="space-y-4">
                  <div className={`h-6 w-40 bg-gray-600 rounded ${shimmerAnimation}`} />
                  <div className="space-y-2">
                    <div className={`h-4 w-full bg-gray-600 rounded ${shimmerAnimation}`} />
                    <div className={`h-4 w-5/6 bg-gray-600 rounded ${shimmerAnimation}`} />
                  </div>
                </div>
              </div>

              {/* Colonne droite */}
              <div className="space-y-8">
                {/* Section 2 */}
                <div className="space-y-4">
                  <div className={`h-6 w-44 bg-gray-600 rounded ${shimmerAnimation}`} />
                  <div className="space-y-2">
                    <div className={`h-4 w-full bg-gray-600 rounded ${shimmerAnimation}`} />
                    <div className={`h-4 w-full bg-gray-600 rounded ${shimmerAnimation}`} />
                    <div className={`h-4 w-2/3 bg-gray-600 rounded ${shimmerAnimation}`} />
                  </div>
                </div>
                
                {/* Section 4 */}
                <div className="space-y-4">
                  <div className={`h-6 w-36 bg-gray-600 rounded ${shimmerAnimation}`} />
                  <div className="space-y-2">
                    <div className={`h-4 w-full bg-gray-600 rounded ${shimmerAnimation}`} />
                    <div className={`h-4 w-4/5 bg-gray-600 rounded ${shimmerAnimation}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Composant principal de skeleton pour la page artiste
export default function ArtistPageSkeleton() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shimmerStyles }} />
      <div className="min-h-screen bg-backgroundColor">
        {/* Hero section skeleton */}
        <HeroBackgroundSkeleton />
        
        {/* Section d'informations skeleton */}
        <ArtistInfoSkeleton />
        
        {/* Section œuvres d'art skeleton */}
        <ArtistArtworksSkeleton />
        
        {/* Section biographie skeleton */}
        <ArtistBiographySkeleton />
      </div>
    </>
  )
}
