'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage';
import Button from "@/components/common/Button";
import TranslatedText from '@/components/common/TranslatedText';
import { useLanguageStore } from '@/store/languageStore';

export default function Hero() {
  const { t } = useLanguageStore();

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '100svh' }}>
      <div className="absolute inset-0">
        <div className="w-full h-full [&_img]:!object-center">
          <OptimizedBackgroundImage
            src="/images/usecase/hero_usecase.webp?v=2"
            alt={t('companies.hero.title')}
            width={1920}
            height={1080}
            className="w-full h-full"
            overlay={false}
          />
        </div>
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/90 z-10" />

      {/* Content — bottom anchored */}
      <div
        className="relative z-20 flex flex-col justify-end px-10 pb-20 pt-[calc(var(--header-height)+5rem)] max-w-screen-2xl mx-auto"
        style={{ minHeight: '100svh' }}
      >
        {/* Editorial header block */}
        <div className="mb-16 border-b border-white/20 pb-12">
          <span className="section-number !text-white/40">Art & Entreprise</span>
          <div data-anim="companies-hero-title">
            <TranslatedText
              translationKey="companies.hero.title"
              as="h1"
              className="serif italic text-white text-5xl md:text-7xl lg:text-8xl leading-tight mb-8"
              allowHtml={true}
            />
          </div>
          <div data-anim="companies-hero-btn">
            <Button
              text={t('companies.hero.button')}
              additionalClassName="bg-purpleColor !border-white/40 !text-white"
              link="/contact"
            />
          </div>
        </div>

        {/* Description — three columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
          <div data-anim="companies-hero-col" className="bg-white/5 backdrop-blur-sm p-8">
            <TranslatedText
              translationKey="companies.hero.description.p1"
              as="p"
              className="text-[11px] text-white/60 leading-loose uppercase tracking-[0.2em]"
              allowHtml={true}
            />
          </div>
          <div data-anim="companies-hero-col" className="bg-white/5 backdrop-blur-sm p-8">
            <TranslatedText
              translationKey="companies.hero.description.p2"
              as="p"
              className="text-[11px] text-white/60 leading-loose uppercase tracking-[0.2em]"
              allowHtml={true}
            />
          </div>
          <div data-anim="companies-hero-col" className="bg-white/5 backdrop-blur-sm p-8">
            <TranslatedText
              translationKey="companies.hero.description.p3"
              as="p"
              className="text-[11px] text-white/60 leading-loose uppercase tracking-[0.2em]"
              allowHtml={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
} 