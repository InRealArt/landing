'use client'

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";
import { useLanguageStore } from '@/store/languageStore';
import expertImage from "../../../../public/images/expert.png";
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
    <section id="contact-expert" className="w-full py-16">
      <div className="max-w-90 xl:max-w-screen-xl m-auto relative">

        <div className="flex flex-col md:flex-row gap-10 items-center text-center">
          <div className="basis-3/5">
            <h1 className="text-3xl md:text-6xl bricolage-grotesque mb-8">
              {t('companies.expert.title')}
            </h1>
            <blockquote className="text-lg md:text-xl bricolage-grotesque leading-relaxed italic mb-8" dangerouslySetInnerHTML={{ __html: sanitizedQuote }}/>
            <div className="mb-8">
              <p className="font-medium">{t('companies.expert.name')}</p>
              <p className="text-gray-300 text-sm">{t('companies.expert.position')}</p>
              <p className="text-gray-300 text-sm">{t('companies.expert.company')}</p>
            </div>
            <Button
              text={t('companies.expert.button')}
              additionalClassName="bg-purpleColor"
              icon={<ArrowRight />}
              link="/contact"
            />
          </div>
          <div className="basis-2/5 w-full md:w-auto">
              <Image
                src={expertImage}
                alt={t('companies.expert.name')}
                width={320}
                height={320}
                className="w-full h-full object-contain"
              />
          </div>
        </div>
      </div>
    </section>
  );
} 