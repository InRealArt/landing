'use client'

import { z } from 'zod'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FormData {
  // Section 1
  fullName: string
  artistName: string
  email: string
  phone: string
  portfolioLinks: string
  // Section 2
  careerDescription: string
  stylesAndMediums: string
  artisticMessage: string
  // Section 3
  hasPhysicalWorks: boolean | null
  physicalWorksCount: string
  canProduceWorks: string
  worksProducedPerYear: string
  worksSoldLastYear: string
  averageSellingPrice: string
  annualRevenue: string
  worksSoldAnnually: string
  seasonalPatterns: string
  directVsGalleryPercent: string
  salesChannels: string
  marketplacePresence: string
  newsletterSubscribers: string
  socialMediaFollowers: string
  websiteUniqueVisitors: string
  // Section 4
  hasLegalRestrictions: boolean | null
  willingToPromote: boolean
}

export const INITIAL_FORM: FormData = {
  fullName: '',
  artistName: '',
  email: '',
  phone: '',
  portfolioLinks: '',
  careerDescription: '',
  stylesAndMediums: '',
  artisticMessage: '',
  hasPhysicalWorks: null,
  physicalWorksCount: '',
  canProduceWorks: '',
  worksProducedPerYear: '',
  worksSoldLastYear: '',
  averageSellingPrice: '',
  annualRevenue: '',
  worksSoldAnnually: '',
  seasonalPatterns: '',
  directVsGalleryPercent: '',
  salesChannels: '',
  marketplacePresence: '',
  newsletterSubscribers: '',
  socialMediaFollowers: '',
  websiteUniqueVisitors: '',
  hasLegalRestrictions: null,
  willingToPromote: false,
}

export const TOTAL_STEPS = 4

// ─── CSS class constants ──────────────────────────────────────────────────────

export const inputClass =
  'w-full bg-transparent border-0 border-b border-borderColor py-4 text-[0.85rem] text-textColor placeholder:text-grayText focus:outline-none focus:border-[#b89c72] focus:ring-0 transition-all duration-300 appearance-none rounded-none'

export const labelClass = 'block text-xs uppercase tracking-[0.2em] text-grayText mb-3 font-medium'

export const textareaClass = `${inputClass} resize-none min-h-[120px]`

// ─── Zod schemas per step ─────────────────────────────────────────────────────

export const step1Schema = z.object({
  fullName: z.string().min(2, 'Prénom & Nom requis (min. 2 caractères)'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().min(4, 'Numéro de téléphone requis (min. 4 caractères)'),
  portfolioLinks: z.string().min(2, 'Lien portfolio requis (min. 2 caractères)'),
})

export const step2Schema = z.object({
  careerDescription: z.string().min(10, 'Décrivez votre parcours (min. 10 caractères)'),
  stylesAndMediums: z.string().min(5, 'Précisez vos styles et médiums (min. 5 caractères)'),
  artisticMessage: z.string().min(10, 'Décrivez votre message artistique (min. 10 caractères)'),
})

export const step3Schema = z.object({
  hasPhysicalWorks: z.boolean({ required_error: 'Veuillez sélectionner une option' }),
})

export const step4Schema = z.object({
  hasLegalRestrictions: z.boolean({ required_error: 'Veuillez sélectionner une option' }),
  willingToPromote: z.literal(true, {
    errorMap: () => ({ message: 'Vous devez accepter de promouvoir le projet InRealArt' }),
  }),
})

// ─── Validation helper — returns field error messages for a step ──────────────

export type StepErrors = Partial<Record<string, string>>

export function validateStep(step: number, form: FormData): StepErrors {
  const schemas: Record<number, z.ZodTypeAny> = {
    1: step1Schema,
    2: step2Schema,
    3: step3Schema,
    4: step4Schema,
  }
  const schema = schemas[step]
  if (!schema) return {}

  const result = schema.safeParse(form)
  if (result.success) return {}

  const errors: StepErrors = {}
  for (const issue of result.error.issues) {
    const key = issue.path[0] as string
    if (!errors[key]) errors[key] = issue.message
  }
  return errors
}

// ─── Shared sub-components ────────────────────────────────────────────────────

export function SectionHeader({
  number,
  title,
}: {
  number: string
  title: string
}) {
  return (
    <div className="flex items-baseline gap-6 mb-14 pb-10 border-b border-borderColor">
      <span
        className="serif text-5xl italic leading-none"
        style={{ color: 'var(--gold-accent)' }}
      >
        {number}
      </span>
      <span className="text-xs uppercase tracking-[0.4em] text-textColor">
        {title}
      </span>
    </div>
  )
}

export function RadioGroup({
  name,
  value,
  onChange,
  labelYes,
  labelNo,
}: {
  name: string
  value: boolean | null
  onChange: (v: boolean) => void
  labelYes: string
  labelNo: string
}) {
  return (
    <div className="flex gap-10 mt-3">
      {([true, false] as const).map((bool) => {
        const label = bool ? labelYes : labelNo
        const checked = value === bool
        return (
          <label
            key={String(bool)}
            className="flex items-center gap-4 cursor-pointer group"
          >
            <span
              className="w-5 h-5 border border-borderColor flex items-center justify-center transition-all duration-300 group-hover:border-[#b89c72]"
              style={
                checked
                  ? { borderColor: 'var(--gold-accent)', backgroundColor: 'var(--gold-accent)' }
                  : {}
              }
            >
              {checked && (
                <span className="w-2 h-2 bg-white rounded-sm" />
              )}
            </span>
            <input
              type="radio"
              name={name}
              value={String(bool)}
              checked={checked}
              onChange={() => onChange(bool)}
              className="sr-only"
            />
            <span className="text-sm uppercase tracking-[0.2em] text-textColor group-hover:text-[#b89c72] transition-colors duration-300">
              {label}
            </span>
          </label>
        )
      })}
    </div>
  )
}

// ─── Inline field error ───────────────────────────────────────────────────────

export function FieldError({ message }: { message: string | undefined }) {
  if (!message) return null
  return (
    <p
      className="mt-2 text-xs uppercase tracking-[0.2em] flex items-center gap-2"
      style={{ color: '#c0392b' }}
      role="alert"
    >
      <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
        <circle cx="5" cy="5" r="5" />
      </svg>
      {message}
    </p>
  )
}
