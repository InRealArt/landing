'use client'

import { useEffect, useState } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'

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
    <div className="relative h-[560px] lg:h-[700px] w-full overflow-hidden">
      {/* Image de fond avec OptimizedBackgroundImage */}
      <div className="absolute inset-0">
        <div className="w-full h-full [&_img]:!object-center [&_img]:scale-110">
          {backgroundImage && (
            <OptimizedBackgroundImage
              src={backgroundImage}
              alt={`Arrière-plan pour ${artist.name}`}
              width={1920}
              height={1080}
              className="w-full h-full"
              overlay={false}
            />
          )}
        </div>
      </div>
      
      {/* Dégradé du bas vers le background RGB(19, 19, 19) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(19,19,19)] via-[rgb(19,19,19,0.8)] to-transparent z-10" />

      {/* Contenu principal */}
      <div className="relative z-20 h-full flex items-end pb-8 lg:pb-12">
        <div className="max-w-90 xl:max-w-screen-xl mx-auto w-full px-4">
          {/* Carte de l'artiste */}
          <div className="relative max-w-sm h-80 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
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
                      className="px-3 py-1 bg-backgroundColor/20 backdrop-blur-sm text-white rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Informations de l'artiste en bas */}
            <div className="absolute bottom-4 left-4 right-4 z-10">
              {/* Année de naissance et pays avec effet de blur grisé */}
              {(artist.birthYear || artist.countryName) && (
                <div className="mb-3">
                  <div className="inline-block px-3 py-1 bg-black/30 backdrop-blur-md rounded-lg">
                    <p className="text-sm text-white font-medium inter">
                      {artist.birthYear && `${t('artistPage.bornIn')} ${artist.birthYear}`}
                      {artist.birthYear && artist.countryName && ' - '}
                      {artist.countryName}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Prénom et nom sur deux lignes avec effet de blur grisé */}
              <div className="bricolage-grotesque">
                <div className="inline-block px-4 py-2 bg-black/30 backdrop-blur-md rounded-lg">
                  {(() => {
                    const nameParts = artist.name.split(' ')
                    const firstName = nameParts[0]
                    const lastName = nameParts.slice(1).join(' ')
                    
                    return (
                      <>
                        <h1 className="text-3xl lg:text-4xl font-bold leading-tight text-white">
                          {firstName}
                        </h1>
                        {lastName && (
                          <h2 className="text-3xl lg:text-4xl font-bold leading-tight text-white">
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
    </div>
  )
}
