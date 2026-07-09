'use client'

import Button from '@/components/common/Button';
import { useTranslation } from '@/hooks/useTranslation';
import { ArrowRight } from 'lucide-react';
import OptimizedImage from '@/components/common/OptimizedImage';

export default function Advantages() {
  const { t } = useTranslation();

  return (
    <section className="py-32 px-10 bg-[var(--canvas-bg)] border-b border-[var(--border-light)]">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div data-anim="lending-adv-text">
            <span className="section-number">Avantages</span>
            <h2 className="text-5xl md:text-7xl serif italic leading-tight mb-8">
              {t('lending.advantages.title')}
            </h2>
            <p className="text-sm text-[var(--gray-text)] leading-loose mb-10">
              {t('lending.advantages.description')}
            </p>
            <Button
              text={t('lending.advantages.button')}
              additionalClassName="bg-purpleColor"
              icon={<ArrowRight size={12} />}
              link="/contact"
            />
          </div>
          <div data-anim="lending-adv-img" className="border border-[var(--border-light)] overflow-hidden">
            <OptimizedImage
              src="/images/usecase/lending/pigcoin.webp"
              alt="Solutions sur mesures"
              className="w-full [&_img]:w-full [&_img]:h-auto [&_img]:object-contain"
              width={665}
              height={665}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 665px"
              quality={75}
            />
          </div>
        </div>
      </div>
    </section>
  );
} 