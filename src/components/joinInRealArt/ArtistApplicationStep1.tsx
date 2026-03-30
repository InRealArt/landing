'use client'

import { useLanguageStore } from '@/store/languageStore'
import {
  FormData,
  SectionHeader,
  FieldError,
  inputClass,
  labelClass,
  textareaClass,
  StepErrors,
} from './ArtistApplicationShared'

interface Props {
  form: FormData
  errors: StepErrors
  touched: Record<string, boolean>
  onChange: (key: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur: (key: keyof FormData) => () => void
}

export default function ArtistApplicationStep1({
  form,
  errors,
  touched,
  onChange,
  onBlur,
}: Props) {
  const { t } = useLanguageStore()
  const fp = 'joinInRealArt.artists.application.form'

  return (
    <div>
      <SectionHeader number="01" title={t(`${fp}.section1.title`)} />

      <div className="space-y-12">
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          <div>
            <label htmlFor="fullName" className={labelClass}>
              {t(`${fp}.section1.fullName`)} *
            </label>
            <input
              id="fullName"
              type="text"
              required
              autoComplete="name"
              value={form.fullName}
              onChange={onChange('fullName')}
              onBlur={onBlur('fullName')}
              placeholder={t(`${fp}.section1.fullNamePlaceholder`)}
              className={inputClass}
              aria-describedby={touched.fullName && errors.fullName ? 'fullName-error' : undefined}
            />
            {touched.fullName && <FieldError message={errors.fullName} />}
          </div>
          <div>
            <label htmlFor="artistName" className={labelClass}>
              {t(`${fp}.section1.artistName`)}
            </label>
            <input
              id="artistName"
              type="text"
              autoComplete="nickname"
              value={form.artistName}
              onChange={onChange('artistName')}
              placeholder={t(`${fp}.section1.artistNamePlaceholder`)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          <div>
            <label htmlFor="email" className={labelClass}>
              {t(`${fp}.section1.email`)} *
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={onChange('email')}
              onBlur={onBlur('email')}
              placeholder={t(`${fp}.section1.emailPlaceholder`)}
              className={inputClass}
              aria-describedby={touched.email && errors.email ? 'email-error' : undefined}
            />
            {touched.email && <FieldError message={errors.email} />}
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              {t(`${fp}.section1.phone`)} *
            </label>
            <input
              id="phone"
              type="tel"
              required
              autoComplete="tel"
              value={form.phone}
              onChange={onChange('phone')}
              onBlur={onBlur('phone')}
              placeholder={t(`${fp}.section1.phonePlaceholder`)}
              className={inputClass}
              aria-describedby={touched.phone && errors.phone ? 'phone-error' : undefined}
            />
            {touched.phone && <FieldError message={errors.phone} />}
          </div>
        </div>

        <div>
          <label htmlFor="portfolioLinks" className={labelClass}>
            {t(`${fp}.section1.portfolioLinks`)} *
          </label>
          <textarea
            id="portfolioLinks"
            rows={4}
            required
            value={form.portfolioLinks}
            onChange={onChange('portfolioLinks')}
            onBlur={onBlur('portfolioLinks')}
            placeholder={t(`${fp}.section1.portfolioLinksPlaceholder`)}
            className={textareaClass}
            aria-describedby={touched.portfolioLinks && errors.portfolioLinks ? 'portfolioLinks-error' : undefined}
          />
          {touched.portfolioLinks && <FieldError message={errors.portfolioLinks} />}
        </div>
      </div>
    </div>
  )
}
