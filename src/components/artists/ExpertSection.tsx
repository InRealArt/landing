'use client'

import Button from "@/components/common/Button";
import { ArrowRight } from "lucide-react";
import { useTranslation } from '@/hooks/useTranslation';

export default function ExpertSection() {
  const { t } = useTranslation();

  return (
    <section className="flex flex-col md:flex-row justify-between gap-10 md:gap-20 items-center mt-32">
      <div className="flex-1">
        <h2 className="text-5xl md:text-7xl serif italic leading-tight mb-3">
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