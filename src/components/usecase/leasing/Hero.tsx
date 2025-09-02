'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage';
import Button from "@/components/common/Button";
import { useLanguageStore } from '@/store/languageStore';
import { useState, useEffect } from 'react';
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const { t } = useLanguageStore();
  const [sanitizedTitle, setSanitizedTitle] = useState('');
  
  useEffect(() => {
    // Importer DOMPurify uniquement côté client
    const importDOMPurify = async () => {
      const DOMPurify = (await import('dompurify')).default;
      setSanitizedTitle(DOMPurify.sanitize(t('leasing.hero.title')));
    };
    
    importDOMPurify();
  }, [t]);

  return (
    <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
      <div className="absolute inset-0">
        <div className="w-full h-full [&_img]:!object-center [&_img]:scale-110">
          <OptimizedBackgroundImage
            src="/images/usecase/usecase_leasing.webp"
            alt={t('leasing.hero.title')}
            width={1920}
            height={1080}
            className="w-full h-full"
            overlay={false}
          />
        </div>
      </div>
      
      {/* Dégradé du bas vers le background RGB(19, 19, 19) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(19,19,19)] via-[rgb(19,19,19,0.8)] to-transparent z-10" />

      {/* Content Overlay */}
      <div className="container mx-auto px-4 relative z-20 pt-headerSize pb-20 h-full flex items-center justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Title and Button */}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl bricolage-grotesque font-medium mb-6 text-white" dangerouslySetInnerHTML={{ __html: sanitizedTitle }} />
            <div className="mt-auto">
                  <Button
                    text={t('leasing.hero.button')}
                    additionalClassName="bg-purpleColor"
                    icon={<ArrowRight />}
                    link="/contact"
                  />
            </div>
          </div>

          {/* Right Column - Text */}
          <div className="text-lg inter text-white/90">
            <p className="mb-4">
              {t('leasing.hero.description.p1')}
            </p>
            <p className="mb-4">
              {t('leasing.hero.description.p2')}
            </p>
            <p>
              {t('leasing.hero.description.p3')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 