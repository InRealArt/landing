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
      className="group artwork-container block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#b89c72]"
      aria-label={`${name} — ${artistName}`}
    >
      {/* Image — 4/5 aspect ratio, light border, slow zoom on hover */}
      <div
        className="artwork-image relative w-full overflow-hidden bg-[#f9f9f9]"
        style={{ aspectRatio: '4/5' }}
      >
        <FirebaseImage
          src={image.src}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />

        {/* Subtle hover overlay with "see detail" label */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-end justify-start p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out"
        >
          <span className="text-[9px] uppercase tracking-[0.25em] text-white bg-black/40 px-3 py-1.5 backdrop-blur-[2px]">
            {t('presale.artworks.button.seeDetail')}
          </span>
        </div>

        <SoldStatusBadge isSold={isSold} />
      </div>

      {/* Card body — editorial style */}
      <div className="pt-4 pb-2">
        {/* Artist name — gold, tiny uppercase */}
        <p className="text-[9px] uppercase tracking-widest text-[#b89c72] font-medium mb-1 truncate">
          {artistName}
        </p>

        {/* Artwork title — serif italic */}
        <h3 className="serif text-xl italic font-light text-textColor leading-snug line-clamp-2">
          {name}
        </h3>

        {/* Price */}
        {price !== null && (
          <p className="mt-2 text-[11px] font-medium text-textColor/70 tracking-wide">
            {price.toLocaleString('fr-FR')}&thinsp;€
          </p>
        )}
      </div>
    </Link>
  )
}

export default ArtworkCardOrder
