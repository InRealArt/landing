'use client'

import OptimizedImage from "@/components/common/OptimizedImage";
import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";
import { useLanguageStore } from '@/store/languageStore';
import expertImage from "../../../../public/images/expert.webp";
import { useState, useEffect } from 'react';

export default function Expert() {
  const { t } = useLanguageStore();
  const [sanitizedQuote, setSanitizedQuote] = useState('');
  
  useEffect(() => {
    // Importer DOMPurify uniquement côté client
    const importDOMPurify = async () => {
      const DOMPurify = (await import('dompurify')).default;
      setSanitizedQuote(DOMPurify.sanitize(t('companies.expert.quote')));
    };
    
    importDOMPurify();
  }, [t]);

  return (
    <section id="contact-expert" className="w-full py-32 px-10 bg-soft-gray">
      <div className="max-w-screen-2xl m-auto relative">

        <div className="flex flex-col md:flex-row gap-10 items-center text-center">
          <div className="basis-3/5">
            <span className="section-number">Expertise</span>
            <h1 className="text-6xl md:text-8xl serif text-ink-black mb-8">
              Contactez nos <span className="italic text-gold-accent">experts</span>
            </h1>
            <blockquote className="text-lg md:text-xl montserrat leading-relaxed italic mb-8 text-gray-600" dangerouslySetInnerHTML={{ __html: sanitizedQuote }}/>
            <div className="mb-8">
              <p className="font-medium text-ink-black">{t('companies.expert.name')}</p>
              <p className="text-grayText text-sm">{t('companies.expert.position')}</p>
              <p className="text-grayText text-sm">{t('companies.expert.company')}</p>
            </div>
            <a
              href="/contact"
              className="btn-cta"
            >
              {t('companies.expert.button')}
            </a>
          </div>
          <div className="basis-2/5 w-full md:w-auto">
              <OptimizedImage
                src={expertImage.src}
                alt={t('companies.expert.name')}
                width={320}
                height={320}
                className="w-full [&_img]:w-full [&_img]:h-auto [&_img]:object-contain"
              />
          </div>
        </div>
      </div>
    </section>
  );
} 