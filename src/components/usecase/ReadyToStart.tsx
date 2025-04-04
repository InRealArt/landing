'use client'

import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";
import { useLanguageStore } from '@/store/languageStore';

interface Gallery {
  title: string;
  description: string;
  link: string;
}

export default function ReadyToStart() {
  const { t } = useLanguageStore();

  const galleries: Gallery[] = [
    {
      title: t('usecase.items.gallery.title'),
      description: t('usecase.items.gallery.description'),
      link: "/usecase/fractionate"
    },
    {
      title: t('usecase.items.gallery.title'),
      description: t('usecase.items.gallery.description'),
      link: "/usecase/companies"
    },
    {
      title: t('usecase.items.gallery.title'),
      description: t('usecase.items.gallery.description'),
      link: "/usecase/leasing"
    }
  ];

  return (
    <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-32 mb-20">
      <h2 className="text-3xl md:text-5xl bricolage-grotesque font-medium mb-4">
        {t('usecase.items.gallery.title')}
      </h2>
      <p className="text-base md:text-lg inter text-gray-300 mb-10">
        {t('usecase.items.gallery.description')}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {galleries.map((gallery, index) => (
          <div key={index} className="bg-cardBackground rounded-lg p-8 border border-white/20">
            <h3 className="text-xl bricolage-grotesque font-medium mb-4">{gallery.title}</h3>
            <p className="text-sm inter mb-6">{gallery.description}</p>
            <Button 
              text={t('buttons.readMore')} 
              additionalClassName="bg-purpleColor w-full justify-center" 
              icon={<ArrowRight />} 
              link={gallery.link}
            />
          </div>
        ))}
      </div>
    </section>
  );
} 