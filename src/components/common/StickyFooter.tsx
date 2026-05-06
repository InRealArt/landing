'use client'

import { useState, useEffect } from 'react'
import { X, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

interface StickyFooterProps {
  id: number
  title: string | null
  text: string | null
  textButton: string | null
  buttonUrl: string | null
  onClose?: () => void
}

export default function StickyFooter({
  id,
  title,
  text,
  textButton,
  buttonUrl,
  onClose
}: StickyFooterProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const closedFooters = JSON.parse(localStorage.getItem('closedInRealArtStickyFooters') || '[]')
    if (!closedFooters.includes(id)) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [id])

  const handleClose = () => {
    setIsClosing(true)
    const closedFooters = JSON.parse(localStorage.getItem('closedInRealArtStickyFooters') || '[]')
    if (!closedFooters.includes(id)) {
      closedFooters.push(id)
      localStorage.setItem('closedInRealArtStickyFooters', JSON.stringify(closedFooters))
    }
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 400)
  }

  const handleButtonClick = () => {
    handleClose()
  }

  if (!isVisible && !isClosing) {
    return null
  }

  const ctaInner = (
    <>
      <span className="text-[0.6rem] uppercase tracking-[0.25em] text-white group-hover:text-ink-black transition-colors duration-500">
        {textButton}
      </span>
      <ArrowUpRight
        className="w-3.5 h-3.5 text-gold-accent group-hover:text-ink-black transition-colors duration-500 flex-shrink-0"
        strokeWidth={1.5}
      />
    </>
  )

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[9999] pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
        isClosing ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Single-pixel gold rule — brand top edge */}
      <div className="h-px w-full bg-gold-accent/50" />

      <div
        className="relative shadow-[0_-8px_40px_rgba(0,0,0,0.6)]"
        style={{
          background: 'linear-gradient(110deg, #0d0d0d 0%, #131313 45%, #100f0f 100%)',
        }}
      >
        {/* Close — ghost, vertically centred, far right */}
        <button
          onClick={handleClose}
          className="absolute top-1/2 -translate-y-1/2 right-5 md:right-8 p-2 text-white/30 hover:text-white transition-colors duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-accent/50 z-20"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" strokeWidth={1} />
        </button>

        {/* Layout */}
        <div className="max-w-screen-xl mx-auto px-6 md:px-10 py-5 pr-14 md:pr-20">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-12">

            {/* Text */}
            <div className="flex-1 min-w-0">
              <span className="section-number !mb-0.5" aria-hidden="true">In Real Art</span>
              {title && (
                <h3 className="serif italic text-xl md:text-2xl text-white leading-snug">
                  {title}
                </h3>
              )}
              {text && (
                <p className="montserrat text-[0.7rem] leading-relaxed text-white/45 mt-1.5 max-w-2xl">
                  {text}
                </p>
              )}
            </div>

            {/* CTA */}
            {textButton && buttonUrl && (
              <div className="flex-shrink-0">
                {buttonUrl.startsWith('http') ? (
                  <a
                    href={buttonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleButtonClick}
                    className="group inline-flex items-center gap-2.5 px-5 py-3 border border-gold-accent/40 hover:border-gold-accent hover:bg-gold-accent transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-accent/50"
                  >
                    {ctaInner}
                  </a>
                ) : (
                  <Link
                    href={buttonUrl}
                    onClick={handleButtonClick}
                    className="group inline-flex items-center gap-2.5 px-5 py-3 border border-gold-accent/40 hover:border-gold-accent hover:bg-gold-accent transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] focus:outline-none focus-visible:ring-1 focus-visible:ring-gold-accent/50"
                  >
                    {ctaInner}
                  </Link>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export function useStickyFooter() {
  const [closedFooters, setClosedFooters] = useState<number[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('closedInRealArtStickyFooters')
    if (stored) setClosedFooters(JSON.parse(stored))
  }, [])

  const isClosed = (id: number) => closedFooters.includes(id)

  const closeFooter = (id: number) => {
    const newClosedFooters = [...closedFooters, id]
    setClosedFooters(newClosedFooters)
    localStorage.setItem('closedInRealArtStickyFooters', JSON.stringify(newClosedFooters))
  }

  const resetClosedFooters = () => {
    setClosedFooters([])
    localStorage.removeItem('closedInRealArtStickyFooters')
  }

  return { isClosed, closeFooter, resetClosedFooters }
}
