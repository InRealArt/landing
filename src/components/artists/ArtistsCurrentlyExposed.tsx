'use client'

import Link from 'next/link'
import FirebaseImage from '@/components/common/FirebaseImage'
import { useTranslation } from '@/hooks/useTranslation'
import { CurrentlyExposedArtist } from '@/actions/artistActions'

interface Props {
  artists: CurrentlyExposedArtist[]
}

function ArtistCard({ artist }: { artist: CurrentlyExposedArtist }) {
  const fullName = `${artist.name} ${artist.surname}`.trim() || artist.pseudo
  return (
    <Link
      href={`/artists/${artist.slug}`}
      className="group relative overflow-hidden bg-[var(--background)] aspect-[3/4]"
      aria-label={fullName}
    >
      <FirebaseImage
        src={artist.imageUrl}
        alt={fullName}
        className="absolute inset-0 w-full h-full"
        imgClassName="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
      />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pt-10 pb-4">
        <p className="text-white font-bricolage text-xs uppercase tracking-[0.2em] leading-none font-semibold">
          {fullName}
        </p>
      </div>
    </Link>
  )
}

export default function ArtistsCurrentlyExposed({ artists }: Props) {
  const { t } = useTranslation()

  if (artists.length === 0) return null

  // Desktop: exactly as many columns as artists, capped at 4 — no orphan space.
  const desktopCols = Math.min(artists.length, 4)
  const desktopArtists = artists.slice(0, desktopCols)

  return (
    <section className="w-full bg-[var(--background-grey)] border-t border-[var(--border-color)]">
      <div className="max-w-screen-2xl mx-auto px-10 py-16 lg:px-20 lg:py-20">
        <div className="mb-10 flex flex-col gap-1">
          <p className="section-number !mb-0">
            {t('artists.currentlyExposed.eyebrow')}
          </p>
          <h2 className="font-cormorant text-3xl lg:text-4xl xl:text-5xl font-light italic leading-tight text-[var(--foreground)]">
            {t('artists.currentlyExposed.title')}
          </h2>
        </div>

        {/* Mobile: 2 colonnes fixes */}
        <div className="grid sm:hidden grid-cols-2 gap-4">
          {artists.map(a => <ArtistCard key={a.id} artist={a} />)}
        </div>

        {/* sm+: colonnes exactes selon le nombre d'artistes — aucun vide */}
        <div
          className="hidden sm:grid gap-4"
          style={{ gridTemplateColumns: `repeat(${desktopCols}, 1fr)` }}
        >
          {desktopArtists.map(a => <ArtistCard key={a.id} artist={a} />)}
        </div>
      </div>
    </section>
  )
}
