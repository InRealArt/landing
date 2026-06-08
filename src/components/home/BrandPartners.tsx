'use client'

import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'

interface BrandPartner {
  src: string
  alt: string
  width: number
  height: number
  whiteBackground?: boolean
}

const BRAND_PARTNERS: BrandPartner[] = [
  { src: '/images/partners/DEMAIN_TV_Logo.webp',       alt: 'Demain TV',  width: 200, height: 80, whiteBackground: true },
  { src: '/images/partners/JobTalk_Tv_Sans_fond.webp', alt: 'JobTalk TV', width: 200, height: 80 },
  { src: '/images/partners/Logo-LMC.webp',             alt: 'LMC',        width: 200, height: 80, whiteBackground: true },
]

export default function BrandPartners() {
  const { t } = useTranslation()

  return (
    <section className="w-full bg-backgroundGrey">
      {/* Gold separator at the very top */}
      <div className="h-px bg-gold-accent/30 w-full" />

      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4 py-28 lg:py-40">
        {/* Section header */}
        <div className="text-center mb-20">
          <span className="section-number">{t('home.brandPartners.eyebrow')}</span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl serif italic text-textColor break-words">
            {t('home.brandPartners.title')}
          </h2>
        </div>

        {/* Partner logos grid */}
        <ul
          role="list"
          className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10 sm:gap-x-16 lg:gap-x-20"
        >
          {BRAND_PARTNERS.map((partner) => (
            <li key={partner.alt}>
              <div className={partner.whiteBackground ? 'bg-white p-2 inline-flex' : ''}>
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={partner.width}
                  height={partner.height}
                  className="h-14 sm:h-20 w-auto object-contain"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
