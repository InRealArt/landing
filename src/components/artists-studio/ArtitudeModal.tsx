'use client'

import { useState, useEffect } from 'react'

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

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  // Prevent body scroll when open
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
    }, 2000)
  }

  const inputClass = "w-full bg-backgroundColor border border-borderColor rounded-xl px-4 py-2.5 focus:outline-none focus:border-gold-accent text-textColor placeholder-grayText text-sm font-bricolage transition-colors"
  const labelClass = "block font-unbounded font-medium text-xs uppercase tracking-wider mb-1.5 text-grayText"

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-cardBackground border border-borderColor w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-borderColor flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gold-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h3 className="font-unbounded text-base sm:text-lg font-bold text-textColor">
              Rejoindre l&apos;Index via Artitude
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-borderColor rounded-full text-grayText hover:text-textColor transition-colors"
            aria-label="Fermer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          <p className="text-sm text-grayText font-bricolage leading-relaxed">
            Inscrivez-vous à la plateforme <span className="text-gold-accent font-semibold">Artitude</span>. Une fois validé, votre fiche sera publiée et votre atelier apparaîtra sur la carte de l&apos;Index.
          </p>

          {submitted ? (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gold-accent/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-gold-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="font-unbounded font-bold text-textColor">Bienvenue dans l&apos;Index !</p>
              <p className="text-sm text-grayText font-bricolage">Votre fiche est en cours de publication…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nom complet *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sophie Duval"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Médium artistique *</label>
                  <select
                    required
                    value={form.medium}
                    onChange={(e) => setForm({ ...form, medium: e.target.value })}
                    className={inputClass}
                  >
                    <option value="peinture">Peinture</option>
                    <option value="sculpture">Sculpture</option>
                    <option value="photographie">Photographie</option>
                    <option value="dessin">Dessin / Art du papier</option>
                    <option value="autre">Autre médium</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Ville de l&apos;atelier *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Nantes, Lyon…"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Statut de l&apos;atelier *</label>
                  <select
                    required
                    value={form.open}
                    onChange={(e) => setForm({ ...form, open: e.target.value })}
                    className={inputClass}
                  >
                    <option value="oui">Ouvert au public</option>
                    <option value="non">Sur rendez-vous uniquement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>Accroche (1 ligne) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: L'art minimaliste au cœur de la matière."
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Biographie & démarche artistique</label>
                <textarea
                  rows={3}
                  placeholder="Présentez rapidement votre style, vos inspirations…"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div>
                <label className={labelClass}>Photo de l&apos;atelier (URL)</label>
                <input
                  type="url"
                  placeholder="https://…"
                  value={form.photo}
                  onChange={(e) => setForm({ ...form, photo: e.target.value })}
                  className={inputClass}
                />
                <p className="text-xs text-grayText mt-1 font-bricolage">Laissez vide pour utiliser une illustration par défaut.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-borderColor">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-borderColor text-sm font-unbounded font-semibold hover:border-gold-accent transition-colors text-textColor"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-gold-accent hover:opacity-90 text-white px-6 py-2.5 rounded-xl text-sm font-unbounded font-semibold transition-all"
                >
                  Publier mon atelier
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
