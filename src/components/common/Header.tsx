'use client'

import { Menu } from 'lucide-react';
import { Fragment } from 'react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import { useTranslation } from '@/hooks/useTranslation';
import { useState } from 'react';
import MobileMenu from './MobileMenu';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const ArtitudeModal = dynamic(() => import('@/components/artists-studio/ArtitudeModal'), { ssr: false });

const Header = () => {
  const { t } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [artitudeModalOpen, setArtitudeModalOpen] = useState(false);
  const pathname = usePathname();

  const navLink = (href: string, label: string, exact = false, exclude?: string) => {
    const isActive = exact
      ? pathname === href
      : pathname.startsWith(href) && (!exclude || !pathname.startsWith(exclude))
    return (
      <li className="whitespace-nowrap relative group">
        <Link
          href={href}
          className={`text-[13px] uppercase tracking-[0.25em] transition-colors pb-1 ${
            isActive ? 'text-gold-accent' : 'text-textColor hover:text-gold-accent'
          }`}
        >
          {label}
          <span className={`absolute bottom-0 left-0 h-px bg-gold-accent transition-all duration-300 ${
            isActive ? 'w-full' : 'w-0 group-hover:w-full'
          }`} />
        </Link>
      </li>
    )
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Fragment>
      <header className="left-0 right-0 h-16 md:h-headerSize bg-backgroundColor/95 backdrop-blur-md fixed top-0 z-50 border-b border-borderColor">
        <div className='flex gap-2 sm:gap-4 md:gap-6 lg:gap-8 mx-auto items-center justify-between max-w-screen-2xl w-full px-3 sm:px-6 lg:px-10 h-full min-w-0'>
          <Link href="/" className="text-sm sm:text-base md:text-lg lg:text-xl tracking-[0.15em] sm:tracking-[0.3em] md:tracking-[0.4em] lg:tracking-[0.4em] font-light uppercase serif cursor-pointer text-textColor shrink-0">
            InRealArt
          </Link>

          <ul className="hidden xl:flex items-center gap-4 2xl:gap-6">
            {navLink('/artists', t('nav.artists'), false, '/artists-studio')}
            {navLink('/agence', t('nav.agence'))}
            {navLink('/media', t('nav.media'))}
            {navLink('/usecase', t('nav.capital'))}
            {navLink('/team', t('nav.aboutInRealArt'))}
            {navLink('/presale', t('nav.galerie'), true)}
            {navLink('/artists-studio', t('nav.ateliers'), true)}
            <li className="whitespace-nowrap relative group">
              <Link
                href="/contact"
                className="text-[13px] uppercase tracking-[0.25em] font-bold text-gold-accent transition-colors pb-1"
                data-umami-event="contact-header-click"
              >
                {t('nav.contact')}
                <span className="absolute bottom-0 left-0 h-px bg-gold-accent w-full" />
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <button
              onClick={() => setArtitudeModalOpen(true)}
              className="hidden sm:block bg-textColor text-backgroundColor hover:bg-gold-accent hover:text-white transition-all text-[10px] font-unbounded font-semibold uppercase tracking-wider px-3 py-2 rounded-lg whitespace-nowrap"
            >
              Artitude Join
            </button>
            <button
              className="text-textColor p-2.5 xl:hidden min-w-[44px] min-h-[44px] flex items-center justify-center"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <ArtitudeModal isOpen={artitudeModalOpen} onClose={() => setArtitudeModalOpen(false)} />
    </Fragment>
  );
}

export default Header;