'use client'

import BG from "../../../public/images/intro-background.png";
import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";
import { useLanguageStore } from '@/store/languageStore';

export default function Header() {
  const { t } = useLanguageStore();

  const caseStudies = [
    {
      title: t('usecase.items.fractionate.title'),
      link: "/usecase/fractionate",
      description: t('usecase.items.fractionate.description')
    },
    {
      title: t('usecase.items.companies.title'),
      link: "/usecase/companies",
      description: t('usecase.items.companies.description')
    },
    {
      title: t('usecase.items.leasing.title'),
      link: "/usecase/leasing",
      description: t('usecase.items.leasing.description')
    },
    {
      title: t('usecase.items.lending.title'),
      link: "/usecase/lending",
      description: t('usecase.items.lending.description')
    }
  ];

  return (
    <section className="bg-cover bg-no-repeat bg-bottom py-20 w-full pt-headerSize" style={{ backgroundImage: `url('${BG.src}')`}}>
      <div className="max-w-90 xl:max-w-screen-xl m-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl bricolage-grotesque font-medium mb-4">
            {t('usecase.intro.title')}
          </h1>
          <p className="text-lg md:text-xl inter text-gray-300">
            {t('usecase.intro.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {caseStudies.map((caseStudy, index) => (
            <div key={index} className="bg-cardBackground rounded-lg p-8 border border-white/20">
              <h3 className="text-xl bricolage-grotesque font-medium mb-6">{caseStudy.title}</h3>
              <p className="text-sm text-gray-300 mb-6 bricolage-grotesque">{caseStudy.description}</p>
              <Button 
                text={t('buttons.readMore')} 
                additionalClassName="bg-purpleColor w-full justify-center" 
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