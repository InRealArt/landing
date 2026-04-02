'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import {
  FormData,
  INITIAL_FORM,
  TOTAL_STEPS,
  validateStep,
  StepErrors,
} from './ArtistApplicationShared'
import ArtistApplicationStep1 from './ArtistApplicationStep1'
import ArtistApplicationStep2 from './ArtistApplicationStep2'
import ArtistApplicationStep3 from './ArtistApplicationStep3'
import ArtistApplicationStep4 from './ArtistApplicationStep4'
import ArtistValidationPopup from './ArtistValidationPopup'

export default function ArtistApplicationForm() {
  const { t } = useTranslation()
  const fp = 'joinInRealArt.artists.application.form'

  // ─── Form state ────────────────────────────────────────────────────────────
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [currentStep, setCurrentStep] = useState(1)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // touched: marks individual fields as dirty (after blur or after a failed advance attempt)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // popup: holds the list of error messages for the current failed advance attempt
  const [popupErrors, setPopupErrors] = useState<string[]>([])

  // ─── Field helpers ─────────────────────────────────────────────────────────
  const onChange = useCallback(
    (key: keyof FormData) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value })),
    []
  )

  const onBlur = useCallback(
    (key: keyof FormData) => () =>
      setTouched((prev) => ({ ...prev, [key]: true })),
    []
  )

  // ─── Step errors (live, always computed) ──────────────────────────────────
  const stepErrors: StepErrors = validateStep(currentStep, form)
  const isStepValid = Object.keys(stepErrors).length === 0

  // ─── Navigation ────────────────────────────────────────────────────────────
  function handleAdvance() {
    if (isStepValid) {
      setCurrentStep((s) => s + 1)
      setTouched({})
      setPopupErrors([])
      // Scroll to form top
      document.getElementById('candidature')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      // Mark all fields for the current step as touched so inline errors appear
      const allStepFields: Record<number, Array<keyof FormData>> = {
        1: ['fullName', 'email', 'phone', 'portfolioLinks'],
        2: ['careerDescription', 'stylesAndMediums', 'artisticMessage'],
        3: ['hasPhysicalWorks'],
        4: ['hasLegalRestrictions', 'willingToPromote'],
      }
      const fields = allStepFields[currentStep] ?? []
      setTouched((prev) => {
        const next = { ...prev }
        fields.forEach((f) => { next[f as string] = true })
        return next
      })
      // Show popup with all failing messages
      setPopupErrors(Object.values(stepErrors).filter(Boolean) as string[])
    }
  }

  function handleBack() {
    setCurrentStep((s) => s - 1)
    setTouched({})
    setPopupErrors([])
  }

  // ─── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (form.hasLegalRestrictions === null || !form.willingToPromote) return

    setStatus('submitting')
    setErrorMessage('')

    const payload: Record<string, unknown> = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      portfolioLinks: form.portfolioLinks.trim(),
      careerDescription: form.careerDescription.trim(),
      stylesAndMediums: form.stylesAndMediums.trim(),
      artisticMessage: form.artisticMessage.trim(),
      hasPhysicalWorks: form.hasPhysicalWorks,
      hasLegalRestrictions: form.hasLegalRestrictions,
      willingToPromote: form.willingToPromote,
    }
    if (form.artistName.trim()) payload.artistName = form.artistName.trim()

    const optionals: Array<keyof FormData> = [
      'physicalWorksCount', 'canProduceWorks', 'worksProducedPerYear',
      'worksSoldLastYear', 'averageSellingPrice', 'annualRevenue',
      'worksSoldAnnually', 'seasonalPatterns', 'directVsGalleryPercent',
      'salesChannels', 'marketplacePresence', 'newsletterSubscribers',
      'socialMediaFollowers', 'websiteUniqueVisitors',
    ]
    optionals.forEach((k) => {
      const v = form[k]
      if (typeof v === 'string' && v.trim()) payload[k] = v.trim()
    })

    try {
      const res = await fetch('/api/artist-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('server error')
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage(t(`${fp}.error`))
    }
  }

  // ─── Success screen ────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      <section id="candidature" className="py-28 lg:py-40 px-6 sm:px-10 bg-backgroundColor">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 mx-auto mb-12 flex items-center justify-center border border-borderColor">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              aria-hidden="true"
              style={{ color: 'var(--gold-accent)' }}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <span className="section-number block mb-6">
            {t(`${fp}.sectionLabel`)}
          </span>

          <h2 className="serif text-4xl sm:text-6xl italic text-textColor mb-4">
            {t(`${fp}.success.title`)}
          </h2>
          <p
            className="text-[11px] uppercase tracking-[0.25em] mb-10"
            style={{ color: 'var(--gold-accent)' }}
          >
            {t(`${fp}.success.subtitle`)}
          </p>
          <p className="text-[13px] text-grayText leading-relaxed max-w-lg mx-auto mb-14">
            {t(`${fp}.success.body`)}
          </p>

          <Link
            href="/"
            className="inline-block px-10 py-5 bg-textColor text-backgroundColor text-[0.65rem] uppercase tracking-[0.3em] transition-opacity duration-300 hover:opacity-75"
          >
            {t(`${fp}.success.cta`)}
          </Link>
        </div>
      </section>
    )
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <section id="candidature" className="py-28 lg:py-32 px-6 sm:px-10 bg-backgroundColor">
      <div className="max-w-4xl mx-auto">

        {/* Section header */}
        <div className="text-center mb-16 lg:mb-20">
          <span className="section-number">
            {t(`${fp}.sectionLabel`)}
          </span>
          <h2 className="serif text-4xl sm:text-5xl md:text-6xl italic text-textColor mb-6">
            {t(`${fp}.title`)}
          </h2>
          <p className="text-[11px] text-grayText uppercase tracking-[0.2em]">
            {t(`${fp}.intro`)}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 mb-20 lg:mb-24">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <button
                type="button"
                onClick={() => {
                  if (step < currentStep) {
                    setCurrentStep(step)
                    setTouched({})
                    setPopupErrors([])
                  }
                }}
                aria-current={currentStep === step ? 'step' : undefined}
                className="flex flex-col items-center gap-3 group focus-visible:outline-none"
              >
                <span
                  className="w-10 h-10 flex items-center justify-center text-[10px] uppercase tracking-widest transition-all duration-500 border-2"
                  style={
                    step === currentStep
                      ? { 
                          backgroundColor: 'var(--gold-accent)', 
                          borderColor: 'var(--gold-accent)',
                          color: '#fff',
                          boxShadow: '0 4px 15px rgba(184, 156, 114, 0.4)'
                        }
                      : step < currentStep
                      ? { 
                          backgroundColor: 'var(--textColor)', 
                          borderColor: 'var(--textColor)',
                          color: 'var(--backgroundColor)'
                        }
                      : { 
                          borderColor: 'var(--borderColor)', 
                          color: 'var(--grayText)',
                          backgroundColor: 'transparent'
                        }
                  }
                >
                  {step < currentStep ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                      <polyline points="2,6 5,9 10,3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  ) : (
                    <span>{step}</span>
                  )}
                </span>
              </button>
              {step < 4 && (
                <div
                  className="flex-1 h-px mx-3 transition-all duration-500"
                  style={{
                    backgroundColor: step < currentStep ? 'var(--gold-accent)' : 'var(--borderColor)',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {currentStep === 1 && (
            <ArtistApplicationStep1
              form={form}
              errors={stepErrors}
              touched={touched}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
          {currentStep === 2 && (
            <ArtistApplicationStep2
              form={form}
              errors={stepErrors}
              touched={touched}
              onChange={onChange}
              onBlur={onBlur}
            />
          )}
          {currentStep === 3 && (
            <ArtistApplicationStep3
              form={form}
              setForm={setForm}
              onChange={onChange}
            />
          )}
          {currentStep === 4 && (
            <ArtistApplicationStep4
              form={form}
              setForm={setForm}
              status={status}
              errorMessage={errorMessage}
            />
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-20 pt-12 border-t border-borderColor">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="group text-[9px] uppercase tracking-[0.3em] text-grayText hover:text-[#b89c72] transition-all duration-300 flex items-center gap-3"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-x-1">
                    <line x1="13" y1="7" x2="1" y2="7" stroke="currentColor" strokeWidth="1" />
                    <polyline points="5,3 1,7 5,11" stroke="currentColor" strokeWidth="1" fill="none" />
                  </svg>
                  {t(`${fp}.prev`)}
                </button>
              )}
            </div>

            <div>
              {currentStep < TOTAL_STEPS && (
                <button
                  type="button"
                  onClick={handleAdvance}
                  className="group inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-textColor hover:text-[#b89c72] transition-all duration-300"
                >
                  {t(`${fp}.next`)}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                    <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1" />
                    <polyline points="9,3 13,7 9,11" stroke="currentColor" strokeWidth="1" fill="none" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Validation popup — renders outside max-width container, fixed position */}
      {popupErrors.length > 0 && (
        <ArtistValidationPopup
          errors={popupErrors}
          onClose={() => setPopupErrors([])}
        />
      )}
    </section>
  )
}
