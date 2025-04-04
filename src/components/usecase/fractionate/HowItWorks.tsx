'use client'

import StepsSwiper from '@/components/common/StepsSwiper';
import { useLanguageStore } from '@/store/languageStore';

export default function HowItWorks() {
  const { t } = useLanguageStore();

  const steps = [
    {
      number: t('fractionate.howItWorks.steps.selection.number'),
      title: t('fractionate.howItWorks.steps.selection.title'),
      description: t('fractionate.howItWorks.steps.selection.description')
    },
    {
      number: t('fractionate.howItWorks.steps.verification.number'),
      title: t('fractionate.howItWorks.steps.verification.title'),
      description: t('fractionate.howItWorks.steps.verification.description')
    },
    {
      number: t('fractionate.howItWorks.steps.tokenization.number'),
      title: t('fractionate.howItWorks.steps.tokenization.title'),
      description: t('fractionate.howItWorks.steps.tokenization.description')
    }
  ];

  return (
    <StepsSwiper 
      title={t('fractionate.howItWorks.title')} 
      steps={steps} 
    />
  );
} 