'use client'
import Button from "../common/Button";
import { ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

export default function HowItWorks() {
  const { t } = useLanguageStore();

  const items = [
    { 
      name: t('home.howItWorks.items.bridge.title'), 
      description: t('home.howItWorks.items.bridge.description'),
      link: '/marketplace'
    },
    { 
      name: t('home.howItWorks.items.token.title'), 
      description: t('home.howItWorks.items.token.description') ,
      link: '/token'
    },
    { 
      name: t('home.howItWorks.items.art.title'), 
      description: t('home.howItWorks.items.art.description') ,
      link: '/usecase'
    },
  ]

  return (
    <section className="w-full max-w-[1600px] m-auto mt-36 px-6">
      <h1 className="text-3xl lg:text-5xl bricolage-grotesque text-center">{t('home.howItWorks.title')}</h1>
      <label className="mt-4 block text-center">{t('home.howItWorks.subtitle')}</label>
      <div className="flex flex-col lg:flex-row gap-5 mt-10 justify-between">
        {items.map((item, index) => (
          <div key={index} className="flex-1 p-4 lg:p-8 border rounded-lg bg-cardBackground flex flex-col min-w-0 lg:min-w-[400px]">
            <h1 className="text-2xl lg:text-3xl unbounded whitespace-nowrap">{item.name}</h1>
            <label className="my-4 block">{item.description}</label>
            <Button text={t('buttons.readMore')} additionalClassName="mt-auto bg-purpleColor w-full" icon={<ArrowRight />} center link={item.link} />
          </div>
        ))}
      </div>
    </section>
  );
}
