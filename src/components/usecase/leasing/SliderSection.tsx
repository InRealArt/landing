'use client'

import { useLanguageStore } from '@/store/languageStore';
import StepsSwiper from '@/components/common/StepsSwiper';

export default function SliderSection() {
  const { t } = useLanguageStore();

  const steps = [
    {
      number: t('leasing.slider.items.0.id'),
      title: t('leasing.slider.items.0.title'),
      description: t('leasing.slider.items.0.description')
    },
    {
      number: t('leasing.slider.items.1.id'),
      title: t('leasing.slider.items.1.title'),
      description: t('leasing.slider.items.1.description')
    },
    {
      number: t('leasing.slider.items.2.id'),
      title: t('leasing.slider.items.2.title'),
      description: t('leasing.slider.items.2.description')
    }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <p className="text-sm inter text-gray-300 mb-10 max-w-3xl">
          {t('leasing.slider.subtitle')}
        </p>
        
        <StepsSwiper 
          title={t('leasing.slider.title')}
          steps={steps}
        />
      </div>
    </section>
  );
} 