'use client'

import { useTranslation } from '@/hooks/useTranslation';
import OptimizedImage from '@/components/common/OptimizedImage';
import Button from '@/components/common/Button';
import { ArrowRight } from 'lucide-react';

export default function Solutions() {
  const { t } = useTranslation();

  return (
    <section className="py-32 px-10 bg-[var(--soft-gray)] border-b border-[var(--border-light)]">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div data-anim="lending-sol-img" className="border border-[var(--border-light)] overflow-hidden">
            <OptimizedImage
              src="/images/usecase/lending/leloluce.avif"
              alt="Solutions sur mesures"
              className="w-full [&_img]:w-full [&_img]:h-auto [&_img]:object-cover"
              width={500}
              height={350}
              priority={true}
            />
          </div>
          <div data-anim="lending-sol-text">
            <span className="section-number">Solutions</span>
            <h2 className="text-5xl md:text-7xl serif italic leading-tight mb-8">
              {t('lending.solutions.title')}
            </h2>
            <p className="text-[12px] text-[var(--gray-text)] leading-loose mb-10">
              {t('lending.solutions.description')}
            </p>
            <Button
              text={t('lending.solutions.button')}
              additionalClassName="bg-purpleColor"
              icon={<ArrowRight size={12} />}
              link="/contact"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 