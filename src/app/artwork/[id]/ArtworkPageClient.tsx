'use client'

import { useEffect, useState, useMemo } from 'react'
import ArtworkImageWithHover from '@/components/common/ArtworkImageWithHover'
import ArtworkImageModal from '@/components/common/ArtworkImageModal'
import SoldStatusBadge from '@/components/common/SoldStatusBadge'
import { useTranslation } from '@/hooks/useTranslation'
import { generateCreativeWorkJsonLd, generateBreadcrumbJsonLd } from '@/utils/metadata'
import { ArtistInfoSection, ArtistArtworkCarousel } from '@/components/artists'
import { getImageUrl } from '@/lib/cloufare/r2/url'
import type { PresaleArtworkData } from '@/actions/presaleArtworkActions'
import type { TransformedArtistData } from '@/types/artist'

interface Props {
  artwork: PresaleArtworkData
  artist: TransformedArtistData | null
  relatedArtworks: PresaleArtworkData[]
}

export default function ArtworkPageClient({ artwork, artist, relatedArtworks }: Props) {
  const { t, language } = useTranslation()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [sanitizedDescription, setSanitizedDescription] = useState('')

  const lang = language.toLowerCase()

  // Resolve translated fields from embedded translations — no re-fetch on language switch
  const artworkName = artwork.translations?.name?.[lang] || artwork.name
  const rawDescription = artwork.translations?.description?.[lang] || artwork.description || ''

  // DOMPurify sanitization — client-only, cancellable, re-runs when language changes
  useEffect(() => {
    if (!rawDescription) { setSanitizedDescription(''); return }
    let cancelled = false
    import('dompurify').then(({ default: DOMPurify }) => {
      if (!cancelled) setSanitizedDescription(DOMPurify.sanitize(rawDescription))
    })
    return () => { cancelled = true }
  }, [rawDescription])

  const artworkImages = useMemo(() => {
    const images: string[] = [getImageUrl(artwork.imageUrl) ?? artwork.imageUrl]
    if (Array.isArray(artwork.mockupUrls)) {
      const extras = artwork.mockupUrls
        .map((m: any) => {
          const raw = typeof m === 'object' && m !== null ? m.url : m
          return raw ? (getImageUrl(raw) ?? raw) : null
        })
        .filter(Boolean) as string[]
      images.push(...extras)
    }
    return images
  }, [artwork.imageUrl, artwork.mockupUrls])

  const artistFullName = `${artwork.artist.name} ${artwork.artist.surname}`

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: generateCreativeWorkJsonLd(
            artworkName,
            sanitizedDescription || rawDescription || "Oeuvre d'art unique",
            artwork.imageUrl,
            artistFullName,
            undefined,
            undefined,
            artwork.width && artwork.height
              ? `${artwork.width} x ${artwork.height} cm`
              : undefined,
          ),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: generateBreadcrumbJsonLd([
            { name: 'Accueil', url: process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com' },
            { name: 'Oeuvres', url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'}/artworks` },
            { name: artworkName },
          ]),
        }}
      />

      <div className="container mx-auto px-4 py-8 pt-headerSize">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative rounded-lg overflow-hidden min-h-[400px] border border-borderColor shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purpleColor/30">
            <ArtworkImageWithHover
              src={artwork.imageUrl}
              alt={artworkName}
              className="w-full h-full"
              priority={true}
              onViewDetails={() => { setCurrentImageIndex(0); setIsModalOpen(true) }}
            />
            <SoldStatusBadge isSold={artwork.isSold} />
          </div>

          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="section-number">{t('artwork.collection')}</span>
                <h1 className="text-6xl md:text-8xl serif">
                  <span className="italic text-gold-accent">{artworkName}</span>
                </h1>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-grayText mb-2">
                {t('artwork.by')} <span className="text-textColor">{artistFullName}</span>
              </p>
              <p className="text-grayText mb-2">
                {t('artwork.dimensions')}:{' '}
                <span className="text-textColor">
                  {artwork.width && artwork.height
                    ? `${artwork.width} x ${artwork.height} cm`
                    : 'N/A'}
                </span>
              </p>
              <p className="text-grayText mb-2">
                {t('artwork.price')}:{' '}
                <span className="text-textColor font-semibold">
                  {artwork.price ? `${artwork.price.toLocaleString()} €` : t('artwork.onDemand')}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-textColor mb-4">{t('artwork.aboutArtwork')}</h2>
          <p
            className="text-grayText"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: sanitizedDescription || 'No description available' }}
          />
        </div>
      </div>

      {artist && <ArtistInfoSection artist={artist} />}

      {artist && relatedArtworks.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <ArtistArtworkCarousel
            artistName={artist.name}
            artworks={relatedArtworks.map(aw => ({
              id: aw.id.toString(),
              name: aw.translations?.name?.[lang] || aw.name,
              price: aw.price,
              image: { src: aw.imageUrl },
            }))}
          />
        </div>
      )}

      <ArtworkImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={artworkImages}
        currentIndex={currentImageIndex}
        onIndexChange={setCurrentImageIndex}
        artworkName={artworkName}
      />
    </>
  )
}
