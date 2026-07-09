'use client'

import { useTranslation } from '@/hooks/useTranslation'
import type { UgcArtistProfileData } from '@/actions/ugcActions'
import AgenceArtistCard from './AgenceArtistCard'

interface Props {
  artists: UgcArtistProfileData[]
}

export default function AgenceArtistsPage({ artists }: Props) {
  const { t } = useTranslation()

  const countLabel = artists.length === 1
    ? `1 ${t('agence.artists.countLabel')}`
    : `${artists.length} ${t('agence.artists.countLabelPlural')}`

  return (
    <main className="min-h-screen bg-backgroundColor text-textColor">
      {/* Page header */}
      <section className="bg-backgroundGrey border-b border-borderColor py-20 lg:py-28">
        <div className="max-w-screen-2xl mx-auto px-10">
          <span className="section-number">{t('agence.artists.breadcrumb')}</span>
          <div className="mt-4 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h1 className="serif text-5xl md:text-6xl font-light leading-tight text-textColor">
              {t('agence.artists.title')}{' '}
              <em className="not-italic text-gold-accent">{t('agence.artists.titleAccent')}</em>
            </h1>
            <p className="text-sm montserrat text-grayText uppercase tracking-[0.3em]">
              {countLabel}
            </p>
          </div>
        </div>
      </section>

      {/* Artists grid */}
      <section className="py-20 lg:py-28">
        <div className="max-w-screen-2xl mx-auto px-10">
          {artists.length === 0 ? (
            <p className="text-grayText montserrat text-sm">{t('agence.artists.empty')}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artists.map((artist) => (
                <AgenceArtistCard
                  key={artist.id}
                  artist={artist}
                  viewProfileLabel={t('agence.artists.viewProfile')}
                  defaultTitleLabel={t('agence.artists.defaultTitle')}
                  audienceLabel={t('agence.artists.metrics.audience')}
                  engagementLabel={t('agence.artists.metrics.engagement')}
                  consumptionLabel={t('agence.artists.metrics.consumption')}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
