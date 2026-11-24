'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { verifyEmail } from '@/actions/auditActions'
import { shake } from './anim'
import AuditFrame from './AuditFrame'
import AuditHero from './AuditHero'
import { fieldClass, labelClass, primaryButton } from './ui'

const MESSAGES = {
  mismatch: 'Cette adresse ne correspond pas à celle de l’invitation.',
  rate_limited: 'Trop de tentatives. Réessayez dans quelques minutes.',
  denied: 'Accès impossible pour le moment. Réessayez plus tard.',
} as const

export default function EmailGate({ token }: { token: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await verifyEmail(token, email)
      if (result.ok) {
        router.refresh()
        return
      }
      setError(MESSAGES[result.code])
      shake(formRef.current)
    })
  }

  return (
    <AuditFrame>
      <main>
        <AuditHero
          titleLines={['Votre audit', <em key="c" className="text-gold-accent">de carrière</em>]}
          subtitle="Pour protéger vos réponses, confirmez l’adresse e-mail à laquelle ce lien vous a été envoyé."
        >
          <form ref={formRef} onSubmit={onSubmit} noValidate className="max-w-md">
            <label htmlFor="audit-email" className={labelClass}>Adresse e-mail</label>
            <input
              id="audit-email"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'audit-email-error' : undefined}
              className={fieldClass}
            />
            <p id="audit-email-error" role="alert" className="mt-3 min-h-[1.5rem] text-sm text-textColor">
              {error && <span className="border-l-2 border-gold-accent pl-3">{error}</span>}
            </p>
            <button type="submit" disabled={pending || email.trim().length < 3} className={`${primaryButton} group mt-6 w-full sm:w-auto`}>
              {pending ? 'Vérification…' : 'Accéder'}
              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">→</span>
            </button>
          </form>
        </AuditHero>
      </main>
    </AuditFrame>
  )
}
