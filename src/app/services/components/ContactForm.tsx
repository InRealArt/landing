'use client'

import { useState, FormEvent } from 'react'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [expert, setExpert] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // Redirect to main contact page with pre-filled context via query param
    const params = new URLSearchParams()
    if (name) params.set('name', name)
    if (expert) params.set('subject', `Demande de consulting — ${expert}`)
    window.location.href = `/contact?${params.toString()}`
    setSubmitted(true)
  }

  return (
    <section className="py-32 px-10 bg-backgroundColor">
      <div className="max-w-screen-md mx-auto text-center p-12 md:p-20 border border-borderColor">
        <h2 className="serif text-4xl mb-8 text-textColor">
          Prêt à élever votre <br />
          <span className="italic">patrimoine artistique ?</span>
        </h2>
        <p className="text-[12px] mb-12 uppercase tracking-widest montserrat text-grayText">
          Réponse sous 48h par l&apos;un de nos experts.
        </p>

        {submitted ? (
          <p className="text-[13px] montserrat text-gold-accent">
            Votre demande a été transmise.
          </p>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="services-name" className="sr-only">
                Votre nom
              </label>
              <input
                id="services-name"
                type="text"
                placeholder="VOTRE NOM"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-4 text-[10px] tracking-widest outline-none montserrat bg-transparent text-textColor border-b border-borderColor"
                style={{ transition: 'border-color 0.3s ease' }}
                onFocus={(e) => {
                  ;(e.currentTarget as HTMLInputElement).style.borderBottomColor = 'var(--text)'
                }}
                onBlur={(e) => {
                  ;(e.currentTarget as HTMLInputElement).style.borderBottomColor = ''
                }}
              />
            </div>

            <div>
              <label htmlFor="services-expert" className="sr-only">
                Choisir un expert
              </label>
              <select
                id="services-expert"
                value={expert}
                onChange={(e) => setExpert(e.target.value)}
                className="w-full py-4 text-[10px] tracking-widest outline-none montserrat bg-transparent border-b border-borderColor"
                style={{
                  color: expert ? 'var(--text)' : 'var(--gray-text)',
                  transition: 'border-color 0.3s ease',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  ;(e.currentTarget as HTMLSelectElement).style.borderBottomColor = 'var(--text)'
                }}
                onBlur={(e) => {
                  ;(e.currentTarget as HTMLSelectElement).style.borderBottomColor = ''
                }}
              >
                <option value="">CHOISIR UN EXPERT</option>
                <option value="Maxime Girard">MAXIME GIRARD (Marketing)</option>
                <option value="Ania Chrusciany">ANIA CHRUSCIANY (Art Advisor)</option>
                <option value="Timothée Roy">TIMOTHÉE ROY (Agent)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-10 py-4 text-[10px] uppercase tracking-[0.25em] montserrat border border-borderColor text-textColor bg-transparent"
              style={{
                transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.backgroundColor = 'var(--text)'
                el.style.color = 'var(--background)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.backgroundColor = 'transparent'
                el.style.color = ''
              }}
            >
              Envoyer la demande
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
