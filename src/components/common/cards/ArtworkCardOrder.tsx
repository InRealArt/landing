'use client'

import { useLanguageStore } from '@/store/languageStore'
import Link from 'next/link'
import { stringToSlug } from '@/utils/functions'
import SoldStatusBadge from '@/components/common/SoldStatusBadge'
import FirebaseImage from '@/components/common/FirebaseImage'

interface ArtworkCardOrderProps {
  image: {
    src: string
  }
  name: string
  price: number | null
  artistName: string
  isSold?: boolean
}

const ArtworkCardOrder = ({
  image,
  name,
  artistName,
  price,
  isSold = false,
}: ArtworkCardOrderProps) => {
  const { t } = useLanguageStore()
  const slug = stringToSlug(name)

  return (
    <Link
      href={`/artwork/${slug}`}
      className="group flex flex-col h-full rounded-xl overflow-hidden bg-cardBackground border border-borderColor shadow-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-purpleColor/10 transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purpleColor focus-visible:ring-offset-2 focus-visible:ring-offset-backgroundColor"
      aria-label={`${name} — ${artistName}`}
    >
      {/* Image area — fixed height so grid rows stay aligned across portrait/landscape/square artworks */}
      <div className="relative w-full h-64 overflow-hidden bg-cardBackground">
        {/* Inner padding creates a gallery-frame effect; object-contain ensures full artwork is visible */}
        <FirebaseImage
          src={image.src}
          alt={name}
          className="absolute inset-0 w-full h-full transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
        >
          <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/30 text-white text-sm bricolage-grotesque font-medium tracking-wide backdrop-blur-sm">
            {t('presale.artworks.button.seeDetail')}
            {/* Arrow icon */}
            <svg
              className="w-4 h-4 translate-x-0 group-hover:translate-x-0.5 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>

        {/* Sold badge — rendered on top of overlay */}
        <SoldStatusBadge isSold={isSold} />
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 px-4 py-4 gap-1">
        {/* Artwork name */}
        <h3 className="unbounded text-sm font-semibold text-textColor leading-snug line-clamp-2">
          {name}
        </h3>

        {/* Artist name */}
        <p className="bricolage-grotesque text-xs text-textColor/60 mt-0.5 truncate">
          {artistName}
        </p>

        {/* Price — pushed to bottom */}
        {price !== null && (
          <p className="mt-auto pt-3 unbounded text-sm font-bold text-purpleColor tracking-wide">
            {price.toLocaleString('fr-FR')}&thinsp;€
          </p>
        )}
      </div>
    </Link>
  )
}

export default ArtworkCardOrder
