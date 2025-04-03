'use client'

import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";
import { useLanguageStore } from '@/store/languageStore';

export default function CaseStudies() {
  const { t } = useLanguageStore();
  
  const caseStudies = [
    {
      title: "Fractionnement des œuvres d'art",
      link: "/usecase/fractionnement"
    },
    {
      title: "Une marketplace Exclusive",
      link: "/usecase/marketplace"
    },
    {
      title: "Fractionnement des œuvres d'art",
      link: "/usecase/fractionnement-2"
    },
    {
      title: "Une marketplace Exclusive",
      link: "/usecase/marketplace-2"
    }
  ];

  return (
    <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {caseStudies.map((caseStudy, index) => (
          <div key={index} className="bg-cardBackground rounded-lg p-8 border border-white/20">
            <h3 className="text-xl bricolage-grotesque font-medium mb-6">{caseStudy.title}</h3>
            <Button 
              text={t('buttons.readMore')}
              additionalClassName="bg-purpleColor w-full justify-center" 
              icon={<ArrowRight />} 
              link={caseStudy.link}
            />
          </div>
        ))}
      </div>
    </section>
  );
} 