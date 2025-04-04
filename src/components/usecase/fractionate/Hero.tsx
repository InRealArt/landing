'use client'

import Image from "next/image";
import Button from "@/components/common/Button";
import { useLanguageStore } from '@/store/languageStore';
import { ArrowRight } from "lucide-react";
import marketplaceImage from "../../../../public/images/marketplace.png";

export default function Hero() {
  const { t } = useLanguageStore();

  return (
    <section className="relative bg-cover m-auto bg-no-repeat bg-bottom min-h-screen w-full flex items-center justify-center" style={{ backgroundImage: `url('${marketplaceImage.src}')` }}>      
      {/* Content Overlay */}
      <div className="container mx-auto px-4 relative z-10 pt-headerSize pb-20">
        {/* Left Column - Title and Button */}
        <div className="flex flex-col">
          <h1 className="text-4xl md:text-5xl bricolage-grotesque font-medium mb-6">
            {t('fractionate.hero.title')}
          </h1>
          <p className="text-lg text-gray-300 mb-8">
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