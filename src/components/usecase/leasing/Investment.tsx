'use client'

import OptimizedImage from "@/components/common/OptimizedImage";
import { useTranslation } from '@/hooks/useTranslation';

export default function Investment() {
  const { t } = useTranslation();

  return (
    <section className="py-32 px-10 bg-[var(--canvas-bg)]">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          {/* Image */}
          <div data-anim="inv-image" className="border border-[var(--border-light)] aspect-square overflow-hidden">
            <OptimizedImage
              src="/images/usecase/leasing/leasing-image-investment.avif"
              alt={t('leasing.investment.title')}
              width={600}
              height={600}
              className="w-full h-full [&_img]:w-full [&_img]:h-full [&_img]:object-cover"
              priority
            />
          </div>

          {/* Text */}
          <div data-anim="inv-text">
            <span className="section-number">Investissement</span>
            <h2 className="text-5xl md:text-7xl serif italic leading-tight mb-8">
              {t('leasing.investment.title')}
            </h2>
            <p className="text-sm leading-loose text-[var(--gray-text)] mb-10">
              {t('leasing.investment.description')}
            </p>
            <ul className="divide-y divide-[var(--border-light)]">
              <li className="flex items-start gap-6 py-5">
                <span className="serif italic text-xl text-[var(--gold-accent)] shrink-0 mt-0.5">—</span>
                <span className="text-sm leading-loose text-[var(--gray-text)]">{t('leasing.investment.bullets.0')}</span>
              </li>
              <li className="flex items-start gap-6 py-5">
                <span className="serif italic text-xl text-[var(--gold-accent)] shrink-0 mt-0.5">—</span>
                <span className="text-sm leading-loose text-[var(--gray-text)]">{t('leasing.investment.bullets.1')}</span>
              </li>
              <li className="flex items-start gap-6 py-5">
                <span className="serif italic text-xl text-[var(--gold-accent)] shrink-0 mt-0.5">—</span>
                <span className="text-sm leading-loose text-[var(--gray-text)]">{t('leasing.investment.bullets.2')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
} 