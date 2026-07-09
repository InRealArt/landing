'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useTranslation } from '@/hooks/useTranslation'

type Props = {
  isOpen: boolean
  onClose: () => void
}

type FormData = {
  name: string
  medium: string
  city: string
  open: string
  tagline: string
  bio: string
  photo: string
}

const INITIAL_FORM: FormData = {
  name: '',
  medium: 'peinture',
  city: '',
  open: 'oui',
  tagline: '',
  bio: '',
  photo: '',
}

export default function ArtitudeModal({ isOpen, onClose }: Props) {
  const { t } = useTranslation()
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setForm(INITIAL_FORM)
      onClose()
    }, 2500)
  }

  const inputClass = "w-full bg-transparent py-3 pr-4 text-textColor placeholder-grayText montserrat text-sm font-light focus:outline-none"
  const fieldClass = "relative border-b border-borderColor focus-within:border-gold-accent transition-colors duration-300 mb-6"
  const labelClass = "montserrat text-xs uppercase tracking-[0.25em] text-grayText mb-1 block"

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-backgroundColor/60 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full max-w-3xl bg-backgroundColor border border-borderColor shadow-2xl overflow-hidden max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-backgroundColor/80 backdrop-blur-md border border-borderColor text-textColor shadow-sm hover:bg-textColor hover:text-backgroundColor transition-all duration-300 group active:scale-95 md:right-6 md:top-6"
          aria-label="Fermer"
        >
          <X size={20} strokeWidth={1.5} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[480px]">

          {/* Left — visual */}
          <div className="relative bg-black border-b md:border-b-0 md:border-r border-borderColor overflow-hidden min-h-[200px] md:min-h-0 flex flex-col justify-end p-8">
            {/* Full-bleed image */}
            <div className="absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/artists/hero_artists.webp"
                alt={t('artistsStudio.modal.imageAlt')}
                className="w-full h-full object-cover object-center"
              />
            </div>
            {/* Vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.65) 100%)' }}
              aria-hidden="true"
            />
            {/* Gradient bas */}
            <div
              className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)' }}
              aria-hidden="true"
            />
            {/* Cadres dorés */}
            <div className="absolute inset-4 border border-gold-accent/20 pointer-events-none" aria-hidden="true" />
            <div className="absolute inset-7 border border-gold-accent/10 pointer-events-none" aria-hidden="true" />
            {/* Ligne verticale */}
            <div className="absolute left-4 top-1/4 bottom-1/4 w-px bg-gold-accent/40" aria-hidden="true" />

            <div className="relative z-10">
              <span className="montserrat text-xs uppercase tracking-[0.35em] text-gold-accent block mb-4">
                {t('artistsStudio.modal.eyebrow')}
              </span>
              <h2 className="serif italic text-3xl text-textColor leading-tight mb-4">
                {t('artistsStudio.modal.title')}{' '}
                <em className="not-italic text-gold-accent">{t('artistsStudio.modal.titleAccent')}</em>{' '}
                {t('artistsStudio.modal.titleSuffix')}
              </h2>
              <p className="montserrat text-sm text-grayText leading-loose font-light">
                {t('artistsStudio.modal.description')}
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="p-8 lg:p-10 flex flex-col justify-center overflow-y-auto">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center gap-5">
                <div className="w-14 h-14 border border-gold-accent flex items-center justify-center">
                  <svg className="w-6 h-6 text-gold-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="serif italic text-2xl text-textColor">{t('artistsStudio.modal.successTitle')}</h3>
                <p className="montserrat text-sm text-grayText leading-loose font-light">
                  {t('artistsStudio.modal.successDescription')}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-0">
                <div className={fieldClass}>
                  <label className={labelClass}>{t('artistsStudio.modal.fieldName')} *</label>
                  <input
                    type="text"
                    required
                    placeholder={t('artistsStudio.modal.placeholderName')}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className={fieldClass}>
                    <label className={labelClass}>{t('artistsStudio.modal.fieldMedium')} *</label>
                    <select
                      required
                      value={form.medium}
                      onChange={(e) => setForm({ ...form, medium: e.target.value })}
                      className={inputClass + ' cursor-pointer'}
                    >
                      <option value="peinture">{t('artistsStudio.modal.optionPeinture')}</option>
                      <option value="sculpture">{t('artistsStudio.modal.optionSculpture')}</option>
                      <option value="photographie">{t('artistsStudio.modal.optionPhotographie')}</option>
                      <option value="dessin">{t('artistsStudio.modal.optionDessin')}</option>
                      <option value="autre">{t('artistsStudio.modal.optionAutre')}</option>
                    </select>
                  </div>
                  <div className={fieldClass}>
                    <label className={labelClass}>{t('artistsStudio.modal.fieldCity')} *</label>
                    <input
                      type="text"
                      required
                      placeholder={t('artistsStudio.modal.placeholderCity')}
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className={fieldClass}>
                  <label className={labelClass}>{t('artistsStudio.modal.fieldStatus')} *</label>
                  <select
                    required
                    value={form.open}
                    onChange={(e) => setForm({ ...form, open: e.target.value })}
                    className={inputClass + ' cursor-pointer'}
                  >
                    <option value="oui">{t('artistsStudio.modal.optionOpen')}</option>
                    <option value="non">{t('artistsStudio.modal.optionAppointment')}</option>
                  </select>
                </div>

                <div className={fieldClass}>
                  <label className={labelClass}>{t('artistsStudio.modal.fieldTagline')} *</label>
                  <input
                    type="text"
                    required
                    placeholder={t('artistsStudio.modal.placeholderTagline')}
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className={fieldClass}>
                  <label className={labelClass}>{t('artistsStudio.modal.fieldBio')}</label>
                  <textarea
                    rows={2}
                    placeholder={t('artistsStudio.modal.placeholderBio')}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className={inputClass + ' resize-none'}
                  />
                </div>

                <div className={fieldClass}>
                  <label className={labelClass}>{t('artistsStudio.modal.fieldPhoto')}</label>
                  <input
                    type="url"
                    placeholder={t('artistsStudio.modal.placeholderPhoto')}
                    value={form.photo}
                    onChange={(e) => setForm({ ...form, photo: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="flex items-center gap-6 mt-2">
                  <button
                    type="submit"
                    className="btn-cta border-textColor hover:bg-textColor hover:text-backgroundColor"
                  >
                    {t('artistsStudio.modal.submit')}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="montserrat text-xs text-grayText hover:text-textColor transition-colors duration-200 tracking-[0.15em] uppercase"
                  >
                    {t('artistsStudio.modal.cancel')}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
