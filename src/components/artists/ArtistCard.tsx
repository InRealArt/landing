'use client'

import Link from 'next/link'

type Props = {
  name: string
  role?: string
  countryName?: string | null
  imageUrl: string
  slug: string
  mediumTags?: string[]
  showFollowButton?: boolean
}

export default function ArtistCard ({ name, role = '', countryName, imageUrl, slug, mediumTags = [], showFollowButton = false }: Props) {
  return (
    <div className="rounded-xl overflow-hidden bg-cardBackground border border-white/10">
      <Link href={`/artists/${slug}`} className="block">
        <div
          className="h-52 md:h-64 w-full bg-center bg-cover"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      </Link>
      <div className="p-4">
        {countryName ? (
          <div className="text-xs text-white/60">{countryName}</div>
        ) : null}
        <div className="mt-1 text-white font-semibold">{name}</div>
        <div className="text-sm text-white/70">{mediumTags.length > 0 ? mediumTags.join(' | ') : role}</div>
        {showFollowButton ? (
          <div className="mt-3">
            <button className="px-4 py-1.5 text-sm rounded-full bg-white/10 text-white hover:bg-white/20 transition">Suivre +</button>
          </div>
        ) : null}
      </div>
    </div>
  )
}


