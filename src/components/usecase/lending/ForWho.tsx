'use client'

import { useLanguageStore } from '@/store/languageStore';
import OptimizedImage from '@/components/common/OptimizedImage';
import Button from '@/components/common/Button';
import { Phone } from 'lucide-react';
import { EXTERNAL_URLS } from '@/constants/constants';

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
            <Button 
              text={t('contact.scheduleMeeting')} 
              iconBefore 
              additionalClassName="bg-purpleColor mt-8" 
              icon={<Phone />} 
              center 
              target='_blank' 
              link={EXTERNAL_URLS.CALENDLY_MEETING} 
              data-umami-event="calendly-lending-forwho-click"
            />
          </div>
          
          <div className="w-full md:w-1/2">
              <OptimizedImage 
                src="/images/usecase/lending/aberwrach.webp" 
                alt="Pour qui ?" 
                className="w-full [&_img]:w-full [&_img]:h-auto"
                width={500}
                height={530}
              />
          </div>
        </div>
      </div>
    </section>
  );
} 