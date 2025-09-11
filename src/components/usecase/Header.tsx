'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage'
import TranslatedText from '@/components/common/TranslatedText'
import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";
import { useLanguageStore } from '@/store/languageStore';

export default function Header() {
  const { t } = useLanguageStore();

  const caseStudies = [
    {
      title: t('usecase.items.leasing.title'),
      link: "/usecase/leasing",
      description: t('usecase.items.leasing.description')
    },
    {
      title: t('usecase.items.companies.title'),
      link: "/usecase/companies",
      description: t('usecase.items.companies.description')
    },
    {
      title: t('usecase.items.fractionate.title'),
      link: "/usecase/fractionate",
      description: t('usecase.items.fractionate.description')
    },
    {
      title: t('usecase.items.lending.title'),
      link: "/usecase/lending",
      description: t('usecase.items.lending.description')
    }
  ];

  return (
    <section className="relative w-full py-20 pt-headerSize overflow-hidden">
      <div className="absolute inset-0">
        <div className="w-full h-full [&_img]:!object-bottom">
          <OptimizedBackgroundImage
            src="/images/usecase/hero_usecase.webp"
            alt={t('usecase.intro.title')}
            width={1920}
            height={1080}
            className="w-full h-full"
            overlay={false}
          />
        </div>
      </div>
      
      {/* Dégradé du bas vers le background RGB(19, 19, 19) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(19,19,19)] via-[rgb(19,19,19,0.8)] to-transparent z-10" />

      {/* Contenu du header */}
      <div className="relative z-20 max-w-90 xl:max-w-screen-xl m-auto">
        <div className="text-center mb-16">
          <TranslatedText
            translationKey="usecase.intro.title"
            as="h1"
            className="text-4xl md:text-6xl bricolage-grotesque font-medium mb-4 text-white"
            allowHtml={true}
          />
          <TranslatedText
            translationKey="usecase.intro.subtitle"
            as="p"
            className="text-lg md:text-xl text-white/90"
            allowHtml={true}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {caseStudies.map((caseStudy, index) => (
            <div key={index} className="bg-cardBackground rounded-lg p-8 border border-white/20 flex flex-col justify-between">
              <TranslatedText
                content={caseStudy.title}
                as="h3"
                className="text-xl bricolage-grotesque font-medium mb-6"
                allowHtml={true}
              />
              <TranslatedText
                content={caseStudy.description}
                as="p"
                className="text-sm text-grayText mb-6 bricolage-grotesque"
                allowHtml={true}
              />
              <Button 
                text={t('buttons.readMore')} 
                additionalClassName="bg-purpleColor w-full justify-center mt-auto" 
                icon={<ArrowRight />} 
                link={caseStudy.link}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 