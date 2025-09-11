'use client'

import { useLanguageStore } from '@/store/languageStore';
import TranslatedText from '@/components/common/TranslatedText';

export default function Hero() {
  const { t } = useLanguageStore();
  
  return (
    <section className="mx-auto pb-10 px-4 max-w-screen-xl">
      <TranslatedText
        translationKey="blog.title"
        as="h1"
        className="text-3xl md:text-5xl font-bold mb-4 bricolage-grotesque"
        allowHtml={true}
      />
      <TranslatedText
        translationKey="blog.subtitle"
        as="p"
        className="text-lg text-grayText mb-12 max-w-3xl"
        allowHtml={true}
      />
    </section>
  );
} 