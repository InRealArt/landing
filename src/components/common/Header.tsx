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

const ArtitudeModal = dynamic(() => import('@/components/artists-studio/ArtitudeModal'), { ssr: false });

const Header = () => {
  const { t } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [artitudeModalOpen, setArtitudeModalOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Fragment>
      <header className="left-0 right-0 h-16 md:h-headerSize bg-backgroundColor/95 backdrop-blur-md fixed top-0 z-50 border-b border-borderColor">
        <div className='flex gap-2 sm:gap-4 md:gap-6 lg:gap-20 mx-auto items-center justify-between max-w-screen-2xl w-full px-3 sm:px-6 lg:px-10 h-full min-w-0'>
          <Link href="/" className="text-sm sm:text-base md:text-lg lg:text-xl tracking-[0.15em] sm:tracking-[0.3em] md:tracking-[0.5em] lg:tracking-[0.7em] font-light uppercase serif cursor-pointer text-textColor shrink min-w-0">
            InRealArt
          </Link>

          <ul className="hidden xl:flex items-center gap-8">
            <li className="whitespace-nowrap">
              <Link href="/artists" className="text-[13px] uppercase tracking-[0.25em] hover:text-gold-accent transition-colors text-textColor">
                {t('nav.artists')}
              </Link>
            </li>
            <li className="whitespace-nowrap">
              <Link href="/agence" className="text-[13px] uppercase tracking-[0.25em] hover:text-gold-accent transition-colors text-textColor">
                {t('nav.agence')}
              </Link>
            </li>
            <li className="whitespace-nowrap">
              <Link href="/media" className="text-[13px] uppercase tracking-[0.25em] hover:text-gold-accent transition-colors text-textColor">
                {t('nav.media')}
              </Link>
            </li>
            <li className="whitespace-nowrap">
              <Link href="/usecase" className="text-[13px] uppercase tracking-[0.25em] hover:text-gold-accent transition-colors text-textColor">
                {t('nav.capital')}
              </Link>
            </li>
            <li className="whitespace-nowrap">
              <Link href="/team" className="text-[13px] uppercase tracking-[0.25em] hover:text-gold-accent transition-colors text-textColor">
                {t('nav.aboutInRealArt')}
              </Link>
            </li>
            <li className="whitespace-nowrap">
              <Link href="/presale" className="text-[13px] uppercase tracking-[0.25em] hover:text-gold-accent transition-colors text-textColor">
                {t('nav.galerie')}
              </Link>
            </li>
            <li className="whitespace-nowrap">
              <Link href="/artists-studio" className="text-[13px] uppercase tracking-[0.25em] hover:text-gold-accent transition-colors text-textColor">
                {t('nav.ateliers')}
              </Link>
            </li>
            <li className="whitespace-nowrap">
              <Link
                href="/contact"
                className="text-[13px] uppercase tracking-[0.25em] font-bold text-gold-accent border-b border-gold-accent/30 hover:text-gold-accent/70 transition-colors"
                data-umami-event="contact-header-click"
              >
                {t('nav.contact')}
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <LanguageSwitcher />
            <ThemeSwitcher />
            <button
              onClick={() => setArtitudeModalOpen(true)}
              className="hidden sm:block bg-textColor text-backgroundColor hover:bg-gold-accent hover:text-white transition-all text-xs font-unbounded font-semibold uppercase tracking-wider px-4 py-2 rounded-lg whitespace-nowrap"
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