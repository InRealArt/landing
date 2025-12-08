'use client'

import { useEffect, useState } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import { formatTextWithLineBreaksJSX } from '@/utils/functions'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

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
    biographyHeader4?: string | null
    biographyText4?: string | null
    imageArtistStudio?: string | null
  }
}

interface BiographySectionProps {
  header: string
  text: string
  isExpanded: boolean
  onToggle: () => void
  maxLength?: number
  t: (key: string) => string
}

function BiographySection({ header, text, isExpanded, onToggle, maxLength = 300, t }: BiographySectionProps) {
  const shouldTruncate = text.length > maxLength
  const displayText = shouldTruncate && !isExpanded ? text.substring(0, maxLength) + '...' : text

  return (
    <div className="group relative">
      {/* Header avec ligne décorative */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-purpleColor/30 to-transparent"></div>
        <h3 className="text-xl lg:text-2xl font-bold text-textColor bricolage-grotesque font-serif px-4">
          {header}
        </h3>
        <div className="flex-1 h-px bg-gradient-to-l from-purpleColor/30 to-transparent"></div>
      </div>

      {/* Contenu du texte */}
      <div className="relative">
        <div className="text-textColor text-sm lg:text-base leading-relaxed bricolage-grotesque font-serif prose prose-invert max-w-none">
          {formatTextWithLineBreaksJSX(displayText)}
        </div>
        
        {/* Bouton "Voir plus/moins" */}
        {shouldTruncate && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={onToggle}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purpleColor/10 to-purpleColor/5 hover:from-purpleColor/20 hover:to-purpleColor/10 border border-purpleColor/30 hover:border-purpleColor/50 rounded-full text-purpleColor text-sm font-medium transition-all duration-300 group-hover:shadow-lg group-hover:shadow-purpleColor/10"
            >
              {isExpanded ? (
                <>
                  {t('biography.showLess')}
                  <ChevronUpIcon className="w-4 h-4 transition-transform duration-300" />
                </>
              ) : (
                <>
                  {t('biography.showMore')}
                  <ChevronDownIcon className="w-4 h-4 transition-transform duration-300" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ArtistBiography({ artist }: ArtistBiographyProps) {
  const { t, language } = useLanguageStore()
  const [randomImage, setRandomImage] = useState<string>('')
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({})

  // Sélectionner l'image de l'atelier de l'artiste si disponible, sinon une image aléatoire
  useEffect(() => {
    console.log('ArtistBiography - artist.imageArtistStudio:', artist.imageArtistStudio)
    if (artist.imageArtistStudio) {
      console.log('Utilisation de l\'image de l\'atelier:', artist.imageArtistStudio)
      setRandomImage(artist.imageArtistStudio)
    } else {
      const imageNumber = Math.floor(Math.random() * 5) + 1
      const randomImagePath = `/images/artistBiography/artist_biography_${imageNumber}.webp`
      console.log('Utilisation de l\'image aléatoire:', randomImagePath)
      setRandomImage(randomImagePath)
    }
  }, [artist.imageArtistStudio])

  // Fonction pour basculer l'état d'expansion d'une section
  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  // Ne pas afficher le composant s'il n'y a pas de contenu de biographie
  const hasContent = artist.biographyHeader1 || artist.biographyText1 || 
                    artist.biographyHeader2 || artist.biographyText2 || 
                    artist.biographyHeader3 || artist.biographyText3 ||
                    artist.biographyHeader4 || artist.biographyText4
  
  if (!hasContent) {
    return null
  }

  // Fonction helper pour obtenir le contenu traduit d'une section
  const getSectionContent = (sectionNumber: number) => {
    const headerKey = `biographyHeader${sectionNumber}` as keyof typeof artist
    const textKey = `biographyText${sectionNumber}` as keyof typeof artist
    
    const header = (artist[headerKey] as string) || ''
    const text = (artist[textKey] as string) || ''
    
    return { header, text }
  }

  return (
    <section className="py-16 lg:py-24 bg-backgroundColor">
      <div className="max-w-7xl mx-auto px-4">
        {/* Titre principal de la section */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-textColor bricolage-grotesque font-serif mb-4">
            {t('biography.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purpleColor to-purpleColor/50 mx-auto rounded-full"></div>
        </div>

        {/* Layout en grille harmonieuse - Image à gauche, contenu en 2 colonnes à droite */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Image artiste - Positionnée à gauche */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-purpleColor/20 to-purpleColor/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative w-full h-96 lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                  {randomImage && (
                    <img
                      src={randomImage}
                      alt={`Atelier de ${artist.name}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                {/* Overlay décoratif */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
          
          {/* Contenu biographie - Organisé en 2 colonnes */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Colonne gauche - Sections 1 et 3 */}
              <div className="space-y-8">
                {/* Section biographie 1 */}
                {(() => {
                  const { header, text } = getSectionContent(1)
                  return (header || text) && (
                    <BiographySection
                      header={header || ''}
                      text={text || ''}
                      isExpanded={expandedSections.section1 || false}
                      onToggle={() => toggleSection('section1')}
                      maxLength={200}
                      t={t}
                    />
                  )
                })()}
                
                {/* Section biographie 3 */}
                {(() => {
                  const { header, text } = getSectionContent(3)
                  return (header || text) && (
                    <BiographySection
                      header={header || ''}
                      text={text || ''}
                      isExpanded={expandedSections.section3 || false}
                      onToggle={() => toggleSection('section3')}
                      maxLength={200}
                      t={t}
                    />
                  )
                })()}
              </div>

              {/* Colonne droite - Sections 2 et 4 */}
              <div className="space-y-8">
                {/* Section biographie 2 */}
                {(() => {
                  const { header, text } = getSectionContent(2)
                  return (header || text) && (
                    <BiographySection
                      header={header || ''}
                      text={text || ''}
                      isExpanded={expandedSections.section2 || false}
                      onToggle={() => toggleSection('section2')}
                      maxLength={200}
                      t={t}
                    />
                  )
                })()}
                
                {/* Section biographie 4 */}
                {(() => {
                  const { header, text } = getSectionContent(4)
                  return (header || text) && (
                    <BiographySection
                      header={header || ''}
                      text={text || ''}
                      isExpanded={expandedSections.section4 || false}
                      onToggle={() => toggleSection('section4')}
                      maxLength={200}
                      t={t}
                    />
                  )
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}