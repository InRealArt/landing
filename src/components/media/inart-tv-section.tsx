interface JobCardProps {
  icon: React.ReactNode
  title: string
  description: string
  badge: string
}

function JobCard({ icon, title, description, badge }: JobCardProps) {
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
        style={{ background: '#f0f4ff', color: '#0047FF' }}
      >
        {icon}
      </div>

      <h4
        className="font-bold text-base mb-3 montserrat"
        style={{ color: 'var(--ink-black)' }}
      >
        {title}
      </h4>

      <p
        className="text-sm leading-relaxed mb-4 montserrat"
        style={{ color: 'var(--gray-text)' }}
      >
        {description}
      </p>

      <span
        className="text-[9px] font-bold uppercase tracking-widest montserrat"
        style={{ color: '#0047FF' }}
      >
        {badge}
      </span>
    </div>
  )
}

const JOB_CARDS: JobCardProps[] = [
  {
    title: 'Réalisateur Vidéo',
    description: "Mettre en scène l\u2019invisible et sublimer le geste artistique.",
    badge: 'Image',
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
    title: 'Ingénieur du Son',
    description: "Sculpter l\u2019univers sonore pour une immersion totale.",
    badge: 'Audio',
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
    title: 'Scénographe TV',
    description: 'Concevoir des espaces de diffusion innovants et hybrides.',
    badge: 'Espace',
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
    title: 'Dir. Artistique',
    description: 'Garantir la cohérence visuelle de chaque format produit.',
    badge: 'Vision',
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
            In-Art TV
          </span>
          <h2
            className="serif text-[clamp(1.75rem,4vw,2.5rem)] font-bold"
            style={{ color: 'var(--ink-black)' }}
          >
            Les Métiers de la Création
          </h2>
        </div>
        <a
          href="mailto:teaminrealart@gmail.com"
          className="btn-action inline-flex items-center min-h-[44px] self-start sm:self-auto"
        >
          Faire votre demande TV
        </a>
      </div>

      {/* Hero image placeholder — fluid via aspect-ratio instead of fixed height */}
      <div className="w-full aspect-video overflow-hidden mb-8 sm:mb-12 bg-gray-100" />

      {/* Job cards grid: 1 col mobile → 2 col tablet → 4 col desktop */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {JOB_CARDS.map((card) => (
          <JobCard key={card.title} {...card} />
        ))}
      </div>
    </section>
  )
}
