'use client'

import OptimizedImage from "@/components/common/OptimizedImage";
import Button from "../common/Button";
import TranslatedText from "@/components/common/TranslatedText";
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

export default function Explore() {
  const { t } = useLanguageStore();

  const items = [
    { 
      key: 'block1',
      titleKey: 'home.explore.items.block1.title',
      labelKey: 'home.explore.items.block1.label',
      descriptionKey: 'home.explore.items.block1.description',
      buttons: {
        first: {
          text: t('home.explore.items.block1.buttons.artworks'),
          link: '/joinInRealArt/artists'
        }
      }
    },
    { 
      key: 'block2',
      titleKey: 'home.explore.items.block2.title',
      labelKey: 'home.explore.items.block2.label',
      descriptionKey: 'home.explore.items.block2.description',
      buttons: {
        first: {
          text: t('home.explore.items.block2.buttons.marketplace'),
          link: '/joinInRealArt/galleries'
        }
      }
    },
    { 
      key: 'block3',
      titleKey: 'home.explore.items.block3.title',
      labelKey: 'home.explore.items.block3.label',
      descriptionKey: 'home.explore.items.block3.description',
      buttons: {
        first: {
          text: t('home.explore.items.block3.buttons.usecase'),
          link: '/manifest'
        }
      }
    }
  ]

  return (
    <section className="w-full mt-36">
      <div className="max-w-90 xl:max-w-screen-xl m-auto">
        <h1 className="text-lg lg:text-xl bricolage-grotesque flex gap-4 ">
          <OptimizedImage src={`/icons/Logo-purple.png`} alt='IRA-LOGO' width={33} height={33} priority={true} />
          <TranslatedText translationKey="home.explore.title" />
        </h1>
        <TranslatedText 
          translationKey="home.explore.subtitle" 
          as="label" 
          className="text-2xl lg:text-5xl block bricolage-grotesque !leading-snug" 
          allowHtml={true} 
        />
      </div>
      <OptimizedImage className="max-w-full md:max-w-screen-image m-auto w-full mt-6" src={`/images/explore.png`} alt='IRA-IMAGE' width={1440} height={450} priority={false} />

      <div className="max-w-90 xl:max-w-screen-xl m-auto flex flex-col gap-4 ">
        {items.map((item, index) => {
          const reverseClassName = index % 2 !== 0 ? 'md:flex-row-reverse' : '';
          return (
            <div key={item.key} className={`w-full flex flex-col md:flex-row gap-6 md:gap-20 mt-28 items-center ${reverseClassName}`}>
              <div className="basis-1/2">
                <TranslatedText 
                  as="h1" 
                  className="text-xl lg:text-3xl bricolage-grotesque font-bold" 
                  translationKey={item.titleKey} 
                  allowHtml={true}
                />
                <TranslatedText 
                  as="label" 
                  className="my-4 block bricolage-grotesque" 
                  translationKey={item.labelKey} 
                />
              </div>
              <div className="basis-1/2">
                <TranslatedText 
                  as="label" 
                  className="my-4 block bricolage-grotesque" 
                  translationKey={item.descriptionKey}
                  allowHtml={true}
                />
                {item.buttons.first && <Button link={item.buttons.first.link} text={item.buttons.first.text} additionalClassName="bg-purpleColor" icon={<ArrowRight />} center />}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  );
}
