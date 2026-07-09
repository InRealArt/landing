'use client'

import { useTranslation } from '@/hooks/useTranslation';

export default function Advantages() {
  const { t } = useTranslation();

  const advantagesItems = [
    {
      title: t('leasing.advantages.items.0.title'),
      description: t('leasing.advantages.items.0.description')
    },
    {
      title: t('leasing.advantages.items.1.title'),
      description: t('leasing.advantages.items.1.description')
    },
    {
      title: t('leasing.advantages.items.2.title'),
      description: t('leasing.advantages.items.2.description')
    }
  ];

  return (
    <section className="py-32 px-10 border-y border-[var(--border-light)] bg-[var(--canvas-bg)]">
      <div className="max-w-screen-2xl mx-auto">
        <div data-anim="adv-title" className="border-b border-[var(--border-light)] pb-12 mb-16">
          <span className="section-number">Avantages</span>
          <h2 className="text-5xl md:text-7xl serif italic leading-tight">
            <span className="text-[var(--gold-accent)]">{t('leasing.advantages.title')}</span>
          </h2>
          <p className="text-sm text-[var(--gray-text)] leading-loose mt-6 max-w-lg uppercase tracking-[0.2em]">
            {t('leasing.advantages.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {advantagesItems.map((item, index) => (
            <div
              key={index}
              data-anim="adv-card"
              className="border-t border-[var(--border-light)] pt-10 bg-[var(--soft-gray)] border border-[var(--border-light)] p-10 flex flex-col"
            >
              <span className="serif text-3xl italic text-[var(--gold-accent)] block mb-6">
                0{index + 1}.
              </span>
              <h3 className="serif italic text-2xl mb-4">
                {item.title}
              </h3>
              <p className="text-sm text-[var(--gray-text)] leading-loose">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 