import Link from 'next/link'
import { getArtworksByUgcArtistProfileId } from '@/actions/presaleArtworkActions'
import { getServerTranslations } from '@/utils/serverTranslations'
import { getImageUrl } from '@/lib/cloufare/r2/url'

interface Props {
  ugcArtistProfileId: number
  landingArtistSlug: string
  artistDisplayName: string
  language: string
}

export default async function AgenceGalleryBridge({ ugcArtistProfileId, landingArtistSlug, artistDisplayName, language }: Props) {
  const artworks = await getArtworksByUgcArtistProfileId(ugcArtistProfileId, 3)
  if (artworks.length === 0) return null

  const { t } = getServerTranslations(language as 'fr' | 'en')

  return (
    <section className="border-b border-borderColor py-20 lg:py-28 bg-backgroundGrey">
      <div className="max-w-screen-2xl mx-auto px-10">

        <div className="flex items-end justify-between mb-12 pb-10 border-b border-borderColor">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs uppercase tracking-[0.5em] montserrat text-gold-accent">
                {t('agence.artists.detail.galleryBridgeNumber')}
              </span>
              <span className="h-px bg-borderColor w-8" />
              <span className="text-xs uppercase tracking-[0.35em] montserrat text-grayText">
                {t('agence.artists.detail.galleryBridgeLabel')}
              </span>
            </div>
            <h2 className="serif text-4xl font-light text-textColor">
              {t('agence.artists.detail.galleryBridgeTitle')}{' '}
              <em className="not-italic text-gold-accent">{artistDisplayName}</em>
            </h2>
          </div>
          <Link
            href={`/artists/${landingArtistSlug}`}
            className="hidden sm:inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] montserrat text-grayText hover:text-gold-accent transition-colors duration-200"
          >
            {t('agence.artists.detail.galleryBridgeViewAll')}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {artworks.map((artwork) => (
            <Link
              key={artwork.id}
              href={`/artists/${landingArtistSlug}#artworks`}
              className="group relative aspect-square overflow-hidden bg-cardBackground block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getImageUrl(artwork.imageUrl) ?? artwork.imageUrl}
                alt={typeof artwork.name === 'string' ? artwork.name : ''}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {artwork.isSold && (
                <span className="absolute top-3 left-3 text-xs uppercase tracking-[0.3em] montserrat bg-black/70 text-white px-2 py-1">
                  {t('artists.profile.sold')}
                </span>
              )}
              {artwork.price !== null && !artwork.isSold && (
                <span className="absolute bottom-3 right-3 text-xs uppercase tracking-[0.2em] montserrat bg-backgroundColor/90 text-textColor px-3 py-1.5">
                  {artwork.price.toLocaleString()} €
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="mt-8 sm:hidden">
          <Link
            href={`/artists/${landingArtistSlug}`}
            className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.3em] montserrat border border-borderColor text-textColor px-6 py-3 hover:border-gold-accent hover:text-gold-accent transition-colors duration-200"
          >
            {t('agence.artists.detail.galleryBridgeViewAll')}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

      </div>
    </section>
  )
}
