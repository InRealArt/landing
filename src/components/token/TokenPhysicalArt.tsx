'use client'

import { useLanguageStore } from '@/store/languageStore';
import Image from 'next/image';
import Button from '@/components/common/Button';
import { ArrowRight, ArrowUp } from 'lucide-react';

export default function TokenPhysicalArt() {
  const { t } = useLanguageStore();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <section className="py-20 container mx-auto px-4">
      <div>
        <div className="order-2 md:order-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 unbounded leading-tight">
            {t('token.physicalArt.title')}
          </h1>

          <p className=" mb-8 bricolage-grotesque">
            {t('token.physicalArt.description')}
          </p>

          <div className="mb-10 bricolage-grotesque">
            <p className="mb-4 font-medium">
              {t('token.physicalArt.tokenIntro')}
            </p>
            <ul className="space-y-1">
              <li className="flex items-start gap-2">
                •   {t('token.physicalArt.features.dao')}
              </li>
              <li className="flex items-start gap-2">
                •   {t('token.physicalArt.features.revenue')}
              </li>
              <li className="flex items-start gap-2">
                •   {t('token.physicalArt.features.privileges')}
              </li>
            </ul>
          </div>

          <p className="mb-8 bricolage-grotesque">
            {t('token.physicalArt.infrastructure')}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative w-full rounded-lg basis-3/5">
            <Image
              src="/images/physiqueart.png"
              alt="Physical Art"
              className="object-cover w-full h-auto"
              width={1000}
              height={1000}
            />
          </div>

          <div className="bg-cardBackground p-6 rounded-lg basis-2/5 flex flex-col justify-between gap-16">
            <div>
              <h2 className="text-2xl font-bold mb-4 unbounded">
                {t('token.physicalArt.meaning.title')}
              </h2>
              <p className="bricolage-grotesque">
                {t('token.physicalArt.meaning.description')}
              </p>
            </div>
            <Button
              text={t('token.physicalArt.button')}
              action={scrollToTop}
              additionalClassName="bg-purpleColor"
              center
            />
          </div>
        </div>
      </div>
    </section>
  );
} 