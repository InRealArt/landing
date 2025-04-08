'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguageStore } from '@/store/languageStore'
import { ArrowRight, X } from 'lucide-react'
import Button from './Button'
import { usePathname } from 'next/navigation'

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { t } = useLanguageStore()
  const pathname = usePathname()
  
  // Close menu when navigating to a new page
  useEffect(() => {
    if (isOpen) {
      onClose()
    }
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
    <div className={`fixed inset-0 z-50  bg-opacity-80 flex transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-cardBackground min-h-[100vh] w-full max-w-[85%] p-6 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-end mb-8">
          <button onClick={onClose} className="text-white p-2">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex flex-col gap-6 bricolage-grotesque font-semibold text-xl">
          <Link 
            href="/" 
            className={`${pathname === '/' ? 'text-purpleColor' : 'text-white'} py-2 border-b border-[#ffffff1f]`}
            onClick={onClose}
          >
            {t('nav.home')}
          </Link>
          
          <Link 
            href="/marketplace" 
            className={`${pathname === '/marketplace' ? 'text-purpleColor' : 'text-white'} py-2 border-b border-[#ffffff1f]`}
            onClick={onClose}
          >
            {t('nav.marketplace')}
          </Link>
          <Link 
            href="/usecase" 
            className={`${pathname === '/usecase' ? 'text-purpleColor' : 'text-white'} py-2 border-b border-[#ffffff1f]`}
            onClick={onClose}
          >
            {t('nav.usecase')}
          </Link>
          <Link 
            href="/roadmap" 
            className={`${pathname === '/roadmap' ? 'text-purpleColor' : 'text-white'} py-2 border-b border-[#ffffff1f]`}
            onClick={onClose}
          >
            {t('nav.roadmap')}
          </Link>
          <Link 
            href="/blog" 
            className={`${pathname === '/blog' ? 'text-purpleColor' : 'text-white'} py-2 border-b border-[#ffffff1f]`}
            onClick={onClose}
          >
            {t('nav.blog')}
          </Link>
        </nav>
        
        <div className="mt-16 ">
          <Button 
            text={t('buttons.presale')} 
            additionalClassName="bg-purpleColor w-full" 
            icon={<ArrowRight />} 
            center 
            link="/presale" 
          />
        </div>
      </div>
      <div className='max-w-[15%] w-full h-full' onClick={onClose} />
    </div>
  )
} 