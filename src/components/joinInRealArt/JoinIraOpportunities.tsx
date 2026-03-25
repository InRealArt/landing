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
  darkBackground?: boolean;
}

export default function JoinIraOpportunities({
  titleKey,
  buttonTextKey,
  opportunities,
  buttonUrl,
  darkBackground = false
}: JoinIraOpportunitiesProps) {
  const { t } = useLanguageStore();

  if (darkBackground) {
    return (
      <section className="w-full bg-black text-white py-24 lg:py-32">
        <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
            <h2 className="text-5xl md:text-7xl serif italic leading-tight text-white mb-6 lg:mb-0 lg:max-w-2xl">
              {t(titleKey)}
            </h2>
            {/* <Button
              text={t(buttonTextKey)}
              additionalClassName="bg-gold-accent w-fit border-0"
              icon={<ArrowRight />}
              link={buttonUrl}
              target={buttonUrl?.startsWith('#') ? '_self' : '_blank'}
            /> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0 items-start">
            {opportunities.map((opportunity) => (
              <div key={opportunity.key} className="border-b border-white/10 py-10 transition-all duration-500 hover:pl-4" style={{ borderBottomColor: 'inherit' }} onMouseEnter={e => (e.currentTarget.style.borderBottomColor = '#b89c72')} onMouseLeave={e => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.1)')}>
                <TranslatedText
                  translationKey={opportunity.titleKey}
                  as="h3"
                  className="text-2xl lg:text-3xl serif italic text-gold-accent mb-4"
                  allowHtml={true}
                />
                <TranslatedText
                  translationKey={opportunity.descriptionKey}
                  as="p"
                  className="text-sm text-white/60 font-light leading-relaxed"
                  allowHtml={true}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-90 xl:max-w-screen-xl m-auto mt-36 mb-20">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
        <h2 className="text-5xl md:text-7xl serif italic leading-tight text-textColor mb-6 lg:mb-0 lg:max-w-2xl">
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
        {opportunities.map((opportunity) => (
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