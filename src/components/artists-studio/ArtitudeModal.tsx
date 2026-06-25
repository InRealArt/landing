'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

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

  const inputClass = "w-full bg-transparent py-3 pr-4 text-textColor placeholder-grayText montserrat text-[12px] font-light focus:outline-none"
  const fieldClass = "relative border-b border-borderColor focus-within:border-gold-accent transition-colors duration-300 mb-6"
  const labelClass = "montserrat text-[10px] uppercase tracking-[0.25em] text-grayText mb-1 block"

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
            <div
              className="absolute inset-0"
              style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(184,156,114,0.15) 0%, transparent 70%)' }}
              aria-hidden="true"
            />
            {/* Cadres dorés */}
            <div className="absolute inset-4 border border-gold-accent/20 pointer-events-none" aria-hidden="true" />
            <div className="absolute inset-7 border border-gold-accent/10 pointer-events-none" aria-hidden="true" />
            {/* Ligne verticale */}
            <div className="absolute left-4 top-1/4 bottom-1/4 w-px bg-gold-accent/40" aria-hidden="true" />

            <div className="relative z-10">
              <span className="montserrat text-[10px] uppercase tracking-[0.35em] text-gold-accent block mb-4">
                Artitude — Index des Ateliers
              </span>
              <h2 className="serif italic text-3xl text-textColor leading-tight mb-4">
                Rejoignez le{' '}
                <em className="not-italic text-gold-accent">réseau vivant</em>{' '}
                des créateurs
              </h2>
              <p className="montserrat text-[11px] text-grayText leading-loose font-light">
                Votre atelier, visible par des milliers de collectionneurs et passionnés d&apos;art contemporain.
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
                <h3 className="serif italic text-2xl text-textColor">Bienvenue dans l&apos;Index !</h3>
                <p className="montserrat text-[11px] text-grayText leading-loose font-light">
                  Votre fiche est en cours de validation. Nous revenons vers vous très vite.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-0">
                <div className={fieldClass}>
                  <label className={labelClass}>Nom complet *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex : Sophie Duval"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className={fieldClass}>
                    <label className={labelClass}>Médium *</label>
                    <select
                      required
                      value={form.medium}
                      onChange={(e) => setForm({ ...form, medium: e.target.value })}
                      className={inputClass + ' cursor-pointer'}
                    >
                      <option value="peinture">Peinture</option>
                      <option value="sculpture">Sculpture</option>
                      <option value="photographie">Photographie</option>
                      <option value="dessin">Dessin / Papier</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                  <div className={fieldClass}>
                    <label className={labelClass}>Ville *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex : Nantes"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className={fieldClass}>
                  <label className={labelClass}>Statut de l&apos;atelier *</label>
                  <select
                    required
                    value={form.open}
                    onChange={(e) => setForm({ ...form, open: e.target.value })}
                    className={inputClass + ' cursor-pointer'}
                  >
                    <option value="oui">Ouvert au public</option>
                    <option value="non">Sur rendez-vous uniquement</option>
                  </select>
                </div>

                <div className={fieldClass}>
                  <label className={labelClass}>Accroche *</label>
                  <input
                    type="text"
                    required
                    placeholder="L'art minimaliste au cœur de la matière."
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    className={inputClass}
                  />
                </div>

                <div className={fieldClass}>
                  <label className={labelClass}>Démarche artistique</label>
                  <textarea
                    rows={2}
                    placeholder="Style, inspirations, univers…"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className={inputClass + ' resize-none'}
                  />
                </div>

                <div className={fieldClass}>
                  <label className={labelClass}>Photo de l&apos;atelier (URL)</label>
                  <input
                    type="url"
                    placeholder="https://…"
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
                    Publier mon atelier
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="montserrat text-[10px] text-grayText hover:text-textColor transition-colors duration-200 tracking-[0.15em] uppercase"
                  >
                    Annuler
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
