'use client'

import { useEffect, useState } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import { useArtistStore } from '@/store/useArtistStore'
import { formatTextWithLineBreaksJSX } from '@/utils/functions'

interface ArtistBiographyProps {
  artist: {
    id: number
    name: string
    biographyHeader1?: string | null
    biographyText1?: string | null
    biographyHeader2?: string | null
    biographyText2?: string | null
    biographyHeader3?: string | null
    biographyText3?: string | null
  }
}

export default function ArtistBiography({ artist }: ArtistBiographyProps) {
  const { t, language } = useLanguageStore()
  const { getTranslatedField } = useArtistStore()
  const [randomImage, setRandomImage] = useState<string>('')

  // Sélectionner une image aléatoire au chargement du composant
  useEffect(() => {
    const imageNumber = Math.floor(Math.random() * 5) + 1
    setRandomImage(`/images/artistBiography/artist_biography_${imageNumber}.webp`)
  }, [])

  // Ne pas afficher le composant s'il n'y a pas de contenu de biographie
  const hasContent = artist.biographyHeader1 || artist.biographyText1 || 
                    artist.biographyHeader2 || artist.biographyText2 || 
                    artist.biographyHeader3 || artist.biographyText3
  
  // Debug temporaire pour vérifier les données
  console.log('Artist Biography Debug:', {
    biographyHeader1: artist.biographyHeader1,
    biographyText1: artist.biographyText1,
    biographyHeader2: artist.biographyHeader2,
    biographyText2: artist.biographyText2,
    biographyHeader3: artist.biographyHeader3,
    biographyText3: artist.biographyText3,
    hasContent
  })
  
  if (!hasContent) {
    return null
  }

  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: 'rgb(19, 19, 19)' }}>
      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4">
        {/* Layout responsive : 3 colonnes sur grand écran, 1 colonne sur petit écran */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Image - Affichée en premier sur mobile, à gauche sur desktop */}
          <div className="flex justify-center lg:justify-start">
            <div className="relative w-full max-w-sm h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-lg">
              {randomImage && (
                <img
                  src={randomImage}
                  alt={`Illustration biographie ${artist.name}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>
          
          {/* Contenu biographie - Sections 1, 2 et 3 dans l'ordre */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section biographie 1 */}
            {(artist.biographyHeader1 || artist.biographyText1) && (
              <div className="space-y-4">
                {(getTranslatedField(artist.id, 'biographyHeader1', artist.biographyHeader1 || '') || artist.biographyHeader1) && (
                  <h3 className="text-xl lg:text-2xl font-bold text-white bricolage-grotesque font-serif">
                    {getTranslatedField(artist.id, 'biographyHeader1', artist.biographyHeader1 || '') || artist.biographyHeader1}
                  </h3>
                )}
                {(getTranslatedField(artist.id, 'biographyText1', artist.biographyText1 || '') || artist.biographyText1) && (
                  <div className="text-white text-sm lg:text-base leading-relaxed bricolage-grotesque font-serif">
                    {formatTextWithLineBreaksJSX(getTranslatedField(artist.id, 'biographyText1', artist.biographyText1 || '') || artist.biographyText1)}
                  </div>
                )}
              </div>
            )}
            
            {/* Section biographie 2 */}
            {(artist.biographyHeader2 || artist.biographyText2) && (
              <div className="space-y-4">
                {(getTranslatedField(artist.id, 'biographyHeader2', artist.biographyHeader2 || '') || artist.biographyHeader2) && (
                  <h3 className="text-xl lg:text-2xl font-bold text-white bricolage-grotesque font-serif">
                    {getTranslatedField(artist.id, 'biographyHeader2', artist.biographyHeader2 || '') || artist.biographyHeader2}
                  </h3>
                )}
                {(getTranslatedField(artist.id, 'biographyText2', artist.biographyText2 || '') || artist.biographyText2) && (
                  <div className="text-white text-sm lg:text-base leading-relaxed bricolage-grotesque font-serif">
                    {formatTextWithLineBreaksJSX(getTranslatedField(artist.id, 'biographyText2', artist.biographyText2 || '') || artist.biographyText2)}
                  </div>
                )}
              </div>
            )}
            
            {/* Section biographie 3 */}
            {(artist.biographyHeader3 || artist.biographyText3) && (
              <div className="space-y-4">
                {(getTranslatedField(artist.id, 'biographyHeader3', artist.biographyHeader3 || '') || artist.biographyHeader3) && (
                  <h3 className="text-xl lg:text-2xl font-bold text-white bricolage-grotesque font-serif">
                    {getTranslatedField(artist.id, 'biographyHeader3', artist.biographyHeader3 || '') || artist.biographyHeader3}
                  </h3>
                )}
                {(getTranslatedField(artist.id, 'biographyText3', artist.biographyText3 || '') || artist.biographyText3) && (
                  <div className="text-white text-sm lg:text-base leading-relaxed bricolage-grotesque font-serif">
                    {formatTextWithLineBreaksJSX(getTranslatedField(artist.id, 'biographyText3', artist.biographyText3 || '') || artist.biographyText3)}
                  </div>
                )}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </section>
  )
}