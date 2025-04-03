'use client'

import { useLanguageStore } from '@/store/languageStore';

export default function Benefits() {
  const { t } = useLanguageStore();

  const benefits = [
    {
      title: t('marketplace.benefits.items.authenticity.title'),
      description: t('marketplace.benefits.items.authenticity.description')
    },
    {
      title: t('marketplace.benefits.items.exclusivity.title'),
      description: t('marketplace.benefits.items.exclusivity.description')
    },
    {
      title: t('marketplace.benefits.items.resale.title'),
      description: t('marketplace.benefits.items.resale.description')
    },
    {
      title: t('marketplace.benefits.items.copyright.title'),
      description: t('marketplace.benefits.items.copyright.description')
    }
  ];

  return (
    <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-20">
      <h2 className="text-2xl md:text-4xl bricolage-grotesque font-medium mb-10">{t('marketplace.benefits.title')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((benefit, index) => (
          <div key={index} className="bg-cardBackground rounded-lg p-8 border border-white/20">
            <h3 className="text-xl bricolage-grotesque font-medium mb-2">{benefit.title}</h3>
            <p className="text-sm inter">{benefit.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
} 