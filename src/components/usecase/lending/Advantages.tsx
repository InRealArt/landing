'use client'

import Button from '@/components/common/Button';
import { useLanguageStore } from '@/store/languageStore';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

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
            <p className="text-gray-300 mb-6">
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
              <Image 
                src="/images/lending-small.png" 
                alt="Solutions sur mesures" 
                className="object-contain"
                width={500}
                height={260}
              />
          </div>
        </div>
      </div>
    </section >
  );
} 