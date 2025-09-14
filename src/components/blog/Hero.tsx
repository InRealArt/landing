'use client'

import { useLanguageStore } from '@/store/languageStore';
import TranslatedText from '@/components/common/TranslatedText';

export default function Hero() {
  const { t } = useLanguageStore();
  
  return (
    <section className="mx-auto pb-10 px-4 max-w-screen-xl mt-4">
      <TranslatedText
        translationKey="blog.title"
        as="h1"
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bricolage-grotesque leading-tight"
        allowHtml={true}
      />
      <TranslatedText
        translationKey="blog.subtitle"
        as="p"
        className="text-base sm:text-lg text-grayText mb-8 md:mb-12 max-w-3xl leading-relaxed"
        allowHtml={true}
      />
    </section>
  );
} 