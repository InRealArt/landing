'use client'

import Image from 'next/image'
import Button from './Button';
import { ArrowRight, Menu } from 'lucide-react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguageStore } from '@/store/languageStore';
import { useState } from 'react';
import MobileMenu from './MobileMenu';

const Header = () => {
  const { t } = useLanguageStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="w-full h-headerSize bg-backgroundColor fixed top-0 z-50">
      <div className='flex gap-20 m-auto items-center justify-between max-w-90 xl:max-w-screen-xl h-full'>
        <Link href="/">
          <Image src={`/icons/Logo.png`} alt='IRA-LOGO' width="101" height="32" />
        </Link>
        <ul className="gap-8 items-center hidden lg:flex bricolage-grotesque font-semibold">
          <Link href="/">{t('nav.home')}</Link>
          <Link href="/marketplace">Marketplace</Link>
          <Link href="/usecase">{t('nav.usecase')}</Link>
          <Link href="/roadmap">Roadmap</Link>
          <Link href="/blog">Blog</Link>
        </ul>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button text={t('buttons.presale')} additionalClassName="bg-purpleColor hidden lg:flex" icon={<ArrowRight />} center link="/presale" />
          <button 
            className="text-white p-2 lg:hidden" 
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