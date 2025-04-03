'use client'

import Image from 'next/image'
import Button from './Button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguageStore } from '@/store/languageStore';

const Header = () => {
  const { t } = useLanguageStore()

  return (
    <header className="w-full h-headerSize bg-backgroundColor fixed top-0 z-50">
      <div className='flex gap-20 m-auto items-center justify-between max-w-90 xl:max-w-screen-xl h-full'>
        <Link href="/">
          <Image src={`/icons/Logo.png`} alt='IRA-LOGO' width="101" height="32" />
        </Link>
        <ul className="gap-8 items-center hidden lg:flex bricolage-grotesque font-semibold">
          <Link href="/">{t('nav.home')}</Link>
          <Link href="/whitepaper">White Paper</Link>
          <Link href="/usecase">{t('nav.usecase')}</Link>
          <Link href="/airdrop">AirDrop/Testnet</Link>
          <Link href="/blog">Blog</Link>
        </ul>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <Button text={t('buttons.presale')} additionalClassName="bg-purpleColor" icon={<ArrowRight />} center link="/presale" />
        </div>
      </div>
      
    </header>
  );
}

export default Header;