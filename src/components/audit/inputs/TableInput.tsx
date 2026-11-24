import { useLayoutEffect, useRef } from 'react'
import { LIMITS } from '@/lib/audit/questionnaire'
import type { InputProps } from './types'
import { revealRow } from '../anim'
import { fieldClass, ghostButton } from '../ui'
import CharCount from './CharCount'

type Row = Record<string, string>

export default function TableInput({ q, answers, onChange, labelId, describedBy }: InputProps) {
  const raw = answers[q.id]
  const rows: Row[] = Array.isArray(raw) && raw.length > 0 && typeof raw[0] === 'object' ? (raw as Row[]) : [{}]
  const listRef = useRef<HTMLDivElement>(null)
  const previousCount = useRef(rows.length)

  // Anime la ligne qui vient d'être ajoutée.
  useLayoutEffect(() => {
    if (rows.length > previousCount.current) revealRow(listRef.current?.lastElementChild ?? null)
    previousCount.current = rows.length
  }, [rows.length])

  if (q.input.kind !== 'table') return null
  const { columns } = q.input

  function commit(next: Row[]) {
    onChange(q.id, next.some((r) => Object.values(r).some(Boolean)) || next.length > 1 ? next : undefined)
  }

  function setCell(index: number, col: string, value: string) {
    commit(rows.map((r, i) => (i === index ? { ...r, [col]: value } : r)))
  }

  const template = columns.length === 4 ? 'md:grid-cols-[5.5rem_1fr_11rem_8rem]' : 'md:grid-cols-4'

  return (
    <div role="group" aria-labelledby={labelId} aria-describedby={describedBy}>
      <div className={`mb-2 hidden gap-3 text-xs uppercase tracking-[0.2em] text-textColor/70 md:grid ${template}`} aria-hidden="true">
        {columns.map((c) => <span key={c.id}>{c.label}</span>)}
      </div>
      <div ref={listRef} className="space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="relative border border-borderColor bg-cardBackground/40 p-4 md:border-0 md:bg-transparent md:p-0">
            <div className={`grid grid-cols-2 gap-3 ${template}`}>
              {columns.map((c, ci) => {
                const id = `field-${q.id}-${i}-${c.id}`
                const wide = ci === 1 || ci === 2 ? 'col-span-2 md:col-span-1' : ''
                return (
                  <div key={c.id} className={wide}>
                    <label htmlFor={id} className="mb-1 block text-xs text-textColor/70 md:sr-only">{c.label}</label>
                    {c.options ? (
                      <select id={id} value={row[c.id] ?? ''} onChange={(e) => setCell(i, c.id, e.target.value)} className={fieldClass}>
                        <option value="">—</option>
                        {c.options.map((o) => <option key={o.id} value={o.label}>{o.label}</option>)}
                      </select>
                    ) : (
                      <input
                        id={id}
                        type="text"
                        inputMode={c.numeric ? 'numeric' : undefined}
                        autoComplete="off"
                        maxLength={LIMITS.cell}
                        value={row[c.id] ?? ''}
                        onChange={(e) => setCell(i, c.id, e.target.value)}
                        className={fieldClass}
                      />
                    )}
                    {!c.options && <CharCount length={(row[c.id] ?? '').length} max={LIMITS.cell} />}
                  </div>
                )
              })}
            </div>
            {rows.length > 1 && (
              <button
                type="button"
                onClick={() => commit(rows.filter((_, ri) => ri !== i))}
                aria-label={`Supprimer la ligne ${i + 1}`}
                className="mt-3 min-h-[44px] text-xs uppercase tracking-[0.2em] text-textColor/70 underline-offset-4 hover:text-gold-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent"
              >
                Supprimer
              </button>
            )}
          </div>
        ))}
      </div>
      {rows.length < 30 && (
        <button type="button" onClick={() => commit([...rows, {}])} className={`${ghostButton} mt-5`}>
          + Ajouter une ligne
        </button>
      )}
    </div>
  )
}
