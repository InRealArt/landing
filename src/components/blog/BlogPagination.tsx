'use client'

import { useQueryState, parseAsInteger } from 'nuqs'

interface BlogPaginationProps {
  totalPages: number
}

export default function BlogPagination({ totalPages }: BlogPaginationProps) {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center mt-16">
      <nav className="flex items-center gap-1" aria-label="Pagination">
        {page > 1 && (
          <button
            onClick={() => setPage(page - 1)}
            className="border border-[var(--border-light)] text-[var(--gray-text)] px-4 py-2 text-xs uppercase tracking-[0.2em] hover:border-[var(--ink-black)] hover:text-[var(--ink-black)] transition-colors"
            aria-label="Page précédente"
          >
            ←
          </button>
        )}

        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              aria-current={p === page ? 'page' : undefined}
              className={`px-4 py-2 text-xs uppercase tracking-[0.2em] transition-colors ${
                p === page
                  ? 'border border-[var(--ink-black)] bg-[var(--ink-black)] text-white'
                  : 'border border-[var(--border-light)] text-[var(--gray-text)] hover:border-[var(--ink-black)] hover:text-[var(--ink-black)]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {page < totalPages && (
          <button
            onClick={() => setPage(page + 1)}
            className="border border-[var(--border-light)] text-[var(--gray-text)] px-4 py-2 text-xs uppercase tracking-[0.2em] hover:border-[var(--ink-black)] hover:text-[var(--ink-black)] transition-colors"
            aria-label="Page suivante"
          >
            →
          </button>
        )}
      </nav>
    </div>
  )
}
