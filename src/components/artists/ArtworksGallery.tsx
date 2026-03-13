'use client'

import ArtworkCard from '@/components/common/cards/ArtworkCardOrder'
import { useLanguageStore } from '@/store/languageStore'

interface Artwork {
  id: string
  name: string
  url: string
  price: number
  [key: string]: unknown
}

interface ArtworksGalleryProps {
  artworks: Artwork[]
  artistName: string
}

export default function ArtworksGallery({ artworks, artistName }: ArtworksGalleryProps) {
  const { t } = useLanguageStore()

  const artworkImages = artworks.map(artwork => ({
    id: artwork.id,
    name: artwork.name,
    price: artwork.price,
    image: { src: artwork.url },
    artistName,
  }))

  return (
    <section className="w-full mt-20">
      {/* Section header with border-bottom separator */}
      <div className="border-b border-borderColor pb-10 mb-16">
        <span className="section-number">{t('artistPage.artwork')}</span>
        <h2 className="text-5xl md:text-7xl serif italic font-light leading-tight">
          {t('artistPage.discover')}{' '}
          <span className="text-gold-accent whitespace-nowrap">{artistName}</span>
        </h2>
      </div>

      {/* Artwork grid — 3 columns with generous gutters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
        {artworkImages.map((item, index) => (
          <ArtworkCard key={`${item.name}-${index}`} {...item} />
        ))}
      </div>
    </section>
  )
}
