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
      backgroundImage: '/images/home/inrealart_for_artists.webp',
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
      backgroundImage: '/images/home/inrealart_for_ceos.webp',
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
      backgroundImage: '/images/home/inrealart_for_institutions.webp',
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
          className="text-xl lg:text-4xl block bricolage-grotesque !leading-snug" 
          allowHtml={true} 
        />
      </div>
      <OptimizedImage className="max-w-full md:max-w-screen-image m-auto w-full mt-6" src={`/images/home/explore/bg.png`} alt='IRA-IMAGE' width={1440} height={250} priority={false} />

      <div className="max-w-90 xl:max-w-screen-xl m-auto flex flex-col gap-4 ">
        {items.map((item, index) => {
          const reverseClassName = index % 2 !== 0 ? 'md:flex-row-reverse' : '';
          return (
            <div key={item.key} className={`w-full flex flex-col md:flex-row gap-6 md:gap-20 mt-28 items-center ${reverseClassName}`}>
              <div className="w-full md:basis-1/2 relative min-h-[300px] md:min-h-[400px] overflow-hidden rounded-lg">
                {/* Image de fond */}
                <div className="absolute inset-0 -z-10">
                  <OptimizedImage 
                    src={item.backgroundImage} 
                    alt={`Background for ${item.key}`} 
                    width={600} 
                    height={400} 
                    className="w-full h-full object-cover"
                    priority={false}
                  />
                </div>
                {/* Contenu du titre et label */}
                <div className="relative z-10 p-4 h-full flex flex-col justify-center">
                  <div className="relative">
                    {/* Zone de surbrillance derrière le titre */}
                    <div className="absolute inset-0 bg-gray-500/30 backdrop-blur-sm rounded-lg -m-2"></div>
                    <TranslatedText 
                      as="h1" 
                      className="relative text-xl lg:text-3xl bricolage-grotesque font-bold text-white drop-shadow-lg" 
                      translationKey={item.titleKey} 
                      allowHtml={true}
                    />
                  </div>
                  <TranslatedText 
                    as="label" 
                    className="my-4 block bricolage-grotesque text-white drop-shadow-lg" 
                    translationKey={item.labelKey} 
                  />
                </div>
              </div>
              <div className="w-full md:basis-1/2">
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
