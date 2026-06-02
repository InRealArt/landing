'use client'

import { useState } from 'react'
import { submitMediaProduction } from '@/actions/mediaProductionAction'
import type { MediaProductionInput } from '@/actions/mediaProductionAction'
import { useLazyRecaptcha } from '@/hooks/useLazyRecaptcha'
import { useTranslation } from '@/hooks/useTranslation'

type ProjectType = 'portrait' | 'reportage' | 'campaign' | 'other'

type FormState = {
  name: string
  projectType: ProjectType | ''
  subject: string
  date: string
  email: string
  message: string
  rgpd: boolean
}

export default function MediaProductionForm() {
  const { t } = useTranslation()
  const { executeRecaptcha } = useLazyRecaptcha({ preloadOnInteraction: true, interactionTarget: 'form' })
  const [form, setForm] = useState<FormState>({
    name: '',
    projectType: '',
    subject: '',
    date: '',
    email: '',
    message: '',
    rgpd: false,
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.projectType || !form.rgpd) {
      setStatus('error')
      return
    }
    setStatus('loading')
    const recaptchaToken = await executeRecaptcha('media_production').catch(() => null) ?? undefined
    const payload: MediaProductionInput = {
      name: form.name,
      projectType: form.projectType,
      subject: form.subject,
      date: form.date,
      email: form.email,
      message: form.message,
      rgpd: true,
      recaptchaToken,
    }
    const result = await submitMediaProduction(payload)
    setStatus(result.success ? 'success' : 'error')
  }

  if (status === 'success') {
    return (
      <div className="text-center py-24">
        <div className="w-12 h-px bg-gold-accent mx-auto mb-8" />
        <h2 className="serif text-4xl md:text-5xl font-light text-textColor mb-4">
          {t('media.productionContact.form.successTitle')}
        </h2>
        <p className="text-[12px] uppercase tracking-[0.25em] text-grayText montserrat max-w-md mx-auto">
          {t('media.productionContact.form.successMessage')}
        </p>
      </div>
    )
  }

  const inputClass = 'w-full bg-transparent border border-borderColor text-textColor text-[13px] montserrat px-4 py-3 focus:outline-none focus:border-gold-accent transition-colors duration-200 placeholder:text-grayText/50'
  const labelClass = 'text-[9px] uppercase tracking-[0.35em] text-grayText montserrat block mb-2'
  const toggleBtn = (active: boolean) => [
    'text-[10px] uppercase tracking-[0.35em] montserrat px-5 py-2.5 border transition-colors duration-200',
    active
      ? 'border-gold-accent bg-gold-accent text-white'
      : 'border-borderColor text-grayText hover:border-gold-accent/50',
  ].join(' ')

  return (
    <form onSubmit={handleSubmit} className="space-y-10">

      {/* Name + email */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="prod-name" className={labelClass}>{t('media.productionContact.form.name')}</label>
          <input
            id="prod-name"
            type="text"
            required
            placeholder={t('media.productionContact.form.namePlaceholder')}
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="prod-email" className={labelClass}>{t('media.productionContact.form.email')}</label>
          <input
            id="prod-email"
            type="email"
            required
            placeholder={t('media.productionContact.form.emailPlaceholder')}
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className={inputClass}
          />
        </div>
      </div>

      {/* Project type */}
      <div role="group" aria-labelledby="prod-project-type-label">
        <label id="prod-project-type-label" className={labelClass}>{t('media.productionContact.form.projectType')}</label>
        <div className="flex flex-wrap gap-3">
          {(['portrait', 'reportage', 'campaign', 'other'] as const).map((type) => (
            <button
              key={type}
              type="button"
              aria-pressed={form.projectType === type}
              onClick={() => setForm((p) => ({ ...p, projectType: type }))}
              className={toggleBtn(form.projectType === type)}
            >
              {t(`media.productionContact.form.projectTypes.${type}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Subject + date */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="prod-subject" className={labelClass}>{t('media.productionContact.form.subject')}</label>
          <input
            id="prod-subject"
            type="text"
            required
            placeholder={t('media.productionContact.form.subjectPlaceholder')}
            value={form.subject}
            onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="prod-date" className={labelClass}>{t('media.productionContact.form.date')}</label>
          <input
            id="prod-date"
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            className={inputClass}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="prod-message" className={labelClass}>{t('media.productionContact.form.message')}</label>
        <textarea
          id="prod-message"
          rows={5}
          maxLength={1000}
          placeholder={t('media.productionContact.form.messagePlaceholder')}
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* RGPD */}
      <label htmlFor="prod-rgpd" className="flex items-start gap-3 cursor-pointer group">
        <input
          id="prod-rgpd"
          type="checkbox"
          required
          checked={form.rgpd}
          onChange={(e) => setForm((p) => ({ ...p, rgpd: e.target.checked }))}
          className="mt-0.5 accent-gold-accent"
        />
        <span className="text-[11px] text-grayText montserrat leading-relaxed group-hover:text-textColor transition-colors duration-200">
          {t('media.productionContact.form.rgpd')}
        </span>
      </label>

      {status === 'error' && (
        <p className="text-[11px] text-red-500 montserrat">
          {t('media.productionContact.form.errorMessage')}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading' || !form.projectType || !form.rgpd}
        className="inline-flex items-center gap-3 bg-gold-accent text-white px-10 py-4 text-[10px] uppercase tracking-[0.4em] montserrat hover:bg-gold-accent/80 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? '...' : t('media.productionContact.form.submit')}
        {status !== 'loading' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

    </form>
  )
}
