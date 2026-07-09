'use client'

import Link from 'next/link'
import FirebaseImage from '@/components/common/FirebaseImage'

type Props = {
  name: string
  role?: string
  countryName?: string | null
  imageUrl: string
  slug: string
  mediumTags?: string[]
  showFollowButton?: boolean
}

export default function ArtistCard({
  name,
  role = '',
  countryName,
  imageUrl,
  slug,
  mediumTags = [],
  showFollowButton = false,
}: Props) {
  const medium = mediumTags.length > 0 ? mediumTags.join(' · ') : role

  return (
    <div data-anim="artist-card" className="group cursor-pointer">
      <Link href={`/artists/${slug}`} className="block">
        {/* Portrait container — grayscale by default, color on hover */}
        <div className="aspect-[3/4] overflow-hidden mb-6 bg-backgroundGrey border border-borderColor grayscale group-hover:grayscale-0 transition-all duration-1000">
          <FirebaseImage
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
          />
        </div>

        {/* Text block — centered below image */}
        <div className="text-center">
          {countryName ? (
            <p className="text-xs text-grayText uppercase tracking-widest bricolage-grotesque mb-1">
              {countryName}
            </p>
          ) : null}
          <h4 className="text-sm uppercase tracking-[0.3em] font-medium text-textColor bricolage-grotesque">
            {name}
          </h4>
          {medium ? (
            <p className="text-xs text-grayText uppercase tracking-widest mt-1.5 italic serif">
              {medium}
            </p>
          ) : null}
        </div>
      </Link>

      {showFollowButton ? (
        <div className="mt-3 text-center">
          <button className="btn-cta !mt-2">Suivre +</button>
        </div>
      ) : null}
    </div>
  )
}
