'use client'

import { useEffect, useRef } from 'react'
import { useTranslation } from '@/hooks/useTranslation'

interface ArtistValidationPopupProps {
  errors: string[]
  onClose: () => void
}

// Static CSS-only string — no user input, no XSS risk (same pattern as shimmer skeletons)
const POPUP_KEYFRAMES = `
  @keyframes ira-popup-shrink {
    from { transform: scaleX(1); }
    to   { transform: scaleX(0); }
  }
`

/**
 * Fixed bottom-right toast that lists all blocking validation errors when the
 * user clicks "Continuer" but the current step is invalid.
 *
 * Design: card background, gold left-border accent, serif italic heading,
 * small-caps error list. Auto-dismisses after 4 s. Does not block scroll.
 */
export default function ArtistValidationPopup({
  errors,
  onClose,
}: ArtistValidationPopupProps) {
  const { t } = useTranslation()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(onClose, 4000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [onClose])

  if (errors.length === 0) return null

  return (
    <>
      {/* Static animation keyframes — pure CSS, no user content */}
      <style dangerouslySetInnerHTML={{ __html: POPUP_KEYFRAMES }} />

      <div
        role="alert"
        aria-live="assertive"
        className="fixed bottom-8 right-6 z-50 max-w-sm w-full pointer-events-auto"
        style={{
          backgroundColor: 'var(--cardBackground)',
          border: '1px solid var(--borderColor)',
          borderLeft: '4px solid var(--gold-accent)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
        }}
      >
        {/* Header row */}
        <div
          className="flex items-start justify-between px-6 pt-6 pb-3"
          style={{ borderBottom: '1px solid var(--borderColor)' }}
        >
          <span
            className="serif italic text-lg leading-snug"
            style={{ color: 'var(--gold-accent)' }}
          >
            {t('joinInRealArt.artists.application.form.validation.popupTitle')}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('joinInRealArt.artists.application.form.validation.close')}
            className="ml-4 mt-0.5 text-grayText hover:text-[#b89c72] transition-all duration-300 flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.2" />
              <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>

        {/* Error list */}
        <ul className="px-6 py-5 space-y-3">
          {errors.map((msg, i) => (
            <li key={i} className="flex items-baseline gap-3">
              <span
                className="w-1.5 h-1.5 flex-shrink-0 block mt-1.5 rounded-sm"
                style={{ backgroundColor: 'var(--gold-accent)' }}
                aria-hidden="true"
              />
              <span className="text-xs uppercase tracking-[0.15em] text-textColor leading-relaxed">
                {msg}
              </span>
            </li>
          ))}
        </ul>

        {/* Progress bar — visual countdown */}
        <div
          className="h-px w-full origin-left"
          style={{
            backgroundColor: 'var(--gold-accent)',
            animation: 'ira-popup-shrink 4s linear forwards',
          }}
        />
      </div>
    </>
  )
}
