'use client'

import { useTranslation } from '@/hooks/useTranslation'
import {
  FormData,
  SectionHeader,
  FieldError,
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

export default function ArtistApplicationStep2({
  form,
  errors,
  touched,
  onChange,
  onBlur,
}: Props) {
  const { t } = useTranslation()
  const fp = 'joinInRealArt.artists.application.form'

  return (
    <div>
      <SectionHeader number="02" title={t(`${fp}.section2.title`)} />

      <div className="space-y-12">
        <div>
          <label htmlFor="careerDescription" className={labelClass}>
            {t(`${fp}.section2.careerDescription`)} *
          </label>
          <textarea
            id="careerDescription"
            rows={6}
            required
            value={form.careerDescription}
            onChange={onChange('careerDescription')}
            onBlur={onBlur('careerDescription')}
            placeholder={t(`${fp}.section2.careerDescriptionPlaceholder`)}
            className={textareaClass}
          />
          {touched.careerDescription && <FieldError message={errors.careerDescription} />}
        </div>

        <div>
          <label htmlFor="stylesAndMediums" className={labelClass}>
            {t(`${fp}.section2.stylesAndMediums`)} *
          </label>
          <textarea
            id="stylesAndMediums"
            rows={5}
            required
            value={form.stylesAndMediums}
            onChange={onChange('stylesAndMediums')}
            onBlur={onBlur('stylesAndMediums')}
            placeholder={t(`${fp}.section2.stylesAndMediumsPlaceholder`)}
            className={textareaClass}
          />
          {touched.stylesAndMediums && <FieldError message={errors.stylesAndMediums} />}
        </div>

        <div>
          <label htmlFor="artisticMessage" className={labelClass}>
            {t(`${fp}.section2.artisticMessage`)} *
          </label>
          <textarea
            id="artisticMessage"
            rows={5}
            required
            value={form.artisticMessage}
            onChange={onChange('artisticMessage')}
            onBlur={onBlur('artisticMessage')}
            placeholder={t(`${fp}.section2.artisticMessagePlaceholder`)}
            className={textareaClass}
          />
          {touched.artisticMessage && <FieldError message={errors.artisticMessage} />}
        </div>
      </div>
    </div>
  )
}
