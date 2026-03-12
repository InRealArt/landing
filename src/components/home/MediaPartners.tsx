'use client'

import Image from 'next/image'
import { useLanguageStore } from '@/store/languageStore'

interface MediaPartner {
  src: string
  alt: string
  name: string
  width: number
  height: number
}

const MEDIA_PARTNERS: MediaPartner[] = [
  {
    src: '/images/partners/biennale-Biennale-2026.webp',
    alt: 'Biennale 2026',
    name: 'Biennale 2026',
    width: 200,
    height: 120,
  },
  {
    src: '/images/partners/DEMAIN_TV_Logo.webp',
    alt: 'Demain TV',
    name: 'Demain TV',
    width: 200,
    height: 120,
  },
  {
    src: '/images/partners/JobTalk_Tv_Sans_fond.webp',
    alt: 'JobTalk TV',
    name: 'JobTalk TV',
    width: 200,
    height: 120,
  },
  {
    src: '/images/partners/Logo-LMC.webp',
    alt: 'LMC',
    name: 'LMC',
    width: 200,
    height: 120,
  },
]

export default function MediaPartners() {
  const t = useLanguageStore(state => state.t)

  return (
    <section className="mt-12">
      <div className="text-center mb-8">
        <h2 className="text-5xl md:text-7xl serif italic leading-tight text-textColor mb-4">
          {t('home.mediaPartners.title')}
        </h2>
        {/* <p className="text-grayText text-lg">
          {t('home.mediaPartners.description')}
        </p> */}
      </div>

      <div className="flex gap-6 overflow-x-auto justify-center flex-wrap pb-4">
        {MEDIA_PARTNERS.map((partner) => (
          <div
            key={partner.name}
            className="p-4 border border-borderColor rounded-lg bg-cardBackground min-w-[200px] md:min-w-[250px] flex-shrink-0 flex flex-col items-center justify-center"
          >
            <div className="relative h-24 md:h-28 w-full rounded-lg overflow-hidden mb-4 bg-white flex items-center justify-center">
              <Image
                src={partner.src}
                alt={partner.alt}
                width={partner.width}
                height={partner.height}
                className="object-contain max-h-20 md:max-h-24 w-auto"
              />
            </div>
            <h3 className="text-textColor font-semibold text-base truncate w-full text-center">
              {partner.name}
            </h3>
          </div>
        ))}
      </div>
    </section>
  )
}
