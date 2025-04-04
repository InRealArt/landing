'use client'

import { useLanguageStore } from '@/store/languageStore';
import Image from 'next/image';
import Button from '@/components/common/Button';
import { ArrowRight } from 'lucide-react';

export default function Solutions() {
  const { t } = useLanguageStore();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col-reverse md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2">
              <Image 
                src="/images/lending-medium.png" 
                alt="Solutions sur mesures" 
                className="w-full h-auto"
                width={500}
                height={350}
              />
          </div>
          
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl bricolage-grotesque font-medium mb-6">
              {t('lending.solutions.title')}
            </h2>
            <p className="text-gray-300 mb-6">
              {t('lending.solutions.description')}
            </p>
            <Button 
              text={t('lending.solutions.button')} 
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