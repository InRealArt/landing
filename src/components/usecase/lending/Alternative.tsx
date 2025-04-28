'use client'

import { useLanguageStore } from '@/store/languageStore';
import { useState, useEffect } from 'react';

export default function Alternative() {
  const { t } = useLanguageStore();
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
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl bricolage-grotesque font-medium mb-8" dangerouslySetInnerHTML={{ __html: sanitizedTitle }} />
        </div>
      </div>
    </section>
  );
} 