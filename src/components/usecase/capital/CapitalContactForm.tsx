'use client'

import { useState } from 'react'
import { submitCapitalContact } from '@/actions/capitalContactAction'
import type { CapitalContactInput } from '@/actions/capitalContactAction'
import { useLazyRecaptcha } from '@/hooks/useLazyRecaptcha'
import { useTranslation } from '@/hooks/useTranslation'

type Sector = 'hotel' | 'real_estate' | 'sme' | 'large_group' | 'other'
type CompanySize = 's1' | 's2' | 's3' | 's4'
type Budget = 'b1' | 'b2' | 'b3' | 'b4'
type Need = 'leasing' | 'investment' | 'advisory' | 'other'

type FormState = {
  company: string
  sector: Sector | ''
  companySize: CompanySize | ''
  budget: Budget | ''
  need: Need | ''
  message: string
  email: string
  rgpd: boolean
}

export default function CapitalContactForm() {
  const { t } = useTranslation()
  const { executeRecaptcha } = useLazyRecaptcha({ preloadOnInteraction: true, interactionTarget: 'form' })
  const [form, setForm] = useState<FormState>({
    company: '',
    sector: '',
    companySize: '',
    budget: '',
    need: '',
    message: '',
    email: '',
    rgpd: false,
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.sector || !form.companySize || !form.budget || !form.need) {
      setStatus('error')
      return
    }
    setStatus('loading')
    const recaptchaToken = await executeRecaptcha('capital_contact').catch(() => null) ?? undefined
    const payload: CapitalContactInput = {
      company: form.company,
      sector: form.sector,
      companySize: form.companySize,
      budget: form.budget,
      need: form.need,
      message: form.message,
      email: form.email,
      rgpd: true,
      recaptchaToken,
    }
    const result = await submitCapitalContact(payload)
    setStatus(result.success ? 'success' : 'error')
  }

  if (status === 'success') {
    return (
      <div className="text-center py-24">
        <div className="w-12 h-px bg-gold-accent mx-auto mb-8" />
        <h2 className="serif text-4xl md:text-5xl font-light text-textColor mb-4">
          {t('usecase.capital.contact.form.successTitle')}
        </h2>
        <p className="text-[12px] uppercase tracking-[0.25em] text-grayText montserrat max-w-md mx-auto">
          {t('usecase.capital.contact.form.successMessage')}
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

      {/* Company + email */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="cap-company" className={labelClass}>{t('usecase.capital.contact.form.company')}</label>
          <input
            id="cap-company"
            type="text"
            required
            placeholder={t('usecase.capital.contact.form.companyPlaceholder')}
            value={form.company}
            onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="cap-email" className={labelClass}>{t('usecase.capital.contact.form.email')}</label>
          <input
            id="cap-email"
            type="email"
            required
            placeholder={t('usecase.capital.contact.form.emailPlaceholder')}
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            className={inputClass}
          />
        </div>
      </div>

      {/* Sector */}
      <div>
        <label className={labelClass}>{t('usecase.capital.contact.form.sector')}</label>
        <div className="flex flex-wrap gap-3">
          {(['hotel', 'real_estate', 'sme', 'large_group', 'other'] as const).map((s) => (
            <button key={s} type="button" aria-pressed={form.sector === s} onClick={() => setForm((p) => ({ ...p, sector: s }))} className={toggleBtn(form.sector === s)}>
              {t(`usecase.capital.contact.form.sectors.${s}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Company size + budget */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="cap-size" className={labelClass}>{t('usecase.capital.contact.form.companySize')}</label>
          <select
            id="cap-size"
            required
            value={form.companySize}
            onChange={(e) => setForm((p) => ({ ...p, companySize: e.target.value as CompanySize }))}
            className={inputClass}
          >
            <option value="" disabled>—</option>
            {(['s1', 's2', 's3', 's4'] as const).map((s) => (
              <option key={s} value={s}>{t(`usecase.capital.contact.form.sizes.${s}`)}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="cap-budget" className={labelClass}>{t('usecase.capital.contact.form.budget')}</label>
          <select
            id="cap-budget"
            required
            value={form.budget}
            onChange={(e) => setForm((p) => ({ ...p, budget: e.target.value as Budget }))}
            className={inputClass}
          >
            <option value="" disabled>—</option>
            {(['b1', 'b2', 'b3', 'b4'] as const).map((b) => (
              <option key={b} value={b}>{t(`usecase.capital.contact.form.budgets.${b}`)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Need */}
      <div>
        <label className={labelClass}>{t('usecase.capital.contact.form.need')}</label>
        <div className="flex flex-wrap gap-3">
          {(['leasing', 'investment', 'advisory', 'other'] as const).map((n) => (
            <button key={n} type="button" aria-pressed={form.need === n} onClick={() => setForm((p) => ({ ...p, need: n }))} className={toggleBtn(form.need === n)}>
              {t(`usecase.capital.contact.form.needs.${n}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="cap-message" className={labelClass}>{t('usecase.capital.contact.form.message')}</label>
        <textarea
          id="cap-message"
          rows={5}
          maxLength={1000}
          placeholder={t('usecase.capital.contact.form.messagePlaceholder')}
          value={form.message}
          onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
          className={`${inputClass} resize-none`}
        />
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
          {t('usecase.capital.contact.form.rgpd')}
        </span>
      </label>

      {status === 'error' && (
        <p className="text-[11px] text-red-500 montserrat">
          {t('usecase.capital.contact.form.errorMessage')}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading' || !form.sector || !form.companySize || !form.budget || !form.need || !form.rgpd}
        className="inline-flex items-center gap-3 bg-gold-accent text-white px-10 py-4 text-[10px] uppercase tracking-[0.4em] montserrat hover:bg-gold-accent/80 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? '...' : t('usecase.capital.contact.form.submit')}
        {status !== 'loading' && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

    </form>
  )
}
