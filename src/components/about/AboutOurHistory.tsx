'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'
import { useTranslation } from '@/hooks/useTranslation'

const HISTORY_ITEMS = [
  {
    number: '01.',
    titleKey: 'about.ourHistory.title1',
    textKey: 'about.ourHistory.text1',
  },
  {
    number: '02.',
    titleKey: 'about.ourHistory.title2',
    textKey: 'about.ourHistory.text2',
  },
  {
    number: '03.',
    titleKey: 'about.ourHistory.title3',
    textKey: 'about.ourHistory.text3',
  },
] as const

export default function AboutOurHistory() {
  const { t } = useTranslation()

  return (
    <section className="bg-backgroundGrey border-y border-borderColor w-full py-24 lg:py-32">
      <div className="max-w-screen-2xl mx-auto px-10">

        {/* En-tête de section */}
        <div className="border-b border-borderColor pb-14 mb-20">
          <span className="section-number block mb-6">
            HISTOIRE
          </span>
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <h2 className="text-6xl md:text-7xl xl:text-8xl serif italic leading-none text-textColor">
                {t('about.ourHistory.title')}
              </h2>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              {/* Image paysage en accent éditorial */}
              <div className="relative overflow-hidden">
                <OptimizedBackgroundImage
                  src="/images/about/about_section3_photo1.webp"
                  alt="Œuvre InRealArt"
                  fill={true}
                  className="w-full aspect-[16/9]"
                  quality={80}
                  priority={false}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grille des 3 étapes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {HISTORY_ITEMS.map((item) => (
            <div
              key={item.number}
              className="border-t border-borderColor pt-12 md:pr-12 pb-12"
            >
              <h3 className="text-xs uppercase tracking-[0.4em] font-bold text-textColor mb-4 montserrat">
                {t(item.titleKey)}
              </h3>
              <p className="text-sm text-grayText leading-loose montserrat">
                {t(item.textKey)}
              </p>
            </div>
          ))}
        </div>

        {/* Deuxième image — format paysage pleine largeur, espacée en bas */}
        <div className="mt-20 relative overflow-hidden">
          <OptimizedBackgroundImage
            src="/images/about/about_section3_photo_2.webp"
            alt="Scène artistique InRealArt"
            fill={true}
            className="w-full aspect-[21/9]"
            quality={75}
            priority={false}
            sizes="100vw"
          />
        </div>

      </div>
    </section>
  )
}
