'use client'

import { useLanguageStore } from '@/store/languageStore'
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
        <path d="M23 7l-7 5 7 5V7z" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    titleKey: 'inartTvSection.jobCards.soundEngineer.title',
    descriptionKey: 'inartTvSection.jobCards.soundEngineer.description',
    badgeKey: 'inartTvSection.jobCards.soundEngineer.badge',
    icon: (
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
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
  },
  {
    titleKey: 'inartTvSection.jobCards.scenographer.title',
    descriptionKey: 'inartTvSection.jobCards.scenographer.description',
    badgeKey: 'inartTvSection.jobCards.scenographer.badge',
    icon: (
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
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
  },
  {
    titleKey: 'inartTvSection.jobCards.artDirector.title',
    descriptionKey: 'inartTvSection.jobCards.artDirector.description',
    badgeKey: 'inartTvSection.jobCards.artDirector.badge',
    icon: (
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
        <circle cx="12" cy="12" r="10" />
        <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94" />
      </svg>
    ),
  },
]

export default function InArtTvSection() {
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

      {/* Hero image placeholder — fluid via aspect-ratio instead of fixed height */}
      <div className="w-full aspect-video overflow-hidden mb-8 sm:mb-12" style={{ background: 'var(--border-light)' }} />

      {/* Job cards grid: 1 col mobile → 2 col tablet → 4 col desktop */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {JOB_CARDS.map((card, index) => (
          <JobCard key={index} {...card} />
        ))}
      </div>
    </section>
  )
}
