'use client'

import { useTranslation } from '@/hooks/useTranslation';

export default function Benefits() {
  const { t } = useTranslation();

  const benefits = [
    {
      title: t('fractionate.benefits.items.accessibility.title'),
      description: t('fractionate.benefits.items.accessibility.description')
    },
    {
      title: t('fractionate.benefits.items.diversification.title'),
      description: t('fractionate.benefits.items.diversification.description')
    },
    {
      title: t('fractionate.benefits.items.liquidity.title'),
      description: t('fractionate.benefits.items.liquidity.description')
    },
    {
      title: t('fractionate.benefits.items.transparency.title'),
      description: t('fractionate.benefits.items.transparency.description')
    }
  ];

  return (
    <section className="py-32 px-10 bg-[var(--soft-gray)] border-y border-[var(--border-light)]">
      <div className="max-w-screen-2xl mx-auto">
        <div data-anim="fract-ben-title" className="border-b border-[var(--border-light)] pb-12 mb-16">
          <span className="section-number">Bénéfices</span>
          <h2 className="text-5xl md:text-7xl serif italic leading-tight text-[var(--gold-accent)]">
            {t('fractionate.benefits.title')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[var(--border-light)]">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              data-anim="fract-ben-card"
              className="bg-[var(--canvas-bg)] p-10 flex flex-col"
            >
              <span className="serif text-3xl italic text-[var(--gold-accent)] block mb-6">0{index + 1}.</span>
              <h3 className="serif italic text-2xl mb-4">{benefit.title}</h3>
              <p className="text-sm text-[var(--gray-text)] leading-loose">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 