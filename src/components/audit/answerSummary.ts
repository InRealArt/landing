import { cellKey, detailsKey, type Answers, type Question } from '@/lib/audit/questionnaire'

type Row = Record<string, string>

/** Résumé en une ou plusieurs lignes d'une réponse, pour l'écran de récapitulatif. */
export function summarize(q: Question, answers: Answers): string[] {
  const value = answers[q.id]
  const input = q.input
  switch (input.kind) {
    case 'text':
    case 'textarea':
      return typeof value === 'string' && value.trim() ? [value.trim()] : []
    case 'choice': {
      const ids = Array.isArray(value) ? (value as string[]) : typeof value === 'string' && value ? [value] : []
      const labels = ids.map((id) => input.options.find((o) => o.id === id)?.label ?? id)
      const details = answers[detailsKey(q)]
      return [labels.join(', '), typeof details === 'string' ? details.trim() : ''].filter(Boolean)
    }
    case 'table':
      return Array.isArray(value)
        ? (value as Row[])
            .map((row) => input.columns.map((c) => row[c.id]).filter(Boolean).join(' · '))
            .filter(Boolean)
        : []
    case 'matrix': {
      const cells = value && !Array.isArray(value) && typeof value === 'object' ? (value as Row) : {}
      return input.rows
        .map((r) => {
          const parts = input.columns
            .map((c) => {
              const v = cells[cellKey(r.id, c.id)]
              if (!v) return ''
              const shown = /^[\d\s.,]+$/.test(v) ? `${v} ${input.unit}` : v
              return input.columns.length > 1 ? `${c.label} : ${shown}` : shown
            })
            .filter(Boolean)
          return parts.length ? `${r.label} — ${parts.join(', ')}` : ''
        })
        .filter(Boolean)
    }
    case 'radioGrid': {
      const grid = value && !Array.isArray(value) && typeof value === 'object' ? (value as Row) : {}
      return input.rows
        .filter((r) => grid[r.id])
        .map((r) => `${r.label} — ${input.columns.find((c) => c.id === grid[r.id])?.label ?? grid[r.id]}`)
    }
  }
}
