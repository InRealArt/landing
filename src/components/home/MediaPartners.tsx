'use client'

import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'

interface MediaPartner {
  src: string
  alt: string
  width: number
  height: number
  bgWhite?: boolean
}

const MEDIA_PARTNERS: MediaPartner[] = [
  { src: '/images/partners/biennale-Biennale-2026.webp', alt: 'Biennale',  width: 200, height: 120 },
  { src: '/images/partners/logo-art-thema.webp',         alt: 'Artthema',  width: 200, height: 120, bgWhite: true },
  // { src: '/images/partners/lea-douze.webp',              alt: 'LeaDouze',  width: 200, height: 120 },
  { src: '/images/partners/logitech.avif',               alt: 'Logitech',  width: 200, height: 120 },
]

// On multiplie suffisamment pour couvrir n'importe quelle largeur d'écran sans blanc
const REPEATED = [...MEDIA_PARTNERS, ...MEDIA_PARTNERS, ...MEDIA_PARTNERS, ...MEDIA_PARTNERS, ...MEDIA_PARTNERS, ...MEDIA_PARTNERS]

export default function MediaPartners() {
  const { t } = useTranslation()

  return (
    <section className="w-full bg-backgroundGrey border-y border-borderColor py-16 overflow-hidden">
      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4 mb-10">
        <p
          className="text-[10px] uppercase tracking-[0.4em] text-grayText text-center"
          suppressHydrationWarning
        >
          {t('home.mediaPartners.title')}
        </p>
      </div>

      {/* Bande scrollante */}
      <div className="relative flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
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
                className={`object-contain max-h-16 w-auto${partner.bgWhite ? ' bg-white px-2 py-1' : ''}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
