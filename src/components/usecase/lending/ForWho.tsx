'use client'

import { useLanguageStore } from '@/store/languageStore';
import Image from 'next/image';

export default function ForWho() {
  const { t } = useLanguageStore();
  
  // Get the translation strings directly
  const whyChooseTitle = t('lending.whyChoose.title');
  const forWhoTitle = t('lending.forWho.title');
  
  // Get the items arrays
  const whyChooseItems = [
    t('lending.whyChoose.items.0'),
    t('lending.whyChoose.items.1'),
    t('lending.whyChoose.items.2')
  ];
  
  const forWhoItems = [
    t('lending.forWho.items.0'),
    t('lending.forWho.items.1'),
    t('lending.forWho.items.2')
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* ForWho content */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl bricolage-grotesque font-medium mb-4">
              {whyChooseTitle}
            </h2>
            <ul className="space-y-1">
              {whyChooseItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
            <h2 className="text-3xl md:text-4xl bricolage-grotesque font-medium mb-4 mt-12">
              {forWhoTitle}
            </h2>
            <ul className="space-y-1">
              {forWhoItems.map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <p>{item}</p>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="w-full md:w-1/2">
              <Image 
                src="/images/lending-big.png" 
                alt="Pour qui ?" 
                className="w-full h-auto"
                width={500}
                height={530}
              />
          </div>
        </div>
      </div>
    </section>
  );
} 