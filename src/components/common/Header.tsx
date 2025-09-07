'use client'

import OptimizedImage from './OptimizedImage'
import Button from './Button';
import { Phone, ArrowRight, Menu } from 'lucide-react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import { useLanguageStore } from '@/store/languageStore';
import { useState } from 'react';
import MobileMenu from './MobileMenu';
import { useTheme } from '@/contexts/ThemeContext';

const Header = () => {
  const { t } = useLanguageStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full h-headerSize bg-backgroundColor fixed top-0 z-50">
      <div className='flex gap-20 mx-auto items-center justify-between max-w-7xl w-full px-4 sm:px-6 lg:px-8 h-full'>
        <Link href="/">
          <OptimizedImage
            className={`${theme === 'light' ? 'invert' : ''}`}
            src="/icons/Logo.png"
            alt='IRA-LOGO'
            width={101}
            height={32}
            priority={true}
            quality={95}
          />
        </Link>
        <ul className="gap-6 items-center hidden lg:flex bricolage-grotesque font-semibold">
          <Link href="/">{t('nav.home')}</Link>
          <Link href="/presale">{t('nav.artworks')}</Link>
          <Link href="/artists">{t('nav.artists')}</Link>
          <Link href="/joinInRealArt">{t('nav.joinInRealArt')}</Link>
          <Link href="/usecase">{t('nav.usecase')}</Link>

          <Link href="/blog">Blog</Link>
          <Link href="/about">{t('nav.aboutInRealArt')}</Link>
        </ul>
        <div className="flex items-center gap-4">
          <ThemeSwitcher />
          <LanguageSwitcher />
          <Button text={t('buttons.presale')} iconBefore additionalClassName="bg-purpleColor hidden lg:flex" icon={<Phone />} center target='_blank' link="https://calendly.com/teaminrealart/plus-de-visibilite-plus-de-ventes" />
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