'use client'

import { useLanguageStore } from '@/store/languageStore';
import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../common/Button';

export default function Contact() {
  const { t } = useLanguageStore();
  
  // Contact information
  const contactInfo = {
    phone: '+33 (0)6 37 32 08 33',
    email: 'teaminrealart@gmail.com',
    social: [
      { name: 'LinkedIn', icon: '/icons/linkedin.svg', url: 'https://www.linkedin.com/company/inrealart/' },
      { name: 'Instagram', icon: '/icons/instagram.svg', url: 'https://www.instagram.com/inrealartgallery/' },
      { name: 'Facebook', icon: '/icons/facebook.svg', url: 'https://www.facebook.com/inrealart' },
      { name: 'Twitter', icon: '/icons/twitter.svg', url: 'https://x.com/InRealArt/' },
    ]
  };
  
  return (
    <section className="w-full py-16 pt-headerSize">
      <div className="max-w-90 xl:max-w-screen-xl m-auto relative">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-3xl md:text-6xl bricolage-grotesque mb-8">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-16">
            {t('contact.subtitle')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-4xl">
            {/* Phone */}
            <div className="bg-cardBackground p-8 rounded-lg border border-white/20 flex flex-col items-center">
              <div className="bg-purpleColor rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Phone size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-medium mb-3">{t('contact.phone')}</h3>
              <p className="text-gray-300 mb-6">{contactInfo.phone}</p>
              <Button
                text={t('contact.callNow')}
                additionalClassName="bg-purpleColor w-full"
                link={`tel:${contactInfo.phone.replace(/\s+|\(|\)/g, '')}`}
                center
              />
            </div>
            
            {/* Email */}
            <div className="bg-cardBackground p-8 rounded-lg border border-white/20 flex flex-col items-center">
              <div className="bg-purpleColor rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Mail size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-medium mb-3">{t('contact.email')}</h3>
              <p className="text-gray-300 mb-6">{contactInfo.email}</p>
              <Button
                text={t('contact.sendEmail')}
                additionalClassName="bg-purpleColor w-full"
                link={`mailto:${contactInfo.email}`}
                center
              />
            </div>
            
            {/* Social */}
            <div className="bg-cardBackground p-8 rounded-lg border border-white/20 flex flex-col items-center">
              <div className="bg-purpleColor rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Image src="/icons/linkedin.svg" alt="Social" width={24} height={24} className="text-white" />
              </div>
              <h3 className="text-xl font-medium mb-3">{t('contact.social')}</h3>
              <div className="flex gap-4 mb-6">
                {contactInfo.social.map((platform) => (
                  <Link 
                    key={platform.name} 
                    href={platform.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    aria-label={platform.name}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <Image 
                      src={platform.icon} 
                      alt={platform.name} 
                      width={24} 
                      height={24} 
                      className="text-white" 
                    />
                  </Link>
                ))}
              </div>
              <p className="text-gray-300">{t('contact.followUs')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 