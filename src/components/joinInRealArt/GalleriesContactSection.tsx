'use client'

import { useState } from 'react'
import { useLanguageStore } from '@/store/languageStore'

interface FormState {
  galleryName: string
  email: string
  profile: string
}

export default function GalleriesContactSection() {
  const { t } = useLanguageStore()
  const [form, setForm] = useState<FormState>({ galleryName: '', email: '', profile: '' })
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const subject = encodeURIComponent(`Demande de partenariat galerie — ${form.galleryName}`)
      const body = encodeURIComponent(
        `Galerie : ${form.galleryName}\nEmail : ${form.email}\n\nProfil et artistes représentés :\n${form.profile}`
      )
      window.location.href = `mailto:teaminrealart@gmail.com?subject=${subject}&body=${body}`
      setStatus('success')
      setForm({ galleryName: '', email: '', profile: '' })
    } catch {
      setStatus('error')
    } finally {
      setIsSubmitting(false)
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
                required
                value={form.galleryName}
                onChange={handleChange}
                placeholder={t('joinInRealArt.galleries.contactSection.form.galleryName')}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="sr-only">
                {t('joinInRealArt.galleries.contactSection.form.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder={t('joinInRealArt.galleries.contactSection.form.email')}
                className={inputClass}
              />
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
                onChange={handleChange}
                placeholder={t('joinInRealArt.galleries.contactSection.form.profile')}
                className={`${inputClass} resize-none`}
              />
            </div>

            {status === 'success' && (
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#b89c72]">
                {t('joinInRealArt.galleries.contactSection.form.success')}
              </p>
            )}
            {status === 'error' && (
              <p className="text-[11px] uppercase tracking-[0.2em] text-red-500">
                {t('joinInRealArt.galleries.contactSection.form.error')}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-cta w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-[0.6rem] uppercase tracking-[0.25em]">
                {isSubmitting
                  ? t('common.submitting')
                  : t('joinInRealArt.galleries.contactSection.form.submit')}
              </span>
            </button>
          </form>

        </div>
      </div>
    </section>
  )
}
