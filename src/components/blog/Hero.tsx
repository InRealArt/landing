'use client'

import { useTranslation } from '@/hooks/useTranslation';
import TranslatedText from '@/components/common/TranslatedText';

export default function Hero() {
  const { t } = useTranslation();
  
  return (
    <section className="py-32 px-10 max-w-screen-2xl mx-auto border-b border-[var(--border-light)]">
      <span className="section-number">Le Journal</span>
      <div data-anim="blog-hero-title">
        <TranslatedText
          translationKey="blog.title"
          as="h1"
          className="serif italic text-6xl md:text-8xl lg:text-[8rem] leading-none text-[var(--ink-black)]"
          allowHtml={true}
        />
      </div>
      <div data-anim="blog-hero-subtitle">
        <TranslatedText
          translationKey="blog.subtitle"
          as="p"
          className="text-[11px] uppercase tracking-[0.3em] text-[var(--gray-text)] max-w-2xl leading-loose mt-6"
          allowHtml={true}
        />
      </div>
    </section>
  );
} 