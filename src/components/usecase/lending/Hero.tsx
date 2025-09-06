'use client'

import OptimizedBackgroundImage from '@/components/common/OptimizedBackgroundImage';
import Button from "@/components/common/Button";
import { useLanguageStore } from '@/store/languageStore';
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const { t } = useLanguageStore();

  return (
    <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
      
      <div className="absolute inset-0">
        <div className="w-full h-full [&_img]:!object-top [&_img]:scale-110">
          <OptimizedBackgroundImage
            src="/images/usecase/usecase_lending.webp"
            alt={t('lending.hero.title')}
            width={1920}
            height={1080}
            className="w-full h-full"
            overlay={false}
          />
        </div>
      </div>
      
      {/* Dégradé du bas vers le background RGB(19, 19, 19) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[rgb(19,19,19)] via-[rgb(19,19,19,0.8)] to-transparent z-10" />

      {/* Content Overlay */}
      <div className="container mx-auto px-4 relative z-20 pt-headerSize pb-20 h-full flex items-center justify-center">
        {/* Left Column - Title and Button */}
        <div className="flex flex-col">
                      <h1 className="text-4xl md:text-5xl bricolage-grotesque font-medium mb-6 text-textColor">
            {t('lending.hero.title')}
          </h1>
                      <p className="text-lg text-textColor/90 mb-8">
            {t('lending.hero.description')}
          </p>
          <div className="mt-auto">
            <Button
              text={t('lending.hero.button')}
              additionalClassName="bg-purpleColor"
              icon={<ArrowRight />}
              link="/contact"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 