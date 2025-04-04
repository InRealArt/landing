'use client'

import { useLanguageStore } from '@/store/languageStore';

export default function Advantages() {
  const { t } = useLanguageStore();

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
    <section className="py-16 ">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-5xl bricolage-grotesque font-medium mb-4">
          {t('leasing.advantages.title')}
        </h2>
        <p className="text-sm inter mb-8 max-w-lg">
          {t('leasing.advantages.subtitle')}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantagesItems.map((item, index) => (
            <div
              key={index}
              className="p-6 rounded-lg bg-[#1D1C1C]"
            >
              <h3 className="text-xl bricolage-grotesque font-medium mb-3">
                {item.title}
              </h3>
              <p className="text-sm inter text-gray-300">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 