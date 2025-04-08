'use client'

import Image from "next/image";
import Button from "../common/Button";
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

export default function Explore() {
  const { t } = useLanguageStore();

  const items = [
    { 
      key: 'rare',
      name: t('home.explore.items.rare.title'),
      label: t('home.explore.items.rare.label'),
      description: t('home.explore.items.rare.description'),
      buttons: {
        first: {
          text: t('home.explore.items.rare.buttons.artworks'),
          link: '/presale'
        }
        // second: {
        //   text: t('home.explore.items.rare.buttons.getartworks'),
        //   link: '/'
        // },
      }
    },
    { 
      key: 'marketplace',
      name: t('home.explore.items.marketplace.title'),
      label: t('home.explore.items.marketplace.label'),
      description: t('home.explore.items.marketplace.description'),
      buttons: {
        first: {
          text: t('home.explore.items.marketplace.buttons.marketplace'),
          link: '/marketplace'
        }
      }
    },
    { 
      key: 'investment',
      name: t('home.explore.items.investment.title'),
      label: t('home.explore.items.investment.label'),
      description: t('home.explore.items.investment.description'),
      buttons: {
        first: {
          text: t('home.explore.items.investment.buttons.usecase'),
          link: '/usecase'
        }
      }
    }
  ]

  return (
    <section className="w-full mt-36">
      <div className="max-w-90 xl:max-w-screen-xl m-auto">
        <h1 className="text-lg lg:text-xl bricolage-grotesque flex gap-4 ">
          <Image src={`/icons/Logo-purple.png`} alt='IRA-LOGO' width="33" height="33" />
          {t('home.explore.title')}
        </h1>
        <label className="text-2xl lg:text-5xl block bricolage-grotesque !leading-snug" dangerouslySetInnerHTML={{ __html: t('home.explore.subtitle') }} />
      </div>
      <Image className="max-w-full md:max-w-screen-image m-auto w-full mt-6" src={`/images/explore.png`} alt='IRA-IMAGE' width="1440" height="450" />

      <div className="max-w-90 xl:max-w-screen-xl m-auto flex flex-col gap-4 ">
        {items.map((item, index) => {
          const reverseClassName = index % 2 !== 0 ? 'md:flex-row-reverse' : '';
          return (
            <div key={item.key} className={`w-full flex flex-col md:flex-row gap-6 md:gap-20 mt-28 items-center ${reverseClassName}`}>
              <div className="basis-1/2">
                <h1 className="text-2xl lg:text-5xl bricolage-grotesque">{item.name}</h1>
                <label className="my-4 block bricolage-grotesque">{item.label}</label>
              </div>
              <div className="basis-1/2">
                <label className="my-4 block bricolage-grotesque">{item.description}</label>
                {item.buttons.first && <Button link={item.buttons.first.link} text={item.buttons.first.text} additionalClassName="bg-purpleColor" icon={<ArrowRight />} center />}
              </div>
            </div>
          )
        })}
      </div>
      <Image className="max-w-full md:max-w-screen-image m-auto w-full mt-16 md:mt-32" src={`/images/explore-1.png`} alt='IRA-IMAGE' width="1440" height="450" />
    </section>
  );
}
