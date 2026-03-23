'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'
import { useLanguageStore } from '@/store/languageStore'

const COMMITMENT_KEYS = [
  'about.ourCommitments.commitments.commitment1',
  'about.ourCommitments.commitments.commitment2',
  'about.ourCommitments.commitments.commitment3',
  'about.ourCommitments.commitments.commitment4',
] as const

export default function AboutOurCommitments() {
  const { t } = useLanguageStore()

  return (
    <section className="bg-backgroundColor w-full py-24 lg:py-32">
      <div className="max-w-screen-2xl mx-auto px-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">

          {/* Colonne texte — 7 colonnes */}
          <div className="lg:col-span-7 space-y-12">
            <div>
              <span className="section-number block mb-6">
                ENGAGEMENTS
              </span>
              <h2 className="text-6xl md:text-7xl xl:text-8xl serif italic leading-none text-textColor mb-6">
                {t('about.ourCommitments.commitments.title')}
              </h2>
              <div className="w-12 h-px bg-gold-accent" />
            </div>

            {/* Liste des engagements */}
            <ul className="space-y-0">
              {COMMITMENT_KEYS.map((key, index) => (
                <li
                  key={key}
                  className="border-t border-gold-accent/20 pt-5 pb-5"
                >
                  <div className="flex items-start gap-6">
                    <span className="serif italic text-gold-accent text-sm leading-loose shrink-0 mt-0.5">
                      {String(index + 1).padStart(2, '0')}.
                    </span>
                    <p className="text-[13px] text-grayText leading-loose montserrat">
                      {t(key)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Description complémentaire — affichée seulement si la clé n'est pas vide */}
            {t('about.ourCommitments.description') && (
              <p className="text-[13px] text-grayText leading-loose montserrat border-t border-borderColor pt-8">
                {t('about.ourCommitments.description')}
              </p>
            )}
          </div>

          {/* Colonne image — 5 colonnes avec double cadre décalé */}
          <div className="lg:col-span-5 relative">
            {/* Cadre décoratif doré décalé */}
            <div
              className="absolute border border-gold-accent/25"
              style={{ top: '24px', left: '-16px', right: '24px', bottom: '-24px' }}
              aria-hidden="true"
            />
            {/* Image portrait principale */}
            <div className="relative">
              <OptimizedBackgroundImage
                src="/images/about/about_section1_photo2.webp"
                alt="Peinture classique InRealArt"
                fill={true}
                className="w-full aspect-[3/4]"
                quality={90}
                priority={false}
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              {/* Surimpression titre sur l'image */}
              <div className="absolute inset-0 flex items-end p-8 bg-gradient-to-t from-black/60 via-transparent to-transparent">
                <h3 className="text-4xl md:text-5xl serif italic text-white leading-tight">
                  {t('about.ourCommitments.title')}
                </h3>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
