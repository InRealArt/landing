import type { InputProps } from './types'

export default function RadioGridInput({ q, answers, onChange, labelId, describedBy }: InputProps) {
  if (q.input.kind !== 'radioGrid') return null
  const { rows, columns } = q.input
  const raw = answers[q.id]
  const grid = raw && !Array.isArray(raw) && typeof raw === 'object' ? (raw as Record<string, string>) : {}

  function pick(row: string, col: string) {
    onChange(q.id, { ...grid, [row]: col })
  }

  return (
    <div role="group" aria-labelledby={labelId} aria-describedby={describedBy} className="divide-y divide-borderColor border-y border-borderColor">
      {rows.map((r) => (
        <fieldset key={r.id} className="gap-3 py-4 md:flex md:items-center md:justify-between md:gap-8">
          <legend className="float-left w-full pb-3 text-base text-textColor md:float-none md:w-auto md:max-w-md md:flex-1 md:pb-0">{r.label}</legend>
          <div className="grid clear-both grid-cols-3 gap-2 md:w-[26rem] md:shrink-0">
            {columns.map((c) => {
              const checked = grid[r.id] === c.id
              return (
                <label key={c.id} className="group block cursor-pointer">
                  <input type="radio" name={`${q.id}-${r.id}`} checked={checked} onChange={() => pick(r.id, c.id)} className="peer sr-only" />
                  <span className="flex min-h-[48px] items-center justify-center border border-textColor/30 bg-cardBackground px-2 text-center text-sm text-textColor transition-all duration-200 group-hover:border-gold-accent peer-checked:border-gold-accent peer-checked:bg-gold-accent peer-checked:font-semibold peer-checked:text-black peer-focus-visible:ring-2 peer-focus-visible:ring-gold-accent/70">
                    {c.label}
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>
      ))}
    </div>
  )
}
