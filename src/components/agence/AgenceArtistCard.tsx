'use client'

import Link from 'next/link'
import type { UgcArtistProfileData } from '@/actions/ugcActions'
import { getImageUrl } from '@/lib/cloufare/r2/url'

function displayName(artist: UgcArtistProfileData): string {
  if (artist.pseudo) return artist.pseudo
  const parts = [artist.name, artist.surname].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : '—'
}

function formatMetric(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—'
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`
  return value.toLocaleString()
}

const SOCIAL_LABELS: Record<string, string> = {
  INSTAGRAM: 'Instagram',
  TIKTOK: 'TikTok',
  YOUTUBE: 'YouTube',
  FACEBOOK: 'Facebook',
  TWITTER_X: 'X',
  LINKEDIN: 'LinkedIn',
  PINTEREST: 'Pinterest',
  SNAPCHAT: 'Snapchat',
  TWITCH: 'Twitch',
  REDDIT: 'Reddit',
  DISCORD: 'Discord',
  TELEGRAM: 'Telegram',
  THREADS: 'Threads',
  BEHANCE: 'Behance',
  DEVIANTART: 'DeviantArt',
  ARTSTATION: 'ArtStation',
}

interface Props {
  artist: UgcArtistProfileData
  viewProfileLabel: string
  defaultTitleLabel: string
  audienceLabel: string
  engagementLabel: string
  consumptionLabel: string
}

export default function AgenceArtistCard({
  artist,
  viewProfileLabel,
  defaultTitleLabel,
  audienceLabel,
  engagementLabel,
  consumptionLabel,
}: Props) {
  const name = displayName(artist)
  const href = `/agence/artists/${artist.slug}`
  const imageUrl = getImageUrl(artist.profileImageUrl)
  const metrics = artist.socialMetrics
  const networks = metrics?.socialNetworks ?? []

  return (
    <div className="group relative flex flex-col bg-cardBackground">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-backgroundGrey">
        {imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-backgroundGrey" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Tags */}
        {artist.tags.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            {artist.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[9px] uppercase tracking-[0.3em] text-white/90 montserrat bg-black/40 backdrop-blur-sm px-2 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 pt-5 pb-6 px-5 border border-t-0 border-borderColor">
        <p className="text-[10px] uppercase tracking-[0.35em] text-grayText montserrat mb-1">
          {artist.title ?? defaultTitleLabel}
        </p>
        <h3 className="serif text-xl font-light text-textColor leading-tight mb-3">
          {name}
        </h3>

        {/* Social networks */}
        {networks.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {networks.slice(0, 4).map((net) => (
              <span
                key={net}
                className="text-[9px] uppercase tracking-[0.2em] montserrat border border-borderColor text-grayText px-2 py-0.5"
              >
                {SOCIAL_LABELS[net] ?? net}
              </span>
            ))}
          </div>
        )}

        {/* Metrics */}
        {metrics && (
          <div className="grid grid-cols-3 gap-2 mb-5 pt-4 border-t border-borderColor">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-[0.25em] montserrat text-grayText">
                {audienceLabel}
              </span>
              <span className="serif text-base font-light text-textColor">
                {formatMetric(metrics.totalAudience)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-[0.25em] montserrat text-grayText">
                {engagementLabel}
              </span>
              <span className="serif text-base font-light text-textColor">
                {formatMetric(metrics.averageEngagement)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] uppercase tracking-[0.25em] montserrat text-grayText">
                {consumptionLabel}
              </span>
              <span className="serif text-base font-light text-textColor">
                {formatMetric(metrics.totalConsumption)}
              </span>
            </div>
          </div>
        )}

        {/* CTA */}
        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.35em] montserrat border border-gold-accent text-textColor px-4 py-2.5 hover:bg-gold-accent hover:text-white transition-all duration-300 self-start"
        >
          {viewProfileLabel}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
