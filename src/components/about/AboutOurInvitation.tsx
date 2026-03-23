'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'
import { useLanguageStore } from '@/store/languageStore'

export default function AboutOurInvitation() {
  const { t } = useLanguageStore()

  return (
    <section className="bg-backgroundGrey border-y border-borderColor w-full py-24 lg:py-32">
      <div className="max-w-screen-2xl mx-auto px-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* Image portrait — 5 colonnes, décalée artistiquement */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            {/* Cadre décoratif doré décalé vers le bas-droite */}
            <div
              className="absolute border border-gold-accent/20"
              style={{ top: '20px', left: '20px', right: '-20px', bottom: '-20px' }}
              aria-hidden="true"
            />
            <div className="relative">
              <OptimizedBackgroundImage
                src="/images/about/about_section2_photo1.webp"
                alt="Invitation InRealArt"
                fill={true}
                className="w-full aspect-[3/4]"
                quality={90}
                priority={false}
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>

          {/* Contenu textuel — 7 colonnes */}
          <div className="lg:col-span-7 space-y-10 order-1 lg:order-2">
            <div>
              <span className="section-number block mb-6">
                INVITATION
              </span>
              <h2 className="text-6xl md:text-7xl xl:text-8xl serif italic leading-none text-textColor mb-8">
                {t('about.ourInvitation.title')}
              </h2>
              <div className="w-12 h-px bg-gold-accent" />
            </div>

            <div className="space-y-6">
              <p className="text-[13px] text-grayText leading-loose montserrat">
                {t('about.ourInvitation.description1')}
              </p>
              {t('about.ourInvitation.description2') && (
                <p className="text-[13px] text-grayText leading-loose montserrat">
                  {t('about.ourInvitation.description2')}
                </p>
              )}
            </div>

            <div className="pt-4">
              <a href="/manifest" className="btn-cta">
                {t('buttons.readWhitepaper')}
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
