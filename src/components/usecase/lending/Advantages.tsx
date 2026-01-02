'use client'

import Button from '@/components/common/Button';
import { useLanguageStore } from '@/store/languageStore';
import { ArrowRight } from 'lucide-react';
import OptimizedImage from '@/components/common/OptimizedImage';

export default function Advantages() {
  const { t } = useLanguageStore();

  return (
    <section className="py-20">

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl bricolage-grotesque font-medium mb-6">
              {t('lending.advantages.title')}
            </h2>
            <p className="text-grayText mb-6">
              {t('lending.advantages.description')}
            </p>
            <Button 
              text={t('lending.advantages.button')} 
              additionalClassName="bg-purpleColor" 
              icon={<ArrowRight />} 
              link="/contact" 
            />
          </div>

          <div className="w-full md:w-1/2">
              <OptimizedImage 
                src="/images/usecase/lending/pigcoin.webp" 
                alt="Solutions sur mesures" 
                className="w-full [&_img]:w-full [&_img]:h-auto [&_img]:object-contain"
                width={665}
                height={665}
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 665px"
                quality={75}
              />
          </div>
        </div>
      </div>
    </section >
  );
} 