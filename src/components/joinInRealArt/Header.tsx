'use client'

import BG from "../../../public/images/intro-background.png";
import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";
import { useLanguageStore } from '@/store/languageStore';

export default function Header() {
  const { t } = useLanguageStore();

  const selectPersonType = [
    {
      title: t('joinInRealArt.header.artists.title'),
      link: "/joinInRealArt/artists",
      description: t('joinInRealArt.header.artists.description')
    },
    {
      title: t('joinInRealArt.header.galleries.title'),
      link: "/joinInRealArt/galleries",
      description: t('joinInRealArt.header.galleries.description')
    }
  ];

  return (
    <section className="bg-cover bg-no-repeat bg-bottom py-20 w-full pt-headerSize" style={{ backgroundImage: `url('${BG.src}')`}}>
      <div className="max-w-90 xl:max-w-screen-xl m-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl bricolage-grotesque font-medium mb-4">
            {t('joinInRealArt.header.title')}
          </h1>
          <p className="text-lg md:text-xl inter text-gray-300">
            {t('joinInRealArt.header.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {selectPersonType.map((personType, index) => (
            <div key={index} className="bg-cardBackground rounded-lg p-8 border border-white/20 flex flex-col justify-between">
              <h3 className="text-xl bricolage-grotesque font-medium mb-6">{personType.title}</h3>
              <p className="text-sm text-gray-300 mb-6 bricolage-grotesque">{personType.description}</p>
              <Button 
                text={t('buttons.readMore')} 
                additionalClassName="bg-purpleColor w-full justify-center mt-auto" 
                icon={<ArrowRight />} 
                link={personType.link}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 