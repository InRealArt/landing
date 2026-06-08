'use client'

import { useState } from 'react'
import { submitAgenceBrief } from '@/actions/agenceBriefAction'
import { useLazyRecaptcha } from '@/hooks/useLazyRecaptcha'

interface Props {
  t: (key: string) => string
}

type Platform = 'instagram' | 'tiktok' | 'youtube' | 'linkedin' | 'print'
type ProjectType = 'ugc' | 'campaign' | 'partnership' | 'event'
type Vertical = 'luxury' | 'lifestyle' | 'cultural' | 'institutional' | 'other'
type Budget = 'under2k' | '2to5k' | '5to15k' | 'above15k'

type FormState = {
  company: string
  projectType: ProjectType | ''
  vertical: Vertical | ''
  platforms: Platform[]
  budget: Budget | ''
  deadline: string
  description: string
  email: string
  rgpd: boolean
}

const PLATFORMS: Platform[] = ['instagram', 'tiktok', 'youtube', 'linkedin', 'print']

export default function AgenceBriefForm({ t }: Props) {
  const { executeRecaptcha } = useLazyRecaptcha({ preloadOnInteraction: true, interactionTarget: 'form' })
  const [form, setForm] = useState<FormState>({
    company: '',
    projectType: '',
    vertical: '',
    platforms: [],
    budget: '',
    deadline: '',
    description: '',
    email: '',
    rgpd: false,
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function togglePlatform(p: Platform) {
    setForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter((x) => x !== p)
        : [...prev.platforms, p],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const recaptchaToken = await executeRecaptcha('agence_brief').catch(() => null) ?? undefined
    if (!form.projectType || !form.vertical || !form.budget) {
      setStatus('error')
      return
    }
    const result = await submitAgenceBrief({
      ...form,
      projectType: form.projectType,
      vertical: form.vertical,
      budget: form.budget,
      rgpd: true,
      recaptchaToken,
    })
    setStatus(result.success ? 'success' : 'error')
  }

  if (status === 'success') {
    return (
      <div className="text-center py-24">
        <div className="w-12 h-px bg-gold-accent mx-auto mb-8" />
        <h2 className="serif text-4xl md:text-5xl font-light text-textColor mb-4">
          {t('agence.brief.form.successTitle')}
        </h2>
        <p className="text-[12px] uppercase tracking-[0.25em] text-grayText montserrat max-w-md mx-auto">
          {t('agence.brief.form.successMessage')}
        </p>
      </div>
    )
  }

  const inputClass = 'w-full bg-backgroundColor border border-borderColor text-textColor text-[13px] montserrat px-4 py-3 focus:outline-none focus:border-gold-accent transition-colors duration-200 placeholder:text-grayText/50'
  const labelClass = 'text-[9px] uppercase tracking-[0.35em] text-grayText montserrat block mb-2'

  return (
    <form onSubmit={handleSubmit} className="space-y-10">

      {/* Company + email */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="brief-company" className={labelClass}>{t('agence.brief.form.company')}</label>
          <input
            id="brief-company"
            type="text"
            required
            placeholder={t('agence.brief.form.companyPlaceholder')}
            value={form.company}
            onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="brief-email" className={labelClass}>{t('agence.brief.form.email')}</label>
          <input
            id="brief-email"
            type="email"
            required
            placeholder={t('agence.brief.form.emailPlaceholder')}
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className={inputClass}
          />
        </div>
      </div>

      {/* Project type */}
      <div>
        <label className={labelClass}>{t('agence.brief.form.projectType')}</label>
        <div className="flex flex-wrap gap-3">
          {(['ugc', 'campaign', 'partnership', 'event'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setForm((p) => ({ ...p, projectType: type }))}
              className={[
                'text-[10px] uppercase tracking-[0.35em] montserrat px-5 py-2.5 border transition-colors duration-200',
                form.projectType === type
                  ? 'border-gold-accent bg-gold-accent text-white'
                  : 'border-borderColor text-grayText hover:border-gold-accent/50',
              ].join(' ')}
            >
              {t(`agence.brief.form.projectTypes.${type}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical + budget */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="brief-vertical" className={labelClass}>{t('agence.brief.form.vertical')}</label>
          <select
            id="brief-vertical"
            required
            value={form.vertical}
            onChange={(e) => setForm((p) => ({ ...p, vertical: e.target.value as Vertical }))}
            className={inputClass}
          >
            <option value="" disabled>—</option>
            {(['luxury', 'lifestyle', 'cultural', 'institutional', 'other'] as const).map((v) => (
              <option key={v} value={v}>{t(`agence.brief.form.verticals.${v}`)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="brief-budget" className={labelClass}>{t('agence.brief.form.budget')}</label>
          <select
            id="brief-budget"
            required
            value={form.budget}
            onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value as Budget }))}
            className={inputClass}
          >
            <option value="" disabled>—</option>
            {(['under2k', '2to5k', '5to15k', 'above15k'] as const).map((b) => (
              <option key={b} value={b}>{t(`agence.brief.form.budgetOptions.${b}`)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Platforms (multi-select) */}
      <div>
        <label className={labelClass}>{t('agence.brief.form.platforms')}</label>
        <div className="flex flex-wrap gap-3">
          {PLATFORMS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => togglePlatform(p)}
              className={[
                'text-[10px] uppercase tracking-[0.35em] montserrat px-5 py-2.5 border transition-colors duration-200',
                form.platforms.includes(p)
                  ? 'border-gold-accent bg-gold-accent text-white'
                  : 'border-borderColor text-grayText hover:border-gold-accent/50',
              ].join(' ')}
            >
              {t(`agence.brief.form.platformOptions.${p}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Deadline */}
      <div>
        <label htmlFor="brief-deadline" className={labelClass}>{t('agence.brief.form.deadline')}</label>
        <input
          id="brief-deadline"
          type="date"
          required
          value={form.deadline}
          onChange={(e) => setForm((p) => ({ ...p, deadline: e.target.value }))}
          className={inputClass}
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="brief-description" className={labelClass}>{t('agence.brief.form.description')}</label>
        <textarea
          id="brief-description"
          rows={5}
          maxLength={500}
          placeholder={t('agence.brief.form.descriptionPlaceholder')}
          value={form.description}
          onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          className={`${inputClass} resize-none`}
        />
        <p className="text-[10px] text-grayText/50 montserrat mt-1 text-right">
          {form.description.length}/500
        </p>
      </div>

      {/* RGPD */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          required
          checked={form.rgpd}
          onChange={(e) => setForm((p) => ({ ...p, rgpd: e.target.checked }))}
          className="mt-0.5 accent-gold-accent"
        />
        <span className="text-[11px] text-grayText montserrat leading-relaxed group-hover:text-textColor transition-colors duration-200">
          {t('agence.brief.form.rgpd')}
        </span>
      </label>

      {status === 'error' && (
        <p className="text-[11px] text-red-500 montserrat">
          {t('agence.brief.form.errorMessage')}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading' || !form.projectType || !form.vertical || !form.budget || form.platforms.length === 0 || !form.rgpd}
        className="inline-flex items-center gap-3 bg-gold-accent text-white px-10 py-4 text-[10px] uppercase tracking-[0.4em] montserrat hover:bg-gold-accent/80 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? '...' : t('agence.brief.form.submit')}
        {status !== 'loading' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

    </form>
  )
}
