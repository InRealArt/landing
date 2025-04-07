'use client'

import { useLanguageStore } from '@/store/languageStore';
import Image from 'next/image';

export default function TokenICO() {
  const { t } = useLanguageStore();

  const timelineItems = [
    { key: 'presale', className: 'bg-indigo-600' },
    { key: 'publicSale', className: 'bg-[#282828]' },
    { key: 'listing', className: 'bg-[#282828]' },
    { key: 'vesting', className: 'bg-[#282828]' },
    { key: 'team', className: 'bg-[#282828]' },
    { key: 'advisory', className: 'bg-[#282828]' }
  ];

  return (
    <section className="py-20 container mx-auto px-4 mt-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 bricolage-grotesque">
          {t('token.ico.title')}
        </h2>
        <p className="text-gray-300 mx-auto max-w-3xl">
          {t('token.ico.subtitle')}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10 ">
        <div className="flex flex-col gap-2 basis-2/5 bg-cardBackground p-2 rounded-lg h-full">
          {timelineItems.map((item) => (
            <div 
              key={item.key} 
              className={`p-2 rounded-lg ${item.className} border border-gray-800`}
            >
              <div className="font-semibold text-xl mb-1">{t(`token.ico.timeline.${item.key}.label`)}</div>
              <div className="text-gray-300 text-sm">{t(`token.ico.timeline.${item.key}.date`)}</div>
            </div>
          ))}
        </div>

        <div className="relative basis-3/5">
          <Image
            src="/images/ICO.png"
            alt="ICO"
            className="w-full h-auto"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </section>
  );
} 