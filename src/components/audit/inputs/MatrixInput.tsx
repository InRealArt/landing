import { LIMITS, cellKey } from '@/lib/audit/questionnaire'
import type { InputProps } from './types'
import { fieldClass } from '../ui'

export default function MatrixInput({ q, answers, onChange, labelId, describedBy }: InputProps) {
  if (q.input.kind !== 'matrix') return null
  const { rows, columns, unit } = q.input
  const raw = answers[q.id]
  const cells = raw && !Array.isArray(raw) && typeof raw === 'object' ? (raw as Record<string, string>) : {}

  function set(key: string, value: string) {
    const next = { ...cells, [key]: value }
    if (!value) delete next[key]
    onChange(q.id, Object.keys(next).length ? next : undefined)
  }

  const gridCols = columns.length === 1 ? 'grid-cols-1' : 'grid-cols-3'

  return (
    <div role="group" aria-labelledby={labelId} aria-describedby={describedBy} className="space-y-1">
      {columns.length > 1 && (
        <div className="hidden items-end gap-4 pb-2 md:flex" aria-hidden="true">
          <span className="flex-1" />
          <div className={`grid w-96 ${gridCols} gap-3 text-center text-xs uppercase tracking-[0.25em] text-textColor/70`}>
            {columns.map((c) => <span key={c.id}>{c.label}</span>)}
          </div>
        </div>
      )}
      {rows.map((r) => (
        <div key={r.id} className="gap-4 border-t border-borderColor py-4 md:flex md:items-center">
          <p className="mb-3 text-base text-textColor md:mb-0 md:flex-1">{r.label}</p>
          <div className={`grid ${gridCols} gap-3 md:w-96`}>
            {columns.map((c) => {
              const id = `field-${q.id}-${cellKey(r.id, c.id)}`
              return (
                <div key={c.id}>
                  <label htmlFor={id} className={columns.length > 1 ? 'mb-1 block text-center text-xs text-textColor/70 md:hidden' : 'hidden'}>
                    {c.label}
                  </label>
                  <div className="relative">
                    <input
                      id={id}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      maxLength={LIMITS.matrixCell}
                      value={cells[cellKey(r.id, c.id)] ?? ''}
                      onChange={(e) => set(cellKey(r.id, c.id), e.target.value)}
                      aria-label={`${r.label}, ${c.label}`}
                      className={`${fieldClass} pr-9 text-right`}
                    />
                    <span aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-textColor/50">{unit}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
