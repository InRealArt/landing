'use client'

import Image from 'next/image'
import BG from "../../../public/images/usecase/hero_usecase.webp";
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
      {/* Image de fond */}
      <div className="absolute inset-0">
        <Image
          src={BG}
          alt={t('usecase.intro.title')}
          fill
          className="object-cover object-bottom"
          priority
          quality={90}
        />
        
        {/* Dégradé du bas vers le background RGB(19, 19, 19) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(19,19,19)] via-[rgb(19,19,19,0.8)] to-transparent" />
      </div>

      {/* Contenu du header */}
      <div className="relative z-10 max-w-90 xl:max-w-screen-xl m-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl bricolage-grotesque font-medium mb-4 text-white">
            {t('usecase.intro.title')}
          </h1>
          <p className="text-lg md:text-xl inter text-white/90">
            {t('usecase.intro.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {caseStudies.map((caseStudy, index) => (
            <div key={index} className="bg-cardBackground rounded-lg p-8 border border-white/20 flex flex-col justify-between">
              <h3 className="text-xl bricolage-grotesque font-medium mb-6">{caseStudy.title}</h3>
              <p className="text-sm text-gray-300 mb-6 bricolage-grotesque">{caseStudy.description}</p>
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