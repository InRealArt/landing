'use client'

import Image from "next/image";
import Button from "@/components/common/Button";
import marketplaceImage from "../../../../public/images/marketplace_dark.png";
import { useLanguageStore } from '@/store/languageStore';
import { useState, useEffect } from 'react';

export default function Hero() {
  const { t } = useLanguageStore();
  const [sanitizedTitle, setSanitizedTitle] = useState('');
  
  useEffect(() => {
    // Importer DOMPurify uniquement côté client
    const importDOMPurify = async () => {
      const DOMPurify = (await import('dompurify')).default;
      setSanitizedTitle(DOMPurify.sanitize(t('companies.hero.title')));
    };
    
    importDOMPurify();
  }, [t]);

  return (
    <section className="relative bg-cover m-auto bg-no-repeat bg-bottom h-screen w-full flex items-center justify-center" style={{ backgroundImage: ` url('${marketplaceImage.src}')` }}>
      {/* Content Overlay */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Title and Button */}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl bricolage-grotesque font-medium mb-6" dangerouslySetInnerHTML={{ __html: sanitizedTitle }} />
            <div className="mt-auto">
              <Button
                text={t('companies.hero.button')}
                additionalClassName="bg-purpleColor"
                link="/contact"
              />
            </div>
          </div>

          {/* Right Column - Text */}
          <div className="text-lg inter text-gray-200">
            <p className="mb-4">
              {t('companies.hero.description.p1')}
            </p>
            <p className="mb-4">
              {t('companies.hero.description.p2')}
            </p>
            <p>
              {t('companies.hero.description.p3')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 