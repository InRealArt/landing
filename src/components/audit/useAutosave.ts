'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { saveDraft } from '@/actions/auditActions'
import type { AnswerValue, Answers } from '@/lib/audit/questionnaire'

export type SaveState = 'idle' | 'pending' | 'saving' | 'saved' | 'error' | 'invalid' | 'locked'

const DEBOUNCE_MS = 800

/** Réponses locales + sauvegarde automatique avec anti-rebond. `flush()` force l'enregistrement immédiat. */
export function useAutosave(token: string, initial: Answers, enabled: boolean) {
  const [answers, setAnswers] = useState<Answers>(initial)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const latest = useRef<Answers>(initial)
  const dirty = useRef(false)
  const inFlight = useRef<Promise<void> | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const flush = useCallback(async (): Promise<boolean> => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
    while (inFlight.current) await inFlight.current
    if (!dirty.current) return true
    dirty.current = false
    setSaveState('saving')
    const run = saveDraft(token, latest.current).then(
      (r) => (r.ok ? 'ok' : r.code === 'invalid' || r.code === 'locked' ? r.code : 'error') as 'ok' | 'invalid' | 'locked' | 'error',
      () => 'error' as const,
    )
    inFlight.current = run.then(() => undefined)
    const outcome = await run
    inFlight.current = null
    // Réponse refusée par validation : inutile de réessayer tel quel, la prochaine modification relancera l'envoi.
    if (outcome === 'error') dirty.current = true
    setSaveState(outcome === 'ok' ? (dirty.current ? 'pending' : 'saved') : outcome)
    return outcome === 'ok'
  }, [token])

  const update = useCallback(
    (key: string, value: AnswerValue | undefined) => {
      if (!enabled) return
      const next = { ...latest.current }
      if (value === undefined) delete next[key]
      else next[key] = value
      latest.current = next
      dirty.current = true
      setAnswers(next)
      setSaveState('pending')
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => void flush(), DEBOUNCE_MS)
    },
    [enabled, flush],
  )

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  // Enregistre dès que la page est masquée (un appel serveur est impossible pendant l'unload) et au retour du réseau.
  useEffect(() => {
    const onHidden = () => {
      if (document.visibilityState === 'hidden') void flush()
    }
    const onOnline = () => void flush()
    document.addEventListener('visibilitychange', onHidden)
    window.addEventListener('pagehide', onOnline)
    window.addEventListener('online', onOnline)
    return () => {
      document.removeEventListener('visibilitychange', onHidden)
      window.removeEventListener('pagehide', onOnline)
      window.removeEventListener('online', onOnline)
    }
  }, [flush])

  // Prévient la fermeture de l'onglet tant que des réponses ne sont pas enregistrées.
  useEffect(() => {
    if (saveState === 'idle' || saveState === 'saved' || saveState === 'invalid' || saveState === 'locked') return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [saveState])

  return { answers, update, saveState, flush }
}
