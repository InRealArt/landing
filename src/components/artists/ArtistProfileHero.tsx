'use client'

import { useEffect, useState } from 'react'
import { useLanguageStore } from '@/store/languageStore'

interface ArtistProfileHeroProps {
  artist: {
    name: string
    role: string
    intro: string
    description: string
    photo: string
    mediumTags?: string[]
    birthYear?: number | null
    countryCode?: string | null
    countryName?: string | null
  }
}

export default function ArtistProfileHero({ artist }: ArtistProfileHeroProps) {
  const { t } = useLanguageStore()
  const [backgroundImage, setBackgroundImage] = useState('')

  useEffect(() => {
    // Sélectionner une image de fond aléatoire parmi les 5 disponibles
    const randomImageNumber = Math.floor(Math.random() * 5) + 1
    setBackgroundImage(`/images/artistProfile/artiste_profile_${randomImageNumber}.webp`)
  }, [])

  return (
    <div className="relative h-96 lg:h-[700px] w-full overflow-hidden">
      {/* Image de fond */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        {/* Overlay sombre pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-90 xl:max-w-screen-xl mx-auto w-full px-4">
          {/* Carte de l'artiste */}
          <div className="relative max-w-sm h-96 rounded-2xl overflow-hidden shadow-2xl">
            {/* Image de l'artiste en arrière-plan de la carte */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${artist.photo}')` }}
            />
            
            {/* Dégradé noir du bas */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Tags de médium en haut avec effet semi-transparent */}
            {artist.mediumTags && artist.mediumTags.length > 0 && (
              <div className="absolute top-4 left-4 right-4 z-10">
                <div className="flex flex-wrap gap-2">
                  {artist.mediumTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm inter font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Informations de l'artiste en bas */}
            <div className="absolute bottom-4 left-4 right-4 z-10">
              {/* Année de naissance et pays */}
              {(artist.birthYear || artist.countryName) && (
                <p className="text-sm text-white/90 mb-2 inter">
                  {artist.birthYear && `${t('artistPage.bornIn')} ${artist.birthYear}`}
                  {artist.birthYear && artist.countryName && ' - '}
                  {artist.countryName}
                </p>
              )}
              
              {/* Prénom et nom sur deux lignes */}
              <div className="bricolage-grotesque text-white">
                {(() => {
                  const nameParts = artist.name.split(' ')
                  const firstName = nameParts[0]
                  const lastName = nameParts.slice(1).join(' ')
                  
                  return (
                    <>
                      <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                        {firstName}
                      </h1>
                      {lastName && (
                        <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                          {lastName}
                        </h2>
                      )}
                    </>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
