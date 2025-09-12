'use client'

import { useLanguageStore } from '@/store/languageStore';
import TranslatedText from '@/components/common/TranslatedText';

export default function Hero() {
  const { t } = useLanguageStore();
  
  return (
    <section className="mx-auto pb-10 px-4 max-w-screen-xl pt-20 mt-4 sm:mt-0 md:pt-[calc(var(--header-height)+1rem)]">
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