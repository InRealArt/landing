'use client'

import OptimizedImage from './OptimizedImage'
import { Phone, ArrowRight, Menu } from 'lucide-react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import { useLanguageStore } from '@/store/languageStore';
import { useState } from 'react';
import MobileMenu from './MobileMenu';
import { useTheme } from '@/contexts/ThemeContext';
import { EXTERNAL_URLS } from '@/constants/constants';

const Header = () => {
  const t = useLanguageStore(state => state.t)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full h-16 md:h-headerSize bg-canvas-white/95 backdrop-blur-md fixed top-0 z-50 border-b border-border-light">
      <div className='flex gap-20 mx-auto items-center justify-between max-w-screen-2xl w-full px-10 h-full'>
        <Link href="/" className="text-2xl tracking-[0.7em] font-light uppercase serif cursor-pointer text-ink-black">
          InRealArt
        </Link>
        
        <ul className="flex items-center gap-8 hidden xl:flex">
          <li className="whitespace-nowrap">
            <Link href="/artists" className="text-[9px] uppercase tracking-[0.25em] hover:text-gold-accent transition-colors text-ink-black">
              {t('nav.artists')}
            </Link>
          </li>
          <li className="whitespace-nowrap">
            <Link href="/presale" className="text-[9px] uppercase tracking-[0.25em] hover:text-gold-accent transition-colors text-ink-black">
              {t('nav.artworks')}
            </Link>
          </li>
          <li className="whitespace-nowrap">
            <Link href="/usecase" className="text-[9px] uppercase tracking-[0.25em] hover:text-gold-accent transition-colors text-ink-black">
              {t('nav.usecase')}
            </Link>
          </li>
          <li className="whitespace-nowrap">
            <Link href="/blog" className="text-[9px] uppercase tracking-[0.25em] hover:text-gold-accent transition-colors text-ink-black">
              Blog
            </Link>
          </li>
          <li className="whitespace-nowrap">
            <Link href="/about" className="text-[9px] uppercase tracking-[0.25em] hover:text-gold-accent transition-colors text-ink-black">
              {t('nav.aboutInRealArt')}
            </Link>
          </li>
          <li className="whitespace-nowrap">
            <a
              href={EXTERNAL_URLS.CALENDLY_MEETING}
              className="text-[9px] uppercase tracking-[0.25em] font-bold text-gold-accent border-b border-gold-accent/30 hover:text-gold-accent/70 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="calendly-header-click"
            >
              Contact
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
          <button
            className="text-textColor p-2 lg:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </header>
  );
}

export default Header;