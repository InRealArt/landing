'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'
import TranslatedText from '@/components/common/TranslatedText'
import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";
import { useLanguageStore } from '@/store/languageStore';

const CASE_NUMBERS = ['01.', '02.', '03.', '04.'];

export default function Header() {
  const { t } = useLanguageStore();

  const caseStudies = [
    {
      title: t('usecase.items.leasing.title'),
      link: "/usecase/leasing",
      description: t('usecase.items.leasing.description')
    },
    {
      title: t('usecase.items.companies.title'),
      link: "/usecase/companies",
      description: t('usecase.items.companies.description')
    },
    {
      title: t('usecase.items.fractionate.title'),
      link: "/usecase/fractionate",
      description: t('usecase.items.fractionate.description')
    },
    {
      title: t('usecase.items.lending.title'),
      link: "/usecase/lending",
      description: t('usecase.items.lending.description')
    }
  ];

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '100svh' }}>
      {/* Background image */}
      <div className="absolute inset-0">
        <div className="w-full h-full [&_img]:!object-bottom">
          <OptimizedBackgroundImage
            src="/images/usecase/hero_usecase.webp?v=2"
            alt={t('usecase.intro.title')}
            width={1920}
            height={1080}
            className="w-full h-full"
            overlay={false}
          />
        </div>
      </div>

      {/* Deep gradient overlay — nearly opaque at bottom for card legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/50 to-black/90 z-10" />

      {/* Content */}
      <div className="relative z-20 flex flex-col justify-end px-10 pb-20 pt-[calc(var(--header-height)+5rem)] max-w-screen-2xl mx-auto min-h-[inherit]" style={{ minHeight: '100svh' }}>

        {/* Editorial header */}
        <div className="mb-16 border-b border-white/20 pb-12">
          <span className="section-number !text-white/40">
            {t('usecase.intro.label') || 'Cas d\'usage'}
          </span>
          <div data-anim="hero-title">
            <TranslatedText
              translationKey="usecase.intro.title"
              as="h1"
              className="serif italic text-white text-5xl md:text-7xl lg:text-8xl leading-tight mb-6"
              allowHtml={true}
            />
          </div>
          <div data-anim="hero-subtitle">
            <TranslatedText
              translationKey="usecase.intro.subtitle"
              as="p"
              className="text-[11px] uppercase tracking-[0.3em] text-white/60 max-w-xl leading-relaxed"
              allowHtml={true}
            />
          </div>
        </div>

        {/* Case study cards — gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
          {caseStudies.map((caseStudy, index) => (
            <div
              key={index}
              data-anim="hero-card"
              className="bg-white/5 backdrop-blur-sm border-0 p-8 flex flex-col justify-between group hover:bg-white/10 transition-colors duration-500"
            >
              <div>
                <span className="serif text-3xl italic text-[#b89c72] block mb-4">
                  {CASE_NUMBERS[index]}
                </span>
                <TranslatedText
                  content={caseStudy.title}
                  as="h3"
                  className="serif italic text-white text-2xl leading-snug mb-4"
                  allowHtml={true}
                />
                <TranslatedText
                  content={caseStudy.description}
                  as="p"
                  className="text-[12px] text-white/50 leading-loose"
                  allowHtml={true}
                />
              </div>
              <Button
                text={t('buttons.readMore')}
                additionalClassName="bg-purpleColor mt-8 !border-white/40 !text-white hover:!bg-white hover:!text-black"
                icon={<ArrowRight size={12} />}
                link={caseStudy.link}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 