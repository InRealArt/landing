'use client'

import Image from "next/image";
import Button from "@/components/common/Button";
import marketplaceImage from "../../../../public/images/marketplace.png";
import { useLanguageStore } from '@/store/languageStore';

export default function Hero() {
  const { t } = useLanguageStore();

  return (
    <section className="relative bg-cover m-auto bg-no-repeat bg-bottom min-h-screen w-full flex items-center justify-center" style={{ backgroundImage: ` url('${marketplaceImage.src}')` }}>      
      {/* Content Overlay */}
      <div className="container mx-auto px-4 relative z-10 pt-headerSize pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Title and Button */}
          <div className="flex flex-col">
            <h1 className="text-4xl md:text-5xl bricolage-grotesque font-medium mb-6" dangerouslySetInnerHTML={{ __html: t('leasing.hero.title') }} />
            <div className="mt-auto">
              <Button 
                text={t('leasing.hero.button')}
                additionalClassName="bg-purpleColor"
                link="/simulateur"
              />
            </div>
          </div>
          
          {/* Right Column - Text */}
          <div className="text-lg inter text-gray-200">
            <p className="mb-4">
              {t('leasing.hero.description.p1')}
            </p>
            <p className="mb-4">
              {t('leasing.hero.description.p2')}
            </p>
            <p>
              {t('leasing.hero.description.p3')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 