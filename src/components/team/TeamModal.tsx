'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguageStore } from '@/store/languageStore'

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

export default function TeamModal({ isOpen, onClose, member }: TeamModalProps) {
  const { t } = useLanguageStore()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-backgroundColor/50 backdrop-blur-sm" />
      
      {/* Modal Content */}
      <div
        className={`relative w-full max-w-2xl bg-backgroundColor rounded-2xl shadow-2xl transform transition-all duration-300 ${
          isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-backgroundColor/90 hover:bg-backgroundColor shadow-lg hover:shadow-xl transition-all duration-200"
          aria-label={t('common.close')}
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Body */}
        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Image */}
            <div className="flex-shrink-0">
              <div 
                className="w-48 h-64 lg:w-64 lg:h-80 mx-auto lg:mx-0 rounded-xl bg-cover bg-no-repeat bg-center shadow-lg"
                style={{ backgroundImage: `url('${member.image.src}')` }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{member.name}</h2>
                <p className="text-xl text-gray-600 mb-4">{member.role}</p>
              </div>

              {member.intro && (
                <div>
                  <p className="text-gray-700 leading-relaxed">{member.intro}</p>
                </div>
              )}

              {member.description && (
                <div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{member.description}</p>
                </div>
              )}

              {/* Social Links */}
              {member.socials.length > 0 && (
                <div className="flex flex-wrap gap-4 pt-4">
                  {member.socials.map((social, index) => (
                    <Link
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <img src={social.icon} alt="social" className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        {social.link.includes('linkedin') && 'LinkedIn'}
                        {social.link.includes('instagram') && 'Instagram'}
                        {social.link.includes('facebook') && 'Facebook'}
                        {social.link.includes('github') && 'GitHub'}
                        {social.link.includes('twitter') && 'Twitter'}
                        {social.link.includes('x.com') && 'X'}
                        {!social.link.includes('linkedin') && !social.link.includes('instagram') && 
                         !social.link.includes('facebook') && !social.link.includes('github') && 
                         !social.link.includes('twitter') && !social.link.includes('x.com') && 'Website'}
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
