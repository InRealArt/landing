'use client'

import Link from 'next/link'
import Image from 'next/image'
import prestigeImage from '../../../public/images/marketplace/marketplace_prestige.webp'
import { useTranslation } from '@/hooks/useTranslation'

export default function Prestige() {
  const { t } = useTranslation()

  return (
    <section className="py-32 px-10 bg-backgroundGrey border-y border-borderColor">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-x-20 gap-y-16 items-center">

          {/* Left — text block */}
          <div>
            <span className="section-number">{t('marketplace.prestige.sectionLabel')}</span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl serif leading-tight mb-8">
              {t('marketplace.prestige.title')}{' '}
              <span className="italic text-gold-accent">{t('marketplace.prestige.titleAccent')}</span>
            </h2>
            <p className="text-sm text-grayText leading-loose max-w-lg mb-4">
              {t('marketplace.prestige.description')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/presale" className="btn-cta">
                {t('marketplace.prestige.cta')}
              </Link>
              <Link href="/loa-simulator" className="btn-cta">
                {t('marketplace.prestige.ctaSecondary')}
              </Link>
            </div>
          </div>

          {/* Right — portrait image with decorative frame offset */}
          <div className="relative">
            {/* Decorative offset frame behind the image */}
            <div
              className="absolute inset-0 border border-gold-accent/20 translate-x-4 translate-y-4 pointer-events-none"
              aria-hidden="true"
            />
            <div className="relative aspect-[4/5] overflow-hidden bg-soft-gray border border-border-light">
              <Image
                src={prestigeImage.src}
                alt={t('marketplace.prestige.imageAlt')}
                fill
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
