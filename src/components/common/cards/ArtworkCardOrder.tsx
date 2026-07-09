'use client'

import { useTranslation } from '@/hooks/useTranslation'
import Link from 'next/link'
import { stringToSlug } from '@/utils/functions'
import FirebaseImage from '@/components/common/FirebaseImage'

export type ArtworkStatus = 'available' | 'sold' | 'on_demand'

interface ArtworkCardOrderProps {
  image: { src: string }
  name: string
  price: number | null
  artistName: string
  artistSlug?: string | null
  isSold?: boolean
  order?: number | null
}

// DA InRealArt : fond noir translucide + backdrop-blur, border fine, typographie micro-uppercase
// available → or (couleur signature)  |  sold → blanc/30 barré  |  on_demand → blanc/50 neutre
const STATUS_STYLES: Record<ArtworkStatus, string> = {
  available: 'bg-black/30 text-[#b89c72] border-[#b89c72]/40',
  sold:      'bg-black/30 text-white/30  border-white/10',
  on_demand: 'bg-black/30 text-white/60  border-white/20',
}

const ArtworkCardOrder = ({
  image,
  name,
  artistName,
  artistSlug,
  price,
  isSold = false,
}: ArtworkCardOrderProps) => {
  const { t } = useTranslation()
  const slug = stringToSlug(name)

  const status: ArtworkStatus = isSold ? 'sold' : price === null ? 'on_demand' : 'available'

  const statusLabel = {
    available: t('presale.filters.statusAvailable'),
    sold:      t('presale.filters.statusSold'),
    on_demand: t('presale.artworks.askPrice'),
  }[status]

  return (
    <Link
      href={`/artwork/${slug}`}
      className="group artwork-container block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#b89c72]"
      aria-label={`${name} — ${artistName}`}
    >
      {/* Image */}
      <div className="artwork-image relative w-full overflow-hidden bg-[#f9f9f9]" style={{ aspectRatio: '4/5' }}>
        <FirebaseImage
          src={image.src}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />

        {/* Hover overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-end justify-start p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
        >
          <span className="text-xs uppercase tracking-[0.25em] text-white bg-black/40 px-3 py-1.5 backdrop-blur-[2px]">
            {t('presale.artworks.button.seeDetail')}
          </span>
        </div>

        {/* Status badge */}
        <div className={`absolute top-3 right-3 z-10 px-2.5 py-[5px] text-[7px] uppercase tracking-[0.22em] border backdrop-blur-sm font-medium ${STATUS_STYLES[status]}`}>
          {statusLabel}
        </div>
      </div>

      {/* Card body */}
      <div className="pt-4 pb-2">
        {/* Artist name — links to artist profile */}
        {artistSlug ? (
          <Link
            href={`/artists/${artistSlug}`}
            onClick={e => e.stopPropagation()}
            className="text-xs uppercase tracking-widest text-[#b89c72] font-medium mb-1 truncate block hover:underline underline-offset-2"
          >
            {artistName}
          </Link>
        ) : (
          <p className="text-xs uppercase tracking-widest text-[#b89c72] font-medium mb-1 truncate">
            {artistName}
          </p>
        )}

        {/* Artwork title */}
        <h3 className="serif text-xl italic font-light text-textColor leading-snug line-clamp-2">
          {name}
        </h3>

        {/* Price or CTA */}
        <div className="mt-2">
          {status === 'available' && (
            <p className="text-sm font-medium text-textColor/70 tracking-wide">
              {price!.toLocaleString('fr-FR')}&thinsp;€
            </p>
          )}
          {status === 'on_demand' && (
            <p className="text-xs uppercase tracking-[0.2em] text-[#b89c72]/80">
              {t('presale.artworks.askPrice')}
            </p>
          )}
          {status === 'sold' && (
            <p className="text-xs uppercase tracking-[0.2em] text-textColor/30">
              {t('presale.filters.statusSold')}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default ArtworkCardOrder
