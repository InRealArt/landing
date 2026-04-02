'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { ArrowRight, Phone, X } from 'lucide-react'
import Button from './Button'
import { usePathname } from 'next/navigation'
import { EXTERNAL_URLS } from '@/constants/constants'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { t } = useTranslation()
  const pathname = usePathname()

  const initialMount = useRef(true)

  // Close menu when navigating to a new page
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false
      return
    }
    onClose()
  }, [pathname])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])


  return (
    <div className={`fixed inset-0 z-50 bg-opacity-80 flex transition-opacity duration-300 ease-in-out overflow-hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none invisible'}`}>
      <div className={`bg-cardBackground min-h-[100vh] w-full max-w-[85%] p-6 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-end mb-8">
          <button onClick={onClose} className="text-textColor p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center">
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-6 bricolage-grotesque font-semibold text-xl">
          <Link
            href="/team"
            className={`${pathname === '/team' ? 'text-purpleColor' : 'text-textColor'} py-2 border-b border-textColor/10`}
            onClick={onClose}
          >
            {t('nav.aboutInRealArt')}
          </Link>
          <Link
            href="/presale"
            className={`${pathname === '/presale' ? 'text-purpleColor' : 'text-textColor'} py-2 border-b border-textColor/10`}
            onClick={onClose}
          >
            {t('nav.artworks')}
          </Link>
          <Link
            href="/artists"
            className={`${pathname === '/artists' ? 'text-purpleColor' : 'text-textColor'} py-2 border-b border-textColor/10`}
            onClick={onClose}
          >
            {t('nav.artists')}
          </Link>
          <Link
            href="/usecase"
            className={`${pathname === '/usecase' ? 'text-purpleColor' : 'text-textColor'} py-2 border-b border-textColor/10`}
            onClick={onClose}
          >
            {t('nav.usecase')}
          </Link>
          <Link
            href="/media"
            className={`${pathname === '/media' ? 'text-purpleColor' : 'text-textColor'} py-2 border-b border-textColor/10`}
            onClick={onClose}
          >
            {t('nav.blog')}
          </Link>
          <Link
            href="/joinInRealArt"
            className={`text-textColor py-2 border-b border-textColor/10`}
            onClick={onClose}
            data-umami-event="joinInRealArt-mobile-menu-click"
          >
            {t('nav.joinInRealArt')}
          </Link>          
        </nav>

        <div className="mt-16 ">
          <Button
            text={t('buttons.contactUs')}
            additionalClassName="bg-purpleColor w-full"
            icon={<Phone />}
            center
            target='_blank'
            link={EXTERNAL_URLS.CALENDLY_MEETING}
            data-umami-event="calendly-mobile-click"
          />
        </div>
      </div>
      <div className='max-w-[15%] w-full h-full cursor-pointer' onClick={onClose} />
    </div>
  )
} 