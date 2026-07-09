'use client'

import { useState } from 'react'

type Category = 'all' | 'entretien' | 'focus' | 'analyse'

interface Article {
  category: Exclude<Category, 'all'>
  badge: string
  title: string
  description: string
}

const ARTICLES: Article[] = [
  {
    category: 'entretien',
    badge: 'Grand Entretien',
    title: 'Marc Levinson\u00a0: \u00ab\u00a0L\u2019art est un flux vivant.\u00a0\u00bb',
    description:
      'Analyse profonde sur la mutation du marché de l\u2019art à l\u2019ère du tout-numérique.',
  },
  {
    category: 'focus',
    badge: 'Focus Artiste',
    title: 'Elena Rossi\u00a0: Sculpter le silence.',
    description:
      'Plongée dans l\u2019atelier milanais d\u2019une sculptrice qui défie la pesanteur.',
  },
  {
    category: 'analyse',
    badge: 'Analyse',
    title: 'Le futur des galeries physiques.',
    description: 'Comment les espaces d\u2019exposition s\u2019adaptent aux nouveaux comportements.',
  },
]

const FILTER_OPTIONS: { value: Category; label: string }[] = [
  { value: 'all', label: 'Tous les sujets' },
  { value: 'entretien', label: 'Entretiens' },
  { value: 'focus', label: 'Focus Artiste' },
  { value: 'analyse', label: 'Analyses' },
]

function ArticleCard({ article }: { article: Article }) {
  return (
    <article>
      {/* Image placeholder aspect-video */}
      <div className="aspect-video bg-gray-100 mb-4 sm:mb-6 overflow-hidden" />

      <span
        className="text-xs font-bold uppercase tracking-widest montserrat"
        style={{ color: 'var(--gold-accent)' }}
      >
        {article.badge}
      </span>

      <h3 className="serif text-xl sm:text-2xl my-3" style={{ color: 'var(--ink-black)' }}>
        {article.title}
      </h3>

      <p className="text-sm mb-6 montserrat" style={{ color: 'var(--gray-text)' }}>
        {article.description}
      </p>

      <a
        href="#"
        className="btn-mag inline-flex items-center min-h-[44px]"
        style={{ color: 'var(--ink-black)' }}
      >
        Lire l&apos;article
      </a>
    </article>
  )
}

export default function ArticlesFilter() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')

  const filtered =
    activeCategory === 'all'
      ? ARTICLES
      : ARTICLES.filter((a) => a.category === activeCategory)

  return (
    <section className="mb-16 md:mb-24 lg:mb-32">
      {/* Header with filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-8 md:mb-10">
        <div className="flex items-baseline gap-4 flex-grow min-w-0">
          <h2
            className="serif text-2xl sm:text-3xl font-bold whitespace-nowrap"
            style={{ color: 'var(--ink-black)' }}
          >
            Articles &amp; Entretiens
          </h2>
          <div className="h-px flex-grow" style={{ background: 'var(--border-light)' }} />
        </div>

        {/* Category select — full width on mobile, auto on sm+ */}
        <div className="relative flex-shrink-0 w-full sm:w-auto">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value as Category)}
            className="
              appearance-none montserrat w-full sm:w-auto
              border px-4 pr-10 rounded
              text-sm uppercase tracking-[0.1em]
              cursor-pointer focus:outline-none
              min-h-[44px]
            "
            style={{
              background: 'var(--canvas-bg)',
              borderColor: 'var(--border-light)',
              color: 'var(--ink-black)',
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%231a1a1a'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center',
              backgroundSize: '1rem',
            }}
          >
            {FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles grid: 1 col mobile → 2 col tablet → 3 col desktop */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
        {filtered.map((article) => (
          <ArticleCard key={article.title} article={article} />
        ))}
      </div>
    </section>
  )
}
