'use client'

import { useLanguageStore } from '@/store/languageStore'
import { ArtistData } from '@/store/useArtistStore'
import { formatTextWithLineBreaksJSX } from '@/utils/functions'

interface ArtistInfoSectionProps {
  artist: ArtistData
}

export default function ArtistInfoSection({ artist }: ArtistInfoSectionProps) {
  const { t } = useLanguageStore()

  return (
    <section className="pt-32 pb-16">
      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Colonne gauche - Informations de l'artiste */}
          <div className="space-y-6">
            {/* Année de naissance et pays */}
            {(artist.birthYear || artist.countryName) && (
              <p className="text-grayText text-sm bricolage-grotesque font-serif">
                {artist.birthYear && `${t('artists.profile.bornIn')} ${artist.birthYear}`}
                {artist.birthYear && artist.countryName && ' - '}
                {artist.countryName}
              </p>
            )}
            
            {/* Citation de l'artiste */}
            <h2 className="text-2xl lg:text-3xl font-bold text-textColor bricolage-grotesque font-serif">
              {formatTextWithLineBreaksJSX(artist.intro)}
            </h2>
            
            {/* Bouton Suivre l'artiste */}
            {/* <button className="px-6 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-textColor transition-colors duration-200 flex items-center gap-2 bricolage-grotesque font-serif">
              <span>{t('artists.profile.followArtist')}</span>
              <span className="text-xl">+</span>
            </button> */}
            
            {/* Description de l'artiste */}
            <div className="text-textColor text-sm leading-relaxed bricolage-grotesque font-serif">
              {formatTextWithLineBreaksJSX(artist.description || t('artists.profile.certifiedArtist').replace('{name}', artist.name))}
            </div>
            
            {/* Tags de médium */}
            {artist.mediumTags && artist.mediumTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {artist.mediumTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-600 text-white rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Colonne droite - Photo de l'artiste */}
          <div className="flex justify-center lg:justify-end">
            <div className="max-w-sm">
              <img
                src={artist.secondaryImageUrl || artist.photo}
                alt={`Photo de ${artist.name}`}
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
