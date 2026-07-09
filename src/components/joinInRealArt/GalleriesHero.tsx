'use client'

import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'
import TranslatedText from '@/components/common/TranslatedText'

export default function GalleriesHero() {
  const { t } = useTranslation()

  return (
    <section className="bg-backgroundColor pt-32 sm:pt-40 pb-20 px-6 sm:px-10">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">

          {/* Colonne gauche — texte */}
          <div>
            <span className="block text-xs uppercase tracking-[0.4em] text-grayText mb-8">
              {t('joinInRealArt.galleries.hero.sectionLabel')}
            </span>

            <TranslatedText
              translationKey="joinInRealArt.galleries.hero.title"
              as="h1"
              className="serif text-5xl sm:text-6xl md:text-7xl xl:text-8xl leading-tight text-textColor [&_em]:not-italic [&_em]:text-[#b89c72]"
              allowHtml={true}
            />

            <p className="text-sm uppercase tracking-[0.3em] text-grayText mt-10 leading-relaxed max-w-lg">
              {t('joinInRealArt.galleries.hero.subtitle')}
            </p>

            <div className="mt-10">
              <a
                href="#howToJoinUs"
                className="btn-cta"
              >
                <span className="text-[0.6rem] uppercase tracking-[0.25em]">
                  {t('joinInRealArt.galleries.hero.button')}
                </span>
              </a>
            </div>
          </div>

          {/* Colonne droite — image */}
          <div className="relative overflow-hidden aspect-[16/10] group">
            <Image
              src="/images/joinInRealArt/artists/hero_joinInReal_artists.webp"
              alt="Galerie d'art partenaire InRealArt"
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

        </div>
      </div>
    </section>
  )
}
