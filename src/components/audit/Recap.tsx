'use client'

import { useRef, useState } from 'react'
import { LIMITS, QUESTIONS, isAnswered, missingRequired, type Answers } from '@/lib/audit/questionnaire'
import { shake } from './anim'
import { summarize } from './answerSummary'
import { fieldClass, ghostButton, labelClass, primaryButton } from './ui'

interface Props {
  answers: Answers
  clientName: string
  readOnly?: boolean
  submitting?: boolean
  error?: string | null
  /** Date affichée près du consentement (la date réelle est fixée par le serveur). */
  dateLabel: string
  onEdit: (stepIndex: number) => void
  onSubmit: (signatureName: string) => void
}

export default function Recap({ answers, clientName, readOnly, submitting, error, dateLabel, onEdit, onSubmit }: Props) {
  const [accepted, setAccepted] = useState(false)
  const [name, setName] = useState(clientName)
  const [blockReason, setBlockReason] = useState<string | null>(null)
  const consentRef = useRef<HTMLDivElement>(null)
  const missing = missingRequired(answers)
  const canSubmit = missing.length === 0 && accepted && name.trim().length >= 2

  function submit() {
    if (!canSubmit) {
      setBlockReason(
        missing.length > 0
          ? `Il reste ${missing.length} question${missing.length > 1 ? 's' : ''} sans réponse : utilisez « Répondre » dans la liste ci-dessus.`
          : !accepted
            ? 'Cochez la case de consentement pour envoyer vos réponses.'
            : 'Saisissez votre nom et prénom pour envoyer vos réponses.',
      )
      return shake(consentRef.current)
    }
    setBlockReason(null)
    onSubmit(name.trim())
  }

  return (
    <div>
      <p data-anim className="mb-4 text-xs uppercase tracking-[0.35em] text-gold-accent">{readOnly ? 'Vos réponses' : 'Dernière étape'}</p>
      <h2 data-anim data-step-heading tabIndex={-1} className="serif mb-4 text-4xl font-light text-textColor outline-none sm:text-5xl">
        {readOnly ? 'Vos réponses envoyées' : 'Relire et envoyer'}
      </h2>
      {!readOnly && (
        <p data-anim className="mb-10 max-w-2xl text-base text-textColor/80">
          {missing.length > 0
            ? `Il reste ${missing.length} question${missing.length > 1 ? 's' : ''} sans réponse. Une estimation ou « ? » suffit.`
            : 'Tout est renseigné. Relisez, puis confirmez l’envoi : vous ne pourrez plus modifier vos réponses ensuite.'}
        </p>
      )}

      <ol data-anim className="mb-12 divide-y divide-borderColor border-y border-borderColor">
        {QUESTIONS.map((q, i) => {
          const lines = summarize(q, answers)
          const isMissing = !q.optional && !isAnswered(q, answers)
          return (
            <li key={q.id} className="grid gap-2 py-4 sm:grid-cols-[3rem_1fr_auto] sm:gap-4">
              <span className="unbounded text-sm text-gold-accent" aria-hidden="true">{String(q.n).padStart(2, '0')}</span>
              <div className="min-w-0">
                <p className="text-sm text-textColor/70">
                  <span className="sr-only">Question {q.n} : </span>
                  {q.title}
                </p>
                {lines.length > 0 && (
                  <div className="mt-1 space-y-0.5 text-base text-textColor">
                    {lines.slice(0, 4).map((l, li) => <p key={li} className="line-clamp-2 break-words">{l}</p>)}
                    {lines.length > 4 && <p className="text-sm text-textColor/60">… et {lines.length - 4} autre(s)</p>}
                  </div>
                )}
                {(isMissing || lines.length === 0) && (
                  <p className={`mt-1 text-sm ${isMissing ? 'border-l-2 border-gold-accent pl-3 text-textColor' : 'text-textColor/60'}`}>
                    {isMissing ? 'À compléter' : 'Non renseignée (facultatif)'}
                  </p>
                )}
              </div>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => onEdit(i)}
                  aria-label={`${isMissing ? 'Répondre à' : 'Modifier'} la question ${q.n}`}
                  className="min-h-[44px] justify-self-start px-1 text-xs uppercase tracking-[0.2em] text-textColor/70 underline-offset-4 hover:text-gold-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent sm:justify-self-end"
                >
                  {isMissing ? 'Répondre' : 'Modifier'}
                </button>
              )}
            </li>
          )
        })}
      </ol>

      {!readOnly && (
        <div ref={consentRef} data-anim className="border border-gold-accent/60 bg-cardBackground/40 p-5 sm:p-8">
          <label className="flex cursor-pointer items-start gap-4">
            <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="peer sr-only" />
            <span aria-hidden="true" className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center border border-textColor/50 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-gold-accent ${accepted ? 'border-gold-accent bg-gold-accent' : ''}`}>
              {accepted && (
                <svg viewBox="0 0 12 12" className="h-3.5 w-3.5 text-black" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 6.5l2.5 2.5L10 3.5" /></svg>
              )}
            </span>
            <span className="text-base leading-relaxed text-textColor">
              J’accepte que les informations fournies dans ce questionnaire soient utilisées pour la réalisation de mon audit de carrière et, le cas échéant, de mon
              accompagnement, dans les conditions de confidentialité indiquées en introduction.
            </span>
          </label>
          <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto]">
            <div>
              <label htmlFor="audit-signature" className={labelClass}>Nom et prénom</label>
              <input id="audit-signature" type="text" maxLength={LIMITS.signature} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={fieldClass} />
            </div>
            <p className="self-end pb-3 text-sm text-textColor/70">Date : {dateLabel}</p>
          </div>
          <p role="alert" className="mt-4 min-h-[1.5rem] text-sm text-textColor empty:hidden">{(error ?? blockReason) && <span className="border-l-2 border-gold-accent pl-3">{error ?? blockReason}</span>}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <button type="button" onClick={submit} disabled={submitting} aria-disabled={!canSubmit} className={`${primaryButton} ${canSubmit ? '' : 'opacity-60'}`}>
              {submitting ? 'Envoi en cours…' : 'Envoyer mes réponses'}
            </button>
            <button type="button" onClick={() => onEdit(0)} className={ghostButton}>Revenir au début</button>
          </div>
        </div>
      )}
    </div>
  )
}
