'use client'

import Image from 'next/image'
import { useLanguageStore } from '@/store/languageStore'

const Footer = () => {
  const { t } = useLanguageStore()

  return (
    <footer className="w-full min-h-footerSize bg-cardBackground mt-36 flex flex-wrap items-center py-8">
      <div className='w-full flex flex-wrap m-auto justify-between max-w-90 xl:max-w-screen-xl'>
        <div className='socials'>
          <Image className='mb-12 md:mb-0' src={`/icons/Logo.png`} alt='IRA-LOGO' width="101" height="32" />
        </div>
        <div className='flex flex-wrap gap-12'>
          <ul className="flex flex-col gap-2">
            <h2 className='font-semibold unbounded mb-2'>{t('footer.pages')}</h2>
            <li>{t('nav.home')}</li>
            <li>{t('nav.team')}</li>
            <li>{t('nav.marketplace')}</li>
            <li>{t('nav.faq')}</li>
          </ul>
          <ul className="flex flex-col gap-2">
            <h2 className='font-semibold unbounded mb-2'>{t('footer.company')}</h2>
            <li>{t('nav.team')}</li>
            <li>{t('footer.partner')}</li>
            <li>{t('footer.terms')}</li>
          </ul>
          <div />
          <ul className="flex flex-col gap-2">
            <h2 className='font-semibold unbounded mb-2'>{t('footer.contact')}</h2>
            <li>{t('footer.location')}</li>
            <li>{t('footer.email')}</li>
            <input className='w-72 md:w-80 bg-transparent border border-white bricolage-grotesque rounded-3xl font-semibold border-1 py-6 px-4 mt-4 outline-0' type="text" placeholder={t('buttons.subscribe')} />
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;