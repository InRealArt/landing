'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage';
import Button from "@/components/common/Button";
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '100svh' }}>
      <div className="absolute inset-0">
        <div className="w-full h-full [&_img]:!object-center">
          <OptimizedBackgroundImage
            src="/images/usecase/hero_usecase.webp"
            alt={t('fractionate.hero.title')}
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
        <div className="mb-16 border-b border-white/20 pb-12">
          <span className="section-number !text-white/40">Fractionnement</span>
          <div data-anim="fract-hero-title">
            <h1 className="serif italic text-white text-5xl md:text-7xl lg:text-8xl leading-tight mb-6">
              {t('fractionate.hero.title')}
            </h1>
          </div>
          <div data-anim="fract-hero-desc">
            <p className="text-[11px] text-white/60 leading-loose uppercase tracking-[0.2em] max-w-xl mb-8">
              {t('fractionate.hero.description')}
            </p>
          </div>
          <div data-anim="fract-hero-btn">
            <Button
              text={t('fractionate.hero.button')}
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