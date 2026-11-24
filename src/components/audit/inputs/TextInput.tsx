import type { InputProps } from './types'
import { LIMITS } from '@/lib/audit/questionnaire'
import { fieldClass } from '../ui'
import CharCount from './CharCount'

export default function TextInput({ q, answers, onChange, labelId, describedBy }: InputProps) {
  const value = typeof answers[q.id] === 'string' ? (answers[q.id] as string) : ''
  const common = {
    id: `field-${q.id}`,
    value,
    'aria-labelledby': labelId,
    'aria-describedby': describedBy,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(q.id, e.target.value || undefined),
  }
  const max = q.input.kind === 'textarea' ? LIMITS.textarea : LIMITS.text
  return (
    <>
      {q.input.kind === 'textarea' ? (
        <textarea {...common} maxLength={max} rows={q.input.rows ?? 5} placeholder={q.input.placeholder ?? 'Votre réponse (ou « ? » si vous ne savez pas)'} className={`${fieldClass} resize-y leading-relaxed`} />
      ) : (
        <input {...common} maxLength={max} type="text" autoComplete="off" placeholder={q.input.kind === 'text' ? q.input.placeholder : undefined} className={fieldClass} />
      )}
      <CharCount length={value.length} max={max} />
    </>
  )
}
