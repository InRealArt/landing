'use client'

import { useMemo } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import ArtistCard from './ArtistCard'
import { useQueryStates, parseAsInteger } from 'nuqs'
import { ArtistData } from '@/actions/artistActions'

const PAGE_SIZE = 16 // 4 colonnes x 4 lignes

interface ArtistCategoryGridProps {
  artists: ArtistData[]
}

export function ArtistCategoryGridSkeleton() {
  const skeletons = Array.from({ length: PAGE_SIZE })
  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10">
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 w-32 rounded bg-backgroundColor/10 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {skeletons.map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-cardBackground border border-white/10">
            <div className="h-52 md:h-64 w-full bg-backgroundColor/10 animate-pulse" />
            <div className="p-4 space-y-2">
              <div className="h-3 w-20 bg-backgroundColor/10 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-backgroundColor/10 rounded animate-pulse" />
              <div className="h-3 w-1/2 bg-backgroundColor/10 rounded animate-pulse" />
              <div className="pt-2">
                <div className="h-7 w-24 bg-backgroundColor/10 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function ArtistCategoryGrid({ artists }: ArtistCategoryGridProps) {
  const { t } = useLanguageStore()

  const [params, setParams] = useQueryStates({
    page: parseAsInteger.withDefault(1)
  })

  const totalPages = Math.max(1, Math.ceil(artists.length / PAGE_SIZE))
  const page = Math.min(params.page, totalPages)
  const start = (page - 1) * PAGE_SIZE
  const current = artists.slice(start, start + PAGE_SIZE)

  return (
    <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-10">
      <div className="flex items-center justify-end mb-6">
        <div className="text-textColor/60 text-sm">
          {artists.length} {t('artists.artistsFound') || 'artistes trouvés'}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {current.map(artist => (
          <ArtistCard
            key={artist.slug}
            name={artist.name}
            role={artist.artworkStyle || ''}
            countryName={artist.countryName}
            imageUrl={artist.imageUrl}
            slug={artist.slug}
            mediumTags={artist.mediumTags}
            showFollowButton={false}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setParams({ page: page - 1 })}
            className="px-3 py-2 rounded-md bg-backgroundColor/10 text-textColor disabled:opacity-40 hover:bg-backgroundColor/20 transition-colors"
          >
            {t('artists.previous') || 'Précédent'}
          </button>
          <div className="text-textColor/80">
            {t('artists.page') || 'Page'} {page} / {totalPages}
          </div>
          <button
            disabled={page === totalPages}
            onClick={() => setParams({ page: page + 1 })}
            className="px-3 py-2 rounded-md bg-backgroundColor/10 text-textColor disabled:opacity-40 hover:bg-backgroundColor/20 transition-colors"
          >
            {t('artists.next') || 'Suivant'}
          </button>
        </div>
      )}
    </section>
  )
}
