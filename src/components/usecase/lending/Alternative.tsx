'use client'

import { useLanguageStore } from '@/store/languageStore';

export default function Alternative() {
  const { t } = useLanguageStore();

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl bricolage-grotesque font-medium mb-8" dangerouslySetInnerHTML={{ __html: t('lending.alternative.title') }} />
        </div>
      </div>
    </section>
  );
} 