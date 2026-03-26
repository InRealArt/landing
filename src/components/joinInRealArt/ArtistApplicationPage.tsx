'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { useLanguageStore } from '@/store/languageStore'
import Combobox from '@/components/ui/Combobox'

interface FormState {
  fullName: string
  email: string
  discipline: string
  portfolio: string
  intention: string
}

const INITIAL_FORM: FormState = {
  fullName: '',
  email: '',
  discipline: '',
  portfolio: '',
  intention: '',
}

export default function ArtistApplicationPage() {
  const { t } = useLanguageStore()
  const [form, setForm] = useState<FormState>(INITIAL_FORM)
  const [fileName, setFileName] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFileName(file ? file.name : null)
  }

  const handleDropZoneClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && fileInputRef.current) {
      // Update the visual state only — real upload would go through the hidden input
      setFileName(file.name)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Placeholder: build a mailto link with the form data
      const subject = encodeURIComponent(
        `Candidature Artiste — ${form.fullName}`
      )
      const body = encodeURIComponent(
        [
          `Nom : ${form.fullName}`,
          `Email : ${form.email}`,
          `Discipline : ${form.discipline}`,
          `Portfolio : ${form.portfolio}`,
          ``,
          `Note d'intention :`,
          form.intention,
        ].join('\n')
      )
      window.location.href = `mailto:teaminrealart@gmail.com?subject=${subject}&body=${body}`
      setStatus('success')
      setForm(INITIAL_FORM)
      setFileName(null)
    } catch {
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass =
    'w-full bg-transparent border-0 border-b border-borderColor py-3 text-[0.85rem] text-textColor placeholder:text-grayText focus:outline-none focus:border-textColor transition-colors duration-300 appearance-none'

  const labelClass = 'block text-[9px] uppercase tracking-widest text-grayText mb-1'

  const engagements = [
    {
      number: t('joinInRealArt.artists.application.engagements.1.number'),
      category: t('joinInRealArt.artists.application.engagements.1.category'),
      subtitle: t('joinInRealArt.artists.application.engagements.1.subtitle'),
      description: t('joinInRealArt.artists.application.engagements.1.description'),
    },
    {
      number: t('joinInRealArt.artists.application.engagements.2.number'),
      category: t('joinInRealArt.artists.application.engagements.2.category'),
      subtitle: t('joinInRealArt.artists.application.engagements.2.subtitle'),
      description: t('joinInRealArt.artists.application.engagements.2.description'),
    },
    {
      number: t('joinInRealArt.artists.application.engagements.3.number'),
      category: t('joinInRealArt.artists.application.engagements.3.category'),
      subtitle: t('joinInRealArt.artists.application.engagements.3.subtitle'),
      description: t('joinInRealArt.artists.application.engagements.3.description'),
    },
  ]

  const disciplines = [
    { value: 'peinture', label: t('joinInRealArt.artists.application.form.disciplines.painting') },
    { value: 'sculpture', label: t('joinInRealArt.artists.application.form.disciplines.sculpture') },
    { value: 'photographie', label: t('joinInRealArt.artists.application.form.disciplines.photography') },
    { value: 'digital', label: t('joinInRealArt.artists.application.form.disciplines.digital') },
    { value: 'autre', label: t('joinInRealArt.artists.application.form.disciplines.other') },
  ]

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="pt-40 pb-28 px-6 sm:px-10 bg-backgroundColor">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left — copy */}
            <div className="lg:col-span-7">
              <span className="section-number">
                {t('joinInRealArt.artists.application.hero.label')}
              </span>
              <h1 className="serif text-5xl sm:text-7xl md:text-8xl leading-tight text-textColor">
                {t('joinInRealArt.artists.application.hero.titleLine1')}
                <br />
                <span className="italic" style={{ color: 'var(--gold-accent)' }}>
                  {t('joinInRealArt.artists.application.hero.titleAccent')}
                </span>
              </h1>
              <p className="text-[12px] uppercase tracking-[0.3em] text-grayText mt-10 max-w-xl leading-loose">
                {t('joinInRealArt.artists.application.hero.subtitle')}
              </p>
            </div>

            {/* Right — artist portrait */}
            <div className="lg:col-span-5">
              <div className="aspect-[4/5] bg-backgroundGrey overflow-hidden grayscale">
                <Image
                  src="/images/joinInRealArt/artists/hero_joinInReal_artists.webp"
                  alt={t('joinInRealArt.artists.application.hero.imageAlt')}
                  width={800}
                  height={1000}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── LES ENGAGEMENTS ─── */}
      <section className="py-28 lg:py-32 px-6 sm:px-10 bg-backgroundGrey border-y border-borderColor">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {engagements.map((item) => (
              <div
                key={item.number}
                className="border-l border-borderColor pl-8"
              >
                <span className="serif text-3xl italic block mb-6" style={{ color: 'var(--gold-accent)' }}>
                  {item.category}
                </span>
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-textColor mb-6">
                  {item.subtitle}
                </h3>
                <p className="text-[13px] text-grayText leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FORMULAIRE DE CANDIDATURE ─── */}
      <section id="candidature" className="py-28 lg:py-32 px-6 sm:px-10 bg-backgroundColor">
        <div className="max-w-4xl mx-auto">

          {/* En-tête */}
          <div className="text-center mb-20 lg:mb-24">
            <span className="section-number">
              {t('joinInRealArt.artists.application.form.sectionLabel')}
            </span>
            <h2 className="serif text-4xl sm:text-5xl md:text-6xl italic text-textColor">
              {t('joinInRealArt.artists.application.form.title')}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12" noValidate>

            {/* Row 1 — Name + Email */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <label htmlFor="fullName" className={labelClass}>
                  {t('joinInRealArt.artists.application.form.fullName')}
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder={t('joinInRealArt.artists.application.form.fullNamePlaceholder')}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>
                  {t('joinInRealArt.artists.application.form.email')}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t('joinInRealArt.artists.application.form.emailPlaceholder')}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Row 2 — Discipline + Portfolio */}
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div>
                <label htmlFor="discipline" className={labelClass}>
                  {t('joinInRealArt.artists.application.form.discipline')}
                </label>
                <Combobox
                  id="discipline"
                  name="discipline"
                  options={disciplines}
                  value={form.discipline}
                  onChange={(val) => setForm(prev => ({ ...prev, discipline: val }))}
                  placeholder={t('joinInRealArt.artists.application.form.disciplineDefault')}
                  searchPlaceholder={t('joinInRealArt.artists.application.form.disciplineSearchPlaceholder')}
                  required
                />
              </div>
              <div>
                <label htmlFor="portfolio" className={labelClass}>
                  {t('joinInRealArt.artists.application.form.portfolio')}
                </label>
                <input
                  id="portfolio"
                  name="portfolio"
                  type="url"
                  value={form.portfolio}
                  onChange={handleChange}
                  placeholder={t('joinInRealArt.artists.application.form.portfolioPlaceholder')}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Row 3 — Note d'intention */}
            <div>
              <label htmlFor="intention" className={labelClass}>
                {t('joinInRealArt.artists.application.form.intention')}
              </label>
              <textarea
                id="intention"
                name="intention"
                rows={5}
                value={form.intention}
                onChange={handleChange}
                placeholder={t('joinInRealArt.artists.application.form.intentionPlaceholder')}
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Row 4 — File upload drop zone */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.zip"
                onChange={handleFileChange}
                className="sr-only"
                aria-label={t('joinInRealArt.artists.application.form.uploadLabel')}
              />
              <div
                role="button"
                tabIndex={0}
                onClick={handleDropZoneClick}
                onKeyDown={(e) => e.key === 'Enter' && handleDropZoneClick()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="group border-2 border-dashed border-borderColor p-10 sm:p-14 text-center cursor-pointer transition-colors duration-300 hover:border-[#b89c72] focus-visible:outline-none focus-visible:border-[#b89c72]"
                aria-describedby="upload-description"
              >
                <div className="mb-4 flex justify-center">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-grayText transition-colors duration-300 group-hover:text-[#b89c72]"
                    aria-hidden="true"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p
                  id="upload-description"
                  className="text-[10px] uppercase tracking-[0.2em] text-grayText transition-colors duration-300 group-hover:text-[#b89c72]"
                >
                  {fileName
                    ? fileName
                    : t('joinInRealArt.artists.application.form.uploadLabel')}
                </p>
              </div>
            </div>

            {/* Status messages */}
            {status === 'success' && (
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#b89c72] text-center">
                {t('joinInRealArt.artists.application.form.success')}
              </p>
            )}
            {status === 'error' && (
              <p className="text-[11px] uppercase tracking-[0.2em] text-red-500 text-center">
                {t('joinInRealArt.artists.application.form.error')}
              </p>
            )}

            {/* Submit */}
            <div className="text-center pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-block px-10 py-5 bg-textColor text-backgroundColor text-[0.65rem] uppercase tracking-[0.3em] transition-opacity duration-300 hover:opacity-75 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? t('common.submitting')
                  : t('joinInRealArt.artists.application.form.submit')}
              </button>
              <p className="text-[9px] text-grayText mt-6 uppercase tracking-widest">
                {t('joinInRealArt.artists.application.form.responseTime')}
              </p>
            </div>

          </form>
        </div>
      </section>
    </>
  )
}
