'use client'

import { useLanguageStore } from '@/store/languageStore';
import { ArrowUp } from 'lucide-react';
import Button from '@/components/common/Button';

interface BenefitCardProps {
  title: string;
  description: string;
  index: number;
}

function BenefitCard({ title, description, index }: BenefitCardProps) {
  const { t } = useLanguageStore();
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className="bg-cardBackground rounded-xl p-6 border border-white-600 flex flex-col h-full">
      <h3 className="unbounded text-xl font-medium mb-3">{title}</h3>
      <p className="text-gray-300 text-sm mb-6 flex-grow bricolage-grotesque">{description}</p>
      <Button 
        text={t('presale.token.acquireTokens')}
        action={scrollToTop}
        additionalClassName="bg-purpleColor justify-between"
        icon={<ArrowUp/>}
      />
    </div>
  );
}

export default function TokenWhyChoose() {
  const { t } = useLanguageStore();
  
  const benefits = [
    {
      title: t('presale.token.whyChoose.benefits.hardDrawn.title'),
      description: t('presale.token.whyChoose.benefits.hardDrawn.description')
    },
    {
      title: t('presale.token.whyChoose.benefits.exceptional.title'),
      description: t('presale.token.whyChoose.benefits.exceptional.description')
    },
    {
      title: t('presale.token.whyChoose.benefits.donations.title'),
      description: t('presale.token.whyChoose.benefits.donations.description')
    },
    {
      title: t('presale.token.whyChoose.benefits.royalties.title'),
      description: t('presale.token.whyChoose.benefits.royalties.description')
    }
  ];

  return (
    <section className="py-20 container mx-auto px-4">
      <h2 className="text-4xl md:text-5xl font-bold mb-12 bricolage-grotesque">
        {t('presale.token.whyChoose.title')}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((benefit, index) => (
          <BenefitCard 
            key={index}
            title={benefit.title} 
            description={benefit.description}
            index={index}
          />
        ))}
      </div>
    </section>
  );
} 