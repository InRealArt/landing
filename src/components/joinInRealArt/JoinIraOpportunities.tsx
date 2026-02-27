'use client'

import { useLanguageStore } from '@/store/languageStore';
import { ArrowRight } from 'lucide-react';
import Button from "@/components/common/Button";
import TranslatedText from "@/components/common/TranslatedText";

interface OpportunityItem {
  key: string;
  titleKey: string;
  descriptionKey: string;
}

interface JoinIraOpportunitiesProps {
  titleKey: string;
  buttonTextKey: string;
  opportunities: OpportunityItem[];
  buttonUrl?: string;
}

export default function JoinIraOpportunities({ 
  titleKey, 
  buttonTextKey, 
  opportunities, 
  buttonUrl 
}: JoinIraOpportunitiesProps) {
  const { t } = useLanguageStore();


  return (
    <section className="w-full max-w-90 xl:max-w-screen-xl m-auto mt-36 mb-20">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
        <h2 className="text-4xl md:text-5xl lg:text-6xl bricolage-grotesque font-medium text-textColor mb-6 lg:mb-0 lg:max-w-2xl">
          {t(titleKey)}
        </h2>
        <Button 
          text={t(buttonTextKey)} 
          additionalClassName="bg-purpleColor w-fit" 
          icon={<ArrowRight />} 
          link={buttonUrl}
          target={buttonUrl?.startsWith('#') ? '_self' : '_blank'}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {opportunities.map((opportunity, index) => (
          <div key={opportunity.key} className="p-6 lg:p-8 border border-white rounded-xl bg-cardBackground h-full">
            <TranslatedText
              translationKey={opportunity.titleKey}
              as="h3"
              className="text-xl lg:text-2xl bricolage-grotesque font-semibold text-textColor mb-4"
              allowHtml={true}
            />
            <TranslatedText
              translationKey={opportunity.descriptionKey}
              as="p"
              className="text-grayText text-sm lg:text-base leading-relaxed"
              allowHtml={true}
            />
          </div>
        ))}
      </div>
    </section>
  );
} 