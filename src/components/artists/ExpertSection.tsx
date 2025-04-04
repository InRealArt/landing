'use client'

import Button from "@/components/common/Button";
import { ArrowRight } from "lucide-react";
import { useLanguageStore } from '@/store/languageStore';

export default function ExpertSection() {
  const { t } = useLanguageStore();

  return (
    <section className="flex flex-col md:flex-row justify-between gap-10 md:gap-20 items-center mt-32">
      <div className="flex-1">
        <h2 className="bricolage-grotesque text-3xl md:text-6xl mb-3">
          {t('artistPage.expert')}
        </h2>
        <p className="bricolage-grotesque text-base">
          {t('artistPage.expertDescription')}
        </p>
      </div>
      <div className="flex-1">
        <p className="bricolage-grotesque text-base mb-5">
          {t('artistPage.expertDescription2')}
        </p>
        <Button 
          text={t('artistPage.seeMarketplace')} 
          additionalClassName="bg-purpleColor" 
          icon={<ArrowRight />}
          link="/marketplace" 
        />
      </div>
    </section>
  );
} 