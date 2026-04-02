'use client'

import { useTranslation } from '@/hooks/useTranslation'
import {
  FormData,
  SectionHeader,
  RadioGroup,
  labelClass,
} from './ArtistApplicationShared'

interface Props {
  form: FormData
  setForm: React.Dispatch<React.SetStateAction<FormData>>
  status: 'idle' | 'submitting' | 'success' | 'error'
  errorMessage: string
}

export default function ArtistApplicationStep4({
  form,
  setForm,
  status,
  errorMessage,
}: Props) {
  const { t } = useTranslation()
  const fp = 'joinInRealArt.artists.application.form'

  return (
    <div>
      <SectionHeader number="04" title={t(`${fp}.section4.title`)} />

      <div className="space-y-12">
        {/* Legal restrictions */}
        <div>
          <p className={labelClass}>
            {t(`${fp}.section4.hasLegalRestrictions`)} *
          </p>
          <p className="text-[11px] text-grayText mb-3">
            {t(`${fp}.section4.hasLegalRestrictionsHint`)}
          </p>
          <RadioGroup
            name="hasLegalRestrictions"
            value={form.hasLegalRestrictions}
            onChange={(v) => setForm((prev) => ({ ...prev, hasLegalRestrictions: v }))}
            labelYes={t(`${fp}.section4.yes`)}
            labelNo={t(`${fp}.section4.no`)}
          />
        </div>

        {/* Willing to promote — checkbox */}
        <div className="pt-8 border-t border-borderColor">
          <label className="flex items-start gap-5 cursor-pointer group">
            <button
              type="button"
              role="checkbox"
              aria-checked={form.willingToPromote}
              onClick={() =>
                setForm((prev) => ({ ...prev, willingToPromote: !prev.willingToPromote }))
              }
              className="mt-0.5 w-5 h-5 flex-shrink-0 border border-borderColor flex items-center justify-center focus-visible:outline-none focus-visible:border-[#b89c72] transition-all duration-300 group-hover:border-[#b89c72]"
              style={
                form.willingToPromote
                  ? { backgroundColor: 'var(--gold-accent)', borderColor: 'var(--gold-accent)' }
                  : {}
              }
            >
              {form.willingToPromote && (
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden="true">
                  <polyline
                    points="1.5,5.5 4.5,8.5 9.5,2.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
            <span className="text-[11px] uppercase tracking-[0.2em] text-textColor leading-relaxed group-hover:text-[#b89c72] transition-colors duration-300">
              {t(`${fp}.section4.willingToPromote`)} *
            </span>
          </label>
        </div>

        {/* Submission error */}
        {status === 'error' && (
          <p
            className="mt-4 text-[10px] uppercase tracking-[0.2em] text-center flex items-center justify-center gap-2"
            style={{ color: '#c0392b' }}
            role="alert"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <circle cx="6" cy="6" r="6" />
            </svg>
            {errorMessage}
          </p>
        )}

        {/* Submit */}
        <div className="text-center pt-6">
          <button
            type="submit"
            disabled={status === 'submitting' || form.hasLegalRestrictions === null || !form.willingToPromote}
            className="inline-block px-12 py-5 bg-textColor text-backgroundColor text-[0.65rem] uppercase tracking-[0.3em] transition-all duration-500 hover:opacity-80 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
            style={
              status !== 'submitting' && form.willingToPromote && form.hasLegalRestrictions !== null
                ? { boxShadow: '0 4px 20px rgba(184, 156, 114, 0.3)' }
                : {}
            }
          >
            {status === 'submitting' ? t(`${fp}.submitting`) : t(`${fp}.submit`)}
          </button>
          <p className="text-[9px] text-grayText mt-8 uppercase tracking-[0.25em]">
            {t(`${fp}.responseTime`)}
          </p>
        </div>
      </div>
    </div>
  )
}
