'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useLanguageStore } from '@/store/languageStore'
import FirebaseImage from '@/components/common/FirebaseImage'

interface TeamModalProps {
  isOpen: boolean
  onClose: () => void
  member: {
    image: { src: string }
    name: string
    role: string
    intro?: string
    description?: string
    socials: { link: string; icon: string }[]
  }
}

function getSocialLabel(url: string): string {
  if (url.includes('linkedin')) return 'LinkedIn'
  if (url.includes('instagram')) return 'Instagram'
  if (url.includes('facebook')) return 'Facebook'
  if (url.includes('github')) return 'GitHub'
  if (url.includes('twitter') || url.includes('x.com')) return 'X / Twitter'
  return 'Website'
}

export default function TeamModal({ isOpen, onClose, member }: TeamModalProps) {
  const { t } = useLanguageStore()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      const timer = setTimeout(() => setIsVisible(false), 400)
      return () => clearTimeout(timer)
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, handleKeyDown])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 transition-opacity duration-400 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal panel */}
      <div
        className={`relative w-full max-w-3xl bg-backgroundColor border border-borderColor shadow-2xl transition-all duration-400 ${
          isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-[0.97] translate-y-6 opacity-0'
        }`}
      >
        {/* Close button — top-right, minimal */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center border border-borderColor hover:border-textColor hover:bg-textColor hover:text-backgroundColor transition-all duration-300"
          aria-label={t('common.close')}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Body */}
        <div className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row gap-10 md:gap-14">

            {/* Portrait */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="w-44 md:w-56 aspect-[3/4] overflow-hidden bg-[#f8f8f8]">
                <FirebaseImage
                  src={member.image.src}
                  alt={member.name}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover object-top"
                  loading="eager"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Section number label */}
              <span className="section-number">{t('team.sectionLabel')}</span>

              {/* Name + role */}
              <h2 className="text-4xl md:text-5xl serif text-textColor leading-tight">{member.name}</h2>
              <p className="text-[10px] uppercase tracking-widest text-gold-accent mt-3 montserrat">
                {member.role}
              </p>

              {/* Separator */}
              <div className="w-10 h-px bg-[#b89c72] mt-6 mb-7" />

              {/* Intro */}
              {member.intro && (
                <p className="text-[13px] text-grayText leading-loose montserrat mb-5">
                  {member.intro}
                </p>
              )}

              {/* Description */}
              {member.description && (
                <p className="text-[12px] text-grayText leading-loose montserrat whitespace-pre-line border-t border-borderColor pt-6">
                  {member.description}
                </p>
              )}

              {/* Social links — btn-cta style */}
              {member.socials.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-borderColor">
                  {member.socials.map((social, index) => (
                    <Link
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn flex items-center gap-2 px-4 py-2.5 border border-textColor/20 hover:border-textColor hover:bg-textColor hover:text-backgroundColor transition-all duration-500"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={social.icon}
                        alt={getSocialLabel(social.link)}
                        className="w-3.5 h-3.5 opacity-60 group-hover/btn:invert group-hover/btn:opacity-100 transition-all duration-500"
                      />
                      <span className="text-[9px] uppercase tracking-[0.25em] montserrat">
                        {getSocialLabel(social.link)}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
