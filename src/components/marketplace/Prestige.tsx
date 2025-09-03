'use client'

import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";
import OptimizedImage from "@/components/common/OptimizedImage";
import prestigeImage from "../../../public/images/marketplace/marketplace_prestige.webp";
import { useLanguageStore } from '@/store/languageStore';

export default function Prestige() {
  const { t } = useLanguageStore();

  return (
    <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-20">
      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="w-full md:w-1/2">
          <h3 className="text-lg md:text-xl bricolage-grotesque mb-2">{t('marketplace.prestige.subtitle')}</h3>
          <h2 className="text-3xl md:text-5xl bricolage-grotesque font-medium mb-6">
            {t('marketplace.prestige.title')}
          </h2>
          <p className="inter text-sm md:text-base mb-8 text-gray-300 max-w-xl">
            {t('marketplace.prestige.description')}
          </p>
          <Button
            text={t('buttons.presale')}
            additionalClassName="bg-purpleColor"
            icon={<ArrowRight />}
            link='/presale'
          />
        </div>
        <div className="w-full md:w-1/2">
          <OptimizedImage
            src={prestigeImage.src}
            alt="Art de Prestige - Collection d'œuvres d'art de luxe"
            width={450}
            height={300}
            className="w-full h-auto object-cover rounded-lg"
            priority={true}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
} 