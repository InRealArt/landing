'use client'

import Image from "next/image";
import Button from "@/components/common/Button";
import { useLanguageStore } from '@/store/languageStore';
import { ArrowRight } from "lucide-react";
import marketplaceImage from "../../../../public/images/usecase/usecase_fractionate.webp";

export default function Hero() {
  const { t } = useLanguageStore();

  return (
    <section className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
      {/* Image de fond */}
      <div className="absolute inset-0">
        <Image
          src={marketplaceImage}
          alt={t('fractionate.hero.title')}
          fill
          className="object-cover object-center scale-110"
          priority
          quality={90}
        />
        
        {/* Dégradé du bas vers le background RGB(19, 19, 19) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(19,19,19)] via-[rgb(19,19,19,0.8)] to-transparent" />
      </div>
      
      {/* Content Overlay */}
      <div className="container mx-auto px-4 relative z-10 pt-headerSize pb-20 h-full flex items-center justify-center">
        {/* Left Column - Title and Button */}
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-5xl bricolage-grotesque font-medium mb-6 text-white">
            {t('fractionate.hero.title')}
          </h1>
          <p className="text-lg text-white/90 mb-8">
            {t('fractionate.hero.description')}
          </p>
          <div className="mt-auto">
            <Button
              text={t('fractionate.hero.button')}
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