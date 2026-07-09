'use client'

import { useTranslation } from '@/hooks/useTranslation';

export default function Benefits() {
  const { t } = useTranslation();

  const benefitsItems = [
    {
      id: t('leasing.benefits.items.0.id'),
      title: t('leasing.benefits.items.0.title'),
      description: t('leasing.benefits.items.0.description')
    },
    {
      id: t('leasing.benefits.items.1.id'),
      title: t('leasing.benefits.items.1.title'),
      description: t('leasing.benefits.items.1.description')
    },
    {
      id: t('leasing.benefits.items.2.id'),
      title: t('leasing.benefits.items.2.title'),
      description: t('leasing.benefits.items.2.description')
    }
  ];

  return (
    <section className="py-32 px-10 bg-[var(--soft-gray)]">
      <div className="max-w-screen-2xl mx-auto">
        <div data-anim="ben-title" className="border-b border-[var(--border-light)] pb-12 mb-16">
          <span className="section-number">Bénéfices</span>
          <h2 className="text-5xl md:text-7xl serif italic leading-tight">
            {t('leasing.benefits.title')}
          </h2>
        </div>

        <div className="divide-y divide-[var(--border-light)]">
          {benefitsItems.map((item) => (
            <div
              key={item.id}
              data-anim="ben-item"
              className="flex flex-col md:flex-row gap-8 md:gap-16 items-start pt-12 pb-12"
            >
              <div className="serif text-6xl italic text-[var(--gold-accent)] min-w-[80px]">
                {item.id}
              </div>
              <div className="flex-1">
                <h3 className="serif italic text-2xl md:text-3xl mb-4">
                  {item.title}
                </h3>
                <p className="text-sm leading-loose text-[var(--gray-text)]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 