import { LIMITS, detailsKey } from '@/lib/audit/questionnaire'
import type { InputProps } from './types'
import { fieldClass, labelClass } from '../ui'
import CharCount from './CharCount'

export default function ChoiceInput({ q, answers, onChange, labelId, describedBy }: InputProps) {
  if (q.input.kind !== 'choice') return null
  const { multiple, options, textLabel } = q.input
  const raw = answers[q.id]
  const selected: string[] = Array.isArray(raw) ? (raw as string[]) : typeof raw === 'string' && raw ? [raw] : []
  const details = typeof answers[detailsKey(q)] === 'string' ? (answers[detailsKey(q)] as string) : ''

  function toggle(id: string) {
    if (!multiple) return onChange(q.id, id)
    const next = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
    onChange(q.id, next.length ? next : undefined)
  }

  return (
    <div className="space-y-8">
      {textLabel && (
        <div>
          <label htmlFor={`field-${detailsKey(q)}`} className={labelClass}>{textLabel}</label>
          <input
            id={`field-${detailsKey(q)}`}
            type="text"
            autoComplete="off"
            value={details}
            maxLength={LIMITS.details}
            onChange={(e) => onChange(detailsKey(q), e.target.value || undefined)}
            className={fieldClass}
          />
          <CharCount length={details.length} max={LIMITS.details} />
        </div>
      )}
      <div role={multiple ? 'group' : 'radiogroup'} aria-labelledby={labelId} aria-describedby={describedBy} className="grid gap-3 sm:grid-cols-2">
        {options.map((o) => {
          const checked = selected.includes(o.id)
          return (
            <label key={o.id} className="group relative block cursor-pointer">
              <input
                type={multiple ? 'checkbox' : 'radio'}
                name={`choice-${q.id}`}
                checked={checked}
                onChange={() => toggle(o.id)}
                className="peer sr-only"
              />
              <span className="flex min-h-[56px] items-center gap-4 border border-textColor/30 bg-cardBackground px-4 py-3 text-base text-textColor transition-all duration-200 group-hover:border-gold-accent peer-checked:border-gold-accent peer-checked:bg-gold-accent/10 peer-focus-visible:ring-2 peer-focus-visible:ring-gold-accent/70">
                <span
                  aria-hidden="true"
                  className={`flex h-5 w-5 shrink-0 items-center justify-center border border-textColor/50 transition-colors duration-200 ${multiple ? 'rounded-sm' : 'rounded-full'} ${checked ? 'border-gold-accent bg-gold-accent' : ''}`}
                >
                  {checked && (
                    <svg viewBox="0 0 12 12" className="h-3 w-3 text-black" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 6.5l2.5 2.5L10 3.5" />
                    </svg>
                  )}
                </span>
                {o.label}
              </span>
            </label>
          )
        })}
      </div>
    </div>
  )
}
