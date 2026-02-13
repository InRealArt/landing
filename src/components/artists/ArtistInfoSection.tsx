'use client'

import { useLanguageStore } from '@/store/languageStore'
import { ArtistData } from '@/store/useArtistStore'
import { formatTextWithLineBreaksJSX } from '@/utils/functions'

interface ArtistInfoSectionProps {
  artist: ArtistData
  interviewUrl?: string | null
  artitudeUrl?: string | null
}

export default function ArtistInfoSection({ artist, interviewUrl, artitudeUrl }: ArtistInfoSectionProps) {
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

            {/* CTAs interview & atelier Artitude */}
            {(interviewUrl || artitudeUrl) && (
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                {interviewUrl && (
                  <a
                    href={interviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-7 py-3.5 bg-textColor text-backgroundColor bricolage-grotesque font-serif text-sm font-semibold rounded-full hover:opacity-85 transition-opacity duration-200"
                  >
                    {t('artists.profile.readInterview').replace('{name}', artist.name)}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                  </a>
                )}
                {artitudeUrl && (
                  <a
                    href={artitudeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-7 py-3.5 bg-textColor text-backgroundColor bricolage-grotesque font-serif text-sm font-semibold rounded-full hover:opacity-85 transition-opacity duration-200"
                  >
                    {t('artists.profile.visitArtitude').replace('{name}', artist.name)}
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>
                  </a>
                )}
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
