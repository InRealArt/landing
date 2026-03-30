'use client'

import { useState, useCallback } from 'react'
import { useLanguageStore } from '@/store/languageStore'
import { z } from 'zod'

// ─── Zod schema ──────────────────────────────────────────────────────────────

const galleryContactSchema = z.object({
  galleryName: z.string().min(2),
  email: z.string().email(),
  profile: z.string().min(10),
})

type FormState = z.infer<typeof galleryContactSchema>
type FormErrors = Partial<Record<keyof FormState, string>>

export default function GalleriesContactSection() {
  const { t } = useLanguageStore()
  const fp = 'joinInRealArt.galleries.contactSection.form'

  // ─── Form state ────────────────────────────────────────────────────────────
  const [form, setForm] = useState<FormState>({ galleryName: '', email: '', profile: '' })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // touched: marks individual fields as dirty (after blur or after a failed submit)
  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    galleryName: false,
    email: false,
    profile: false,
  })

  // inline errors from Zod validation
  const [errors, setErrors] = useState<FormErrors>({})

  // ─── Field helpers ─────────────────────────────────────────────────────────
  const onChange = useCallback(
    (key: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }))
        // Clear error when user starts typing
        if (errors[key]) {
          setErrors((prev) => ({ ...prev, [key]: undefined }))
        }
      },
    [errors]
  )

  const onBlur = useCallback(
    (key: keyof FormState) => () =>
      setTouched((prev) => ({ ...prev, [key]: true })),
    []
  )

  // ─── Validate form ─────────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    const result = galleryContactSchema.safeParse(form)
    if (!result.success) {
      const fieldErrors: FormErrors = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof FormState
        if (!fieldErrors[field]) {
          // Map Zod errors to translatable keys
          const errorKey = err.code === 'invalid_string' && err.validation === 'email'
            ? 'validationErrors.email.invalid'
            : err.code === 'too_small'
              ? field === 'galleryName'
                ? 'validationErrors.galleryName.min'
                : field === 'profile'
                  ? 'validationErrors.profile.min'
                  : 'validationErrors.generic.invalidData'
              : 'validationErrors.generic.invalidData'
          fieldErrors[field] = t(errorKey)
        }
      })
      setErrors(fieldErrors)
      // Mark all fields as touched
      setTouched({
        galleryName: true,
        email: true,
        profile: true,
      })
      return false
    }
    return true
  }

  // ─── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/gallery-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('server error')
      setStatus('success')
      setForm({ galleryName: '', email: '', profile: '' })
      setTouched({ galleryName: false, email: false, profile: false })
      setErrors({})
    } catch {
      setStatus('error')
      setErrorMessage(t(`${fp}.error`))
    }
  }

  const inputClass =
    'w-full bg-transparent border-0 border-b border-borderColor py-3 text-[11px] uppercase tracking-[0.2em] text-textColor placeholder:text-grayText focus:outline-none focus:border-[#b89c72] transition-colors duration-200'

  return (
    <section id="contact" className="py-32 lg:py-40 px-6 sm:px-10 bg-backgroundColor">
      <div className="max-w-4xl mx-auto">

        {/* En-tête */}
        <div className="text-center mb-20 lg:mb-24">
          <span className="block text-[10px] uppercase tracking-[0.5em] text-grayText mb-6">
            {t('joinInRealArt.galleries.contactSection.sectionLabel')}
          </span>
          <h2 className="serif text-4xl sm:text-5xl italic text-textColor">
            {t('joinInRealArt.galleries.contactSection.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-20">

          {/* Colonne gauche — description + points */}
          <div className="space-y-8">
            <p className="text-[13px] leading-relaxed text-grayText font-light">
              {t('joinInRealArt.galleries.contactSection.description')}
            </p>

            <ul className="pt-6 space-y-4">
              {(['1', '2', '3'] as const).map((key) => (
                <li key={key} className="flex items-center gap-4">
                  <span className="w-2 h-2 bg-[#b89c72] rounded-full flex-shrink-0" aria-hidden="true" />
                  <span className="text-[10px] uppercase tracking-widest text-textColor">
                    {t(`joinInRealArt.galleries.contactSection.points.${key}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Colonne droite — formulaire */}
          <form onSubmit={handleSubmit} className="space-y-8" noValidate>
            <div>
              <label htmlFor="galleryName" className="sr-only">
                {t('joinInRealArt.galleries.contactSection.form.galleryName')}
              </label>
              <input
                id="galleryName"
                name="galleryName"
                type="text"
                value={form.galleryName}
                onChange={onChange('galleryName')}
                onBlur={onBlur('galleryName')}
                placeholder={t('joinInRealArt.galleries.contactSection.form.galleryName')}
                className={`${inputClass} ${errors.galleryName && touched.galleryName ? 'border-red-500' : ''}`}
              />
              {errors.galleryName && touched.galleryName && (
                <p className="mt-2 text-[10px] text-red-500 uppercase tracking-[0.2em]">
                  {errors.galleryName}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                {t('joinInRealArt.galleries.contactSection.form.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={onChange('email')}
                onBlur={onBlur('email')}
                placeholder={t('joinInRealArt.galleries.contactSection.form.email')}
                className={`${inputClass} ${errors.email && touched.email ? 'border-red-500' : ''}`}
              />
              {errors.email && touched.email && (
                <p className="mt-2 text-[10px] text-red-500 uppercase tracking-[0.2em]">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="profile" className="sr-only">
                {t('joinInRealArt.galleries.contactSection.form.profile')}
              </label>
              <textarea
                id="profile"
                name="profile"
                rows={4}
                value={form.profile}
                onChange={onChange('profile')}
                onBlur={onBlur('profile')}
                placeholder={t('joinInRealArt.galleries.contactSection.form.profile')}
                className={`${inputClass} resize-none ${errors.profile && touched.profile ? 'border-red-500' : ''}`}
              />
              {errors.profile && touched.profile && (
                <p className="mt-2 text-[10px] text-red-500 uppercase tracking-[0.2em]">
                  {errors.profile}
                </p>
              )}
            </div>

            {status === 'success' && (
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#b89c72]">
                {t(`${fp}.success`)}
              </p>
            )}
            {status === 'error' && (
              <p className="text-[11px] uppercase tracking-[0.2em] text-red-500">
                {errorMessage || t(`${fp}.error`)}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="btn-cta w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-[0.6rem] uppercase tracking-[0.25em]">
                {status === 'submitting'
                  ? t('common.submitting')
                  : t(`${fp}.submit`)}
              </span>
            </button>
          </form>

        </div>
      </div>
    </section>
  )
}
