'use client'

import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

export default function ArtistsCEOWord() {
  const { t } = useTranslation()

  return (
    <section className="w-full">
      {/* Black band: quotes left + photo right */}
      <div className="bg-black text-white w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row">
          {/* Left: text — vertically centered */}
          <div className="flex flex-col justify-center gap-8 px-10 py-16 lg:px-20 lg:py-20 lg:w-1/2">
            <h2 className="font-cormorant text-4xl lg:text-5xl xl:text-6xl font-light italic leading-tight">
              {t('artists.ceoWord.headline')}
            </h2>
            <p className="font-bricolage text-[0.95rem] lg:text-base text-white/80 leading-relaxed">
              {t('artists.ceoWord.quoteMain')}
            </p>
            <p className="font-bricolage text-[0.8rem] lg:text-sm text-white/55 leading-relaxed">
              {t('artists.ceoWord.quoteSecondary')}
            </p>
            <a
              href="https://drive.google.com/file/d/1X1Vk-tUVnG0Kj-X_LFnV59otw4l4p1Nh/view"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Timothée Roy — voir le document (s'ouvre dans un nouvel onglet)"
              className="group inline-flex items-center gap-2 pt-2 font-montserrat text-[0.65rem] uppercase tracking-[0.3em] text-white/35 hover:text-white/70 transition-colors duration-300"
            >
              <ArrowUpRight
                className="w-3.5 h-3.5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.5}
              />
              Timothée Roy
            </a>
          </div>

          {/* Right: CEO photo — no crop, with vertical padding */}
          <div className="lg:w-1/2 flex items-center justify-center bg-black py-10 lg:py-12 px-6 lg:px-0">
            <div className="relative w-full max-w-md lg:max-w-lg">
              <Image
                src="/images/Tim.webp"
                alt="Timothée Roy — InRealArt"
                width={600}
                height={800}
                className="w-full h-auto object-contain"
                sizes="(max-width: 1024px) 90vw, 45vw"
              />
            </div>
          </div>
        </div>
      </div>

      {/* White band: manifesto — right-aligned to mirror photo column */}
      <div className="bg-[var(--background)] w-full">
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row">
          <div className="hidden lg:block lg:w-1/2" />
          <div className="lg:w-1/2 px-10 py-12 lg:px-20 lg:py-16">
            <p className="font-bricolage text-[0.95rem] lg:text-base text-[var(--foreground)] leading-relaxed">
              {t('artists.ceoWord.manifesto')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
