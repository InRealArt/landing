'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage';
import Button from "@/components/common/Button";
import { useLanguageStore } from '@/store/languageStore';
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const { t } = useLanguageStore();

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '100svh' }}>
      <div className="absolute inset-0">
        <div className="w-full h-full [&_img]:!object-center">
          <OptimizedBackgroundImage
            src="/images/usecase/hero_usecase.webp?v=2"
            alt={t('lending.hero.title')}
            width={1920}
            height={1080}
            className="w-full h-full"
            overlay={false}
            priority={true}
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
        <div className="mb-16 border-b border-white/20 pb-12">
          <span className="section-number !text-white/40">Financement par l&apos;Art</span>
          <div data-anim="lending-hero-title">
            <h1 className="serif italic text-white text-5xl md:text-7xl lg:text-8xl leading-tight mb-6">
              {t('lending.hero.title')}
            </h1>
          </div>
          <div data-anim="lending-hero-desc">
            <p className="text-[11px] text-white/60 leading-loose uppercase tracking-[0.2em] max-w-xl mb-8">
              {t('lending.hero.description')}
            </p>
          </div>
          <div data-anim="lending-hero-btn">
            <Button
              text={t('lending.hero.button')}
              additionalClassName="bg-purpleColor !border-white/40 !text-white"
              icon={<ArrowRight size={12} />}
              link="/contact"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 