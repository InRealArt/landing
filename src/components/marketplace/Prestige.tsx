'use client'

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";
import prestigeImage from "../../../public/images/prestige.png";
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
            text={t('buttons.viewFAQ')}
            additionalClassName="bg-purpleColor"
            icon={<ArrowRight />}
            link='/faq'
          />
        </div>
        <div className="w-full md:w-1/2">
          <div className="rounded-3xl">
            <Image
              src={prestigeImage}
              alt="Art de Prestige"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 