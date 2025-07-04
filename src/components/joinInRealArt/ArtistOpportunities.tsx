'use client'

import { useLanguageStore } from '@/store/languageStore';
import { ArrowRight } from 'lucide-react';
import Button from "@/components/common/Button";

export default function ArtistOpportunities() {
  const { t } = useLanguageStore();

  const urlForm = 'https://docs.google.com/forms/d/1RxKNtLG2XZ7BB2CpzGI4yJZCjSJ3cSXwOHQKgwVC4gA/viewform?edit_requested=true#responses'

  const opportunities = [
    {
      key: 'support',
      title: t('joinInRealArt.artists.opportunities.support.title'),
      description: t('joinInRealArt.artists.opportunities.support.description')
    },
    {
      key: 'technology',
      title: t('joinInRealArt.artists.opportunities.technology.title'),
      description: t('joinInRealArt.artists.opportunities.technology.description')
    },
    {
      key: 'rights',
      title: t('joinInRealArt.artists.opportunities.rights.title'),
      description: t('joinInRealArt.artists.opportunities.rights.description')
    }
  ];

  return (
    <section className="w-full max-w-90 xl:max-w-screen-xl m-auto mt-36 mb-20">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl bricolage-grotesque font-medium text-white mb-6 lg:mb-0 lg:max-w-2xl">
          {t('joinInRealArt.artists.opportunities.title')}
        </h1>
        <Button 
          text={t('joinInRealArt.artists.opportunities.button')} 
          additionalClassName="bg-purpleColor w-fit" 
          icon={<ArrowRight />} 
          link={urlForm}
          target="_blank"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {opportunities.map((opportunity, index) => (
          <div key={opportunity.key} className={`p-6 lg:p-8 border border-white rounded-xl bg-cardBackground ${index === 0 ? 'min-h-[350px] lg:min-h-[380px]' : 'h-[280px] lg:h-[300px]'}`}>
            <h3 className="text-xl lg:text-2xl bricolage-grotesque font-semibold text-white mb-4">
              {opportunity.title}
            </h3>
            <p className="text-gray-300 text-sm lg:text-base leading-relaxed">
              {opportunity.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
} 