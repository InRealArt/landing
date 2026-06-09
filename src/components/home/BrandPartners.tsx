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

const REPEATED = [...BRAND_PARTNERS, ...BRAND_PARTNERS, ...BRAND_PARTNERS, ...BRAND_PARTNERS, ...BRAND_PARTNERS, ...BRAND_PARTNERS]

export default function BrandPartners() {
  const { t } = useTranslation()

  return (
    <section className="w-full bg-backgroundGrey">
      {/* Gold separator at the very top */}
      <div className="h-px bg-gold-accent/30 w-full" />

      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4 pt-28 lg:pt-40 pb-10">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-7xl serif italic text-textColor break-words">
            {t('home.brandPartners.title')}
          </h2>
        </div>
      </div>

      {/* Bande scrollante */}
      <div className="relative flex overflow-hidden pb-28 lg:pb-40 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex gap-20 items-center animate-marquee shrink-0">
          {REPEATED.map((partner, idx) => (
            <div
              key={idx}
              className="shrink-0 flex items-center justify-center h-16 w-48"
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                width={partner.width}
                height={partner.height}
                className={`object-contain max-h-11 w-auto${partner.whiteBackground ? ' bg-white px-2 py-1' : ''}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
