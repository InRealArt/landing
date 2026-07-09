'use client'

import { useState, FormEvent } from 'react'

interface ContactFormProps {
  translations: {
    title: string
    titleAccent: string
    description: string
    successMessage: string
    namePlaceholder: string
    nameLabel: string
    expertLabel: string
    expertSelect: string
    expertOptions: {
      maxime: string
      ania: string
      timothee: string
    }
    submitButton: string
  }
}

export default function ContactForm({ translations }: ContactFormProps) {
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
          {translations.title} <br />
          <span className="italic">{translations.titleAccent}</span>
        </h2>
        <p className="text-sm mb-12 uppercase tracking-widest montserrat text-grayText">
          {translations.description}
        </p>

        {submitted ? (
          <p className="text-sm montserrat text-gold-accent">
            {translations.successMessage}
          </p>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="services-name" className="sr-only">
                {translations.nameLabel}
              </label>
              <input
                id="services-name"
                type="text"
                placeholder={translations.namePlaceholder}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-4 text-xs tracking-widest outline-none montserrat bg-transparent text-textColor border-b border-borderColor"
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
                {translations.expertLabel}
              </label>
              <select
                id="services-expert"
                value={expert}
                onChange={(e) => setExpert(e.target.value)}
                className="w-full py-4 text-xs tracking-widest outline-none montserrat bg-transparent border-b border-borderColor"
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
                <option value="">{translations.expertSelect}</option>
                <option value="Maxime Girard">{translations.expertOptions.maxime}</option>
                <option value="Ania Chrusciany">{translations.expertOptions.ania}</option>
                <option value="Timothée Roy">{translations.expertOptions.timothee}</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-10 py-4 text-xs uppercase tracking-[0.25em] montserrat border border-borderColor text-textColor bg-transparent"
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
              {translations.submitButton}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
