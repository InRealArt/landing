'use client'

import { useTranslation } from '@/hooks/useTranslation';
import { useState, useEffect } from 'react';

export default function Alternative() {
  const { t } = useTranslation();
  const [sanitizedTitle, setSanitizedTitle] = useState('');
  
  useEffect(() => {
    // Importer DOMPurify uniquement côté client
    const importDOMPurify = async () => {
      const DOMPurify = (await import('dompurify')).default;
      setSanitizedTitle(DOMPurify.sanitize(t('lending.alternative.title')));
    };
    
    importDOMPurify();
  }, [t]);

  return (
    <section className="py-32 px-10 bg-[var(--ink-black)]">
      <div className="max-w-screen-2xl mx-auto">
        <div data-anim="lending-alt-title" className="text-center max-w-5xl mx-auto">
          <span className="section-number !text-white/30">Perspective</span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl serif italic leading-tight text-white [&_span]:text-[var(--gold-accent)]" dangerouslySetInnerHTML={{ __html: sanitizedTitle }} />
        </div>
      </div>
    </section>
  );
} 