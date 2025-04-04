'use client'

import { useLanguageStore } from '@/store/languageStore';

export default function Hero() {
  const { t } = useLanguageStore();
  
  return (
    <section className="mx-auto pb-10 px-4 max-w-screen-xl">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 bricolage-grotesque">{t('blog.title')}</h1>
      <p className="text-lg text-gray-300 mb-12 max-w-3xl">
        {t('blog.subtitle')}
      </p>
    </section>
  );
} 