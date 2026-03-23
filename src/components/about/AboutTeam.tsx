'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'
import { useLanguageStore } from '@/store/languageStore'
import TranslatedText from '@/components/common/TranslatedText'

const TEAM_PARAGRAPHS = [
  {
    titleKey: 'about.team.paragraph1',
    descKey: 'about.team.paragraph1Description',
  },
  {
    titleKey: 'about.team.paragraph2',
    descKey: 'about.team.paragraph2Description',
  },
  {
    titleKey: 'about.team.paragraph3',
    descKey: 'about.team.paragraph3Description',
  },
] as const

export default function AboutTeam() {
  const { t } = useLanguageStore()

  return (
    <section className="bg-backgroundColor w-full py-24 lg:py-32">
      <div className="max-w-screen-2xl mx-auto px-10">

        {/* En-tête */}
        <div className="border-b border-borderColor pb-14 mb-20">
          <span className="section-number block mb-6">
            ÉQUIPE
          </span>
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8">
              <TranslatedText
                translationKey="about.team.title"
                as="h2"
                className="text-6xl md:text-7xl xl:text-8xl serif italic leading-none text-textColor"
                allowHtml={true}
              />
            </div>
            <div className="lg:col-span-4 lg:col-start-9 flex justify-end items-end">
              <a href="/team" className="btn-cta">
                {t('about.team.buttonText')}
              </a>
            </div>
          </div>
        </div>

        {/* Image équipe pleine largeur avec gradient overlay */}
        <div className="relative mb-20 overflow-hidden">
          <OptimizedBackgroundImage
            src="/images/about/about_team_photo1.webp"
            alt="Équipe InRealArt"
            fill={true}
            className="w-full aspect-[21/9] lg:aspect-[3/1]"
            quality={90}
            priority={false}
            sizes="100vw"
          />
          {/* Gradient éditorial bas */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-backgroundColor/60 via-transparent to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* Grille des 3 membres — style expertise cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {TEAM_PARAGRAPHS.map(({ titleKey, descKey }) => (
            <div
              key={titleKey}
              className="border-t border-borderColor pt-12 md:pr-12 pb-12"
            >
              <div className="w-8 h-px bg-gold-accent mb-8" />
              <TranslatedText
                translationKey={titleKey}
                as="h3"
                className="montserrat font-semibold text-textColor text-base mb-4 leading-snug"
                allowHtml={true}
              />
              <TranslatedText
                translationKey={descKey}
                as="p"
                className="text-[13px] text-grayText leading-loose montserrat"
                allowHtml={true}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
