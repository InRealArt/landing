'use client'

import Image from 'next/image'
import { useTranslation } from '@/hooks/useTranslation'
import TranslatedText from '@/components/common/TranslatedText'

interface JobCardProps {
  icon: React.ReactNode
  titleKey: string
  descriptionKey: string
  badgeKey: string
}

function JobCard({ icon, titleKey, descriptionKey, badgeKey }: JobCardProps) {
  return (
    <div
      className="rounded-xl p-5 sm:p-8 border transition-transform duration-300 hover:-translate-y-1"
      style={{
        background: 'var(--canvas-bg)',
        borderColor: 'var(--border-light)',
      }}
    >
      {/* Icon container */}
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 sm:mb-6"
        style={{ background: 'var(--border-light)', color: '#0047FF' }}
      >
        {icon}
      </div>

      <h4
        className="font-bold text-base mb-3 montserrat"
        style={{ color: 'var(--text)' }}
      >
        <TranslatedText translationKey={titleKey} />
      </h4>

      <p
        className="text-sm leading-relaxed mb-4 montserrat"
        style={{ color: 'var(--gray-text)' }}
      >
        <TranslatedText translationKey={descriptionKey} />
      </p>

      <span
        className="text-[9px] font-bold uppercase tracking-widest montserrat"
        style={{ color: '#0047FF' }}
      >
        <TranslatedText translationKey={badgeKey} />
      </span>
    </div>
  )
}

const JOB_CARDS: JobCardProps[] = [
  {
    titleKey: 'inartTvSection.jobCards.director.title',
    descriptionKey: 'inartTvSection.jobCards.director.description',
    badgeKey: 'inartTvSection.jobCards.director.badge',
    icon: (
      // Clapperboard — Portrait Vidéo Premium
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8H4z" />
        <path d="M4 11V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4H4z" />
        <line x1="12" y1="5" x2="12" y2="11" />
        <polyline points="4 7 8 5 12 7 16 5 20 7" />
      </svg>
    ),
  },
  {
    titleKey: 'inartTvSection.jobCards.soundEngineer.title',
    descriptionKey: 'inartTvSection.jobCards.soundEngineer.description',
    badgeKey: 'inartTvSection.jobCards.soundEngineer.badge',
    icon: (
      // Monitor/TV — Visibilité TV & Digitale
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
  {
    titleKey: 'inartTvSection.jobCards.scenographer.title',
    descriptionKey: 'inartTvSection.jobCards.scenographer.description',
    badgeKey: 'inartTvSection.jobCards.scenographer.badge',
    icon: (
      // Zap/Lightning — Accélérateur de Notoriété
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    titleKey: 'inartTvSection.jobCards.artDirector.title',
    descriptionKey: 'inartTvSection.jobCards.artDirector.description',
    badgeKey: 'inartTvSection.jobCards.artDirector.badge',
    icon: (
      // Smartphone — Contenus Multi-Formats
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
]

export default function InRealArtTvSection() {
  return (
    <section className="mb-12 sm:mb-16 lg:mb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div>
          <span
            className="text-[10px] font-bold uppercase tracking-[0.4em] block mb-2 montserrat"
            style={{ color: '#aaa' }}
          >
            <TranslatedText translationKey="inartTvSection.header.label" />
          </span>
          <h2
            className="serif text-[clamp(1.75rem,4vw,2.5rem)] font-bold"
            style={{ color: 'var(--text)' }}
          >
            <TranslatedText translationKey="inartTvSection.header.title" />
          </h2>
        </div>
        <a
          href="mailto:teaminrealart@gmail.com"
          className="btn-action inline-flex items-center min-h-[44px] self-start sm:self-auto"
        >
          <TranslatedText translationKey="inartTvSection.header.cta" />
        </a>
      </div>

      {/* TV images grid 2×2 */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-8 sm:mb-12">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="relative w-full aspect-video overflow-hidden rounded-lg">
            <Image
              src={`/images/media/tv/InRealArt_TV_${n}.webp`}
              alt={`InReal Art TV ${n}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 40vw"
            />
          </div>
        ))}
      </div>

      {/* Job cards grid: 1 col mobile → 2 col tablet → 4 col desktop */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {JOB_CARDS.map((card, index) => (
          <JobCard key={index} {...card} />
        ))}
      </div>
    </section>
  )
}
