'use client'

import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { submitAudit } from '@/actions/auditActions'
import type { AuditFileDto } from '@/lib/audit/files'
import { QUESTIONS, TOTAL_QUESTIONS, countAnswered, isAnswered, type Answers } from '@/lib/audit/questionnaire'
import { loadGsap } from '@/lib/gsap'
import { EASE, prefersReducedMotion } from './anim'
import AuditFrame from './AuditFrame'
import Done from './Done'
import ProgressBar from './ProgressBar'
import Recap from './Recap'
import SaveIndicator from './SaveIndicator'
import StepView, { type Step } from './StepView'
import { ghostButton, primaryButton } from './ui'
import { useAutosave } from './useAutosave'
import Welcome from './Welcome'

interface Props {
  token: string
  clientName: string
  auditorName: string | null
  dueLabel: string
  submitted: boolean
  initialAnswers: Answers
  initialFiles: AuditFileDto[]
}

type View = { kind: 'welcome' } | { kind: 'step'; index: number } | { kind: 'recap' } | { kind: 'review' } | { kind: 'done' }

const STEPS: Step[] = [...QUESTIONS.map((q): Step => ({ type: 'question', q })), { type: 'docs' }]

const ERROR_MESSAGES = {
  denied: 'Ce lien n’est plus valide. Contactez la personne qui vous l’a envoyé.',
  locked: 'Ce questionnaire a déjà été envoyé.',
  invalid: 'Une réponse est manquante, ou un champ dépasse la longueur autorisée. Vérifiez les questions signalées.',
  consent: 'Cochez la case de consentement et saisissez votre nom.',
  network: 'L’envoi a échoué. Vérifiez votre connexion et réessayez.',
} as const

function firstUnansweredIndex(answers: Answers): number {
  const i = QUESTIONS.findIndex((q) => !q.optional && !isAnswered(q, answers))
  return i === -1 ? STEPS.length - 1 : i
}

