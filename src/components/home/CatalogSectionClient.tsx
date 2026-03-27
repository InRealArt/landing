'use client'

import Link from 'next/link'
import { useLanguageStore } from '@/store/languageStore'
import FirebaseImage from '@/components/common/FirebaseImage'
import type { CatalogArtworkItem } from './CatalogSection'

interface CatalogSectionClientProps {
  artworks: CatalogArtworkItem[]
}

function formatPrice(price: number | null, isSold: boolean, language: string): string {
  if (isSold) {
    return language === 'fr' ? 'Vendu' : 'Sold'
  }
  if (price === null) {
    return language === 'fr' ? 'Prix sur demande' : 'Price on request'
  }
  // Format as French locale spacing: 4200 → "4 200 €"
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price)
}

function formatDimensions(width: number | null, height: number | null): string | null {
  if (width === null || height === null) return null
  return `${width}×${height} cm`
}

export default function CatalogSectionClient({ artworks }: CatalogSectionClientProps) {
  const t = useLanguageStore((state) => state.t)
  const language = useLanguageStore((state) => state.language)

  return (
    <section className="pt-24 sm:pt-32 md:pt-48 pb-12 px-4 sm:px-6 lg:px-10">
      <div className="max-w-screen-2xl mx-auto">

        {/* Section header */}
        <div className="border-b border-borderColor pb-12 mb-16">
          <span className="section-number" suppressHydrationWarning>
            {t('home.catalog.sectionNumber')}
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-8xl serif italic break-words" suppressHydrationWarning>
            {t('home.catalog.title')}{' '}
            <span className="not-italic text-gold-accent">
              {t('home.catalog.titleAccent')}
            </span>
          </h2>
          <p
            className="text-[11px] uppercase tracking-[0.3em] text-grayText mt-6 max-w-xl leading-relaxed"
            suppressHydrationWarning
          >
            {t('home.catalog.description')}
          </p>
        </div>

        {/* Artwork grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 sm:gap-y-16 md:gap-y-24">
          {artworks.map(artwork => {
            const dimensions = formatDimensions(artwork.width, artwork.height)
            const priceLabel = formatPrice(artwork.price, artwork.isSold, language)

            return (
              <Link
                key={artwork.id}
                href="/presale"
                className="artwork-container cursor-pointer block"
              >
                {/* Image */}
                <div className="artwork-image aspect-[4/5] mb-6">
                  <FirebaseImage
                    src={artwork.imageUrl}
                    alt={artwork.name}
                    className="w-full h-full"
                    imgClassName="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                  />
                </div>

                {/* Metadata */}
                <div className="flex flex-col space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-gold-accent font-medium">
                    {artwork.artistName}
                  </span>
                  <h3 className="serif text-2xl italic text-textColor">
                    {artwork.name}
                  </h3>
                  {dimensions && (
                    <p className="text-[10px] text-grayText uppercase tracking-widest">
                      {dimensions}
                    </p>
                  )}
                  <p
                    className={`text-[11px] font-medium mt-3 text-textColor${artwork.isSold ? ' opacity-50' : ''}`}
                    suppressHydrationWarning
                  >
                    {priceLabel}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-32">
          <Link href="/presale" className="btn-cta" suppressHydrationWarning>
            {t('home.catalog.cta')}
          </Link>
        </div>

      </div>
    </section>
  )
}
