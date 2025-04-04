'use client'

import StepsSwiper from '@/components/common/StepsSwiper';
import { useLanguageStore } from '@/store/languageStore';

export default function HowItWorks() {
  const { t } = useLanguageStore();

  const steps = [
    {
      number: t('marketplace.howItWorks.steps.selection.number'),
      title: t('marketplace.howItWorks.steps.selection.title'),
      description: t('marketplace.howItWorks.steps.selection.description')
    },
    {
      number: t('marketplace.howItWorks.steps.verification.number'),
      title: t('marketplace.howItWorks.steps.verification.title'),
      description: t('marketplace.howItWorks.steps.verification.description')
    },
    {
      number: t('marketplace.howItWorks.steps.tokenization.number'),
      title: t('marketplace.howItWorks.steps.tokenization.title'),
      description: t('marketplace.howItWorks.steps.tokenization.description')
    }
  ];

  return (
    <StepsSwiper 
      title={t('marketplace.howItWorks.title')} 
      steps={steps} 
    />
  );
} 