export default function AuditApp({ token, clientName, auditorName, dueLabel, submitted, initialAnswers, initialFiles }: Props) {
  const [locked, setLocked] = useState(submitted)
  const [justSubmitted, setJustSubmitted] = useState(false)
  const [view, setView] = useState<View>(submitted ? { kind: 'done' } : { kind: 'welcome' })
  const [files, setFiles] = useState(initialFiles)
  const [revealed, setRevealed] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [dateLabel] = useState(() => new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }))
  const { answers, update, saveState, flush } = useAutosave(token, initialAnswers, !locked)
  const stageRef = useRef<HTMLDivElement>(null)
  const dirRef = useRef<1 | -1>(1)
  const busyRef = useRef(false)
  const mountedRef = useRef(false)
  const [resumeCount] = useState(() => countAnswered(initialAnswers))

  const viewKey = view.kind === 'step' ? `step-${view.index}` : view.kind

  // Entrée du nouvel écran : éléments [data-anim] en cascade, depuis le côté de la navigation.
  useLayoutEffect(() => {
    let cancelled = false
    let ctx: { revert: () => void } | undefined
    const dir = dirRef.current
    void loadGsap()
      .then(({ gsap }) => {
        const stage = stageRef.current
        if (cancelled || !stage) return
        const targets = stage.querySelectorAll('[data-anim]')
        if (targets.length > 0 && !prefersReducedMotion()) {
          ctx = gsap.context(() => {
            gsap.fromTo(
              targets,
              { opacity: 0, x: dir * 36, y: 10 },
              { opacity: 1, x: 0, y: 0, duration: 0.7, ease: EASE, stagger: 0.07, clearProps: 'transform' },
            )
          }, stage)
        }
        setRevealed(true)
      })
      .catch(() => setRevealed(true))
    if (mountedRef.current) {
      stageRef.current?.querySelector<HTMLElement>('[data-step-heading]')?.focus({ preventScroll: true })
      window.scrollTo({ top: 0 })
    }
    mountedRef.current = true
    return () => {
      cancelled = true
      ctx?.revert()
    }
  }, [viewKey])

  const go = useCallback(async (next: View, dir: 1 | -1) => {
    if (busyRef.current) return
    busyRef.current = true
    dirRef.current = dir
    void flush()
    try {
      const stage = stageRef.current
      const targets = stage ? stage.querySelectorAll('[data-anim]') : null
      if (targets && targets.length > 0 && !prefersReducedMotion()) {
        try {
          const { gsap } = await loadGsap()
          await new Promise<void>((resolve) => {
            gsap.to(targets, { opacity: 0, x: -dir * 28, duration: 0.22, stagger: 0.015, ease: 'power2.in', onComplete: resolve })
          })
        } catch {
          // Animation indisponible : on navigue sans
        }
      }
      setView(next)
    } finally {
      busyRef.current = false
    }
  }, [flush])

  const stepIndex = view.kind === 'step' ? view.index : -1
  const goNext = useCallback(() => {
    if (view.kind === 'welcome') void go({ kind: 'step', index: firstUnansweredIndex(answers) }, 1)
    else if (view.kind === 'step') void go(view.index >= STEPS.length - 1 ? { kind: 'recap' } : { kind: 'step', index: view.index + 1 }, 1)
  }, [go, view, answers])

  const goBack = useCallback(() => {
    if (view.kind === 'step') void go(view.index === 0 ? { kind: 'welcome' } : { kind: 'step', index: view.index - 1 }, -1)
    else if (view.kind === 'recap') void go({ kind: 'step', index: STEPS.length - 1 }, -1)
    else if (view.kind === 'review') void go({ kind: 'done' }, -1)
  }, [go, view])

  const [inTextarea, setInTextarea] = useState(false)

  function onKeyDown(e: React.KeyboardEvent) {
    if (view.kind !== 'step' || e.key !== 'Enter' || e.nativeEvent.isComposing) return
    const el = e.target as HTMLElement
    const isField = el instanceof HTMLInputElement && ['text', 'email', 'url', 'radio', 'checkbox'].includes(el.type)
    const isTextarea = el instanceof HTMLTextAreaElement && (e.metaKey || e.ctrlKey)
    if (isField || isTextarea) {
      e.preventDefault()
      goNext()
    }
  }

  async function handleSubmit(signatureName: string) {
    setSubmitError(null)
    setSubmitting(true)
    try {
      await flush()
      const result = await submitAudit(token, answers, { accepted: true, signatureName })
      if (result.ok) {
        // État verrouillé avant toute animation : un envoi réussi ne peut plus afficher d'erreur.
        setLocked(true)
        setJustSubmitted(true)
        setSubmitting(false)
        void go({ kind: 'done' }, 1)
        return
      }
      setSubmitError(ERROR_MESSAGES[result.code])
    } catch {
      setSubmitError(ERROR_MESSAGES.network)
    }
    setSubmitting(false)
  }

  const progress = useMemo(() => {
    if (view.kind === 'welcome') return 0
    if (view.kind === 'step') return ((view.index + 1) / (STEPS.length + 1)) * 100
    return 100
  }, [view])

  const step = stepIndex >= 0 ? STEPS[stepIndex] : null
  // Questions obligatoires déjà dépassées et restées vides (navigation libre : simple rappel).
  const overdue = stepIndex > 0 ? QUESTIONS.slice(0, stepIndex).filter((q) => !q.optional && !isAnswered(q, answers)) : []
  const showNav = view.kind === 'step'

  return (
    <AuditFrame>
    <main className={view.kind === 'welcome' ? '' : 'mx-auto max-w-3xl px-4 pb-24 pt-8 sm:px-6 sm:pt-12'} onKeyDown={onKeyDown}
      onFocus={(e) => setInTextarea(e.target instanceof HTMLTextAreaElement)}
      onBlur={() => setInTextarea(false)}>
      {view.kind !== 'welcome' && view.kind !== 'done' && (
        <header className="mb-10">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <p className="text-xs uppercase tracking-[0.25em] text-textColor/70">
              {step ? (step.type === 'question' ? `Question ${step.q.n} sur ${TOTAL_QUESTIONS}` : 'Pièces jointes') : 'Récapitulatif'}
            </p>
            {overdue.length > 0 && (
              <button
                type="button"
                onClick={() => void go({ kind: 'step', index: QUESTIONS.indexOf(overdue[0]) }, -1)}
                className="min-h-[44px] border border-gold-accent/60 px-3 text-xs uppercase tracking-[0.2em] text-textColor hover:border-gold-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-accent"
              >
                {overdue.length} à compléter
              </button>
            )}
            {!locked && <SaveIndicator state={saveState} onRetry={() => void flush()} />}
          </div>
          <ProgressBar percent={progress} label="Progression du questionnaire" />
        </header>
      )}

      <div ref={stageRef} style={{ visibility: revealed ? 'visible' : 'hidden' }}>
        <div key={viewKey}>
          {view.kind === 'welcome' && (
            <Welcome clientName={clientName} auditorName={auditorName} dueLabel={dueLabel} answered={resumeCount} onStart={goNext} />
          )}
          {step && <StepView step={step} answers={answers} onChange={update} token={token} files={files} onFilesChange={setFiles} />}
          {(view.kind === 'recap' || view.kind === 'review') && (
            <Recap
              answers={answers}
              clientName={clientName}
              readOnly={view.kind === 'review'}
              submitting={submitting}
              error={submitError}
              dateLabel={dateLabel}
              onEdit={(index) => void go({ kind: 'step', index }, -1)}
              onSubmit={(name) => void handleSubmit(name)}
            />
          )}
          {view.kind === 'done' && <Done clientName={clientName} celebrateOnMount={justSubmitted} onReview={() => void go({ kind: 'review' }, 1)} />}
        </div>

        {(showNav || view.kind === 'recap' || view.kind === 'review') && (
          <nav aria-label="Navigation du questionnaire" data-anim className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-borderColor pt-6">
            <button type="button" onClick={goBack} className={ghostButton}>← Précédent</button>
            {showNav && (
              <div className="flex items-center gap-5">
                <span className="hidden text-xs uppercase tracking-[0.2em] text-textColor/60 md:inline">{inTextarea ? 'Ctrl / ⌘ + Entrée ↵' : 'Entrée ↵'}</span>
                <button type="button" onClick={goNext} className={primaryButton}>
                  {stepIndex === STEPS.length - 1 ? 'Relire et envoyer' : 'Suivant →'}
                </button>
              </div>
            )}
          </nav>
        )}
      </div>
    </main>
    </AuditFrame>
  )
}
