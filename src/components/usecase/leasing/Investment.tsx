'use client'

import Image from "next/image";
import { useLanguageStore } from '@/store/languageStore';

export default function Investment() {
  const { t } = useLanguageStore();

  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="relative rounded-lg">
            <Image
              src="/images/leasing-image-investment.jpg"
              alt={t('leasing.investment.title')}
              width={600}
              height={600}
              className="w-full h-auto object-contain rounded-lg"
              priority
            />
          </div>
          <div>
            <h2 className="text-2xl md:text-4xl bricolage-grotesque font-medium mb-6">
              {t('leasing.investment.title')}
            </h2>
            <p className="text-sm inter text-gray-300 mb-6">
              {t('leasing.investment.description')}
            </p>
            <ul className="space-y-4 text-sm inter text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{t('leasing.investment.bullets.0')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{t('leasing.investment.bullets.1')}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{t('leasing.investment.bullets.2')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
} 