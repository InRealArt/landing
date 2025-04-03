'use client'
import { bigTitleClassName } from "@/utils/classes";
import BG from "../../../public/images/presale/intro.png";
import buyImage from "../../../public/images/presale/buy-1.png";
import { useState } from "react";
import Button from "../common/Button";
import { useLanguageStore } from '@/store/languageStore';

interface BuyImage {
  image: typeof buyImage;
  step: string;
  name: string;
  description: string;
}

const BuyProcess = () => {
  const [activeSlide, setActiveSlide] = useState<number>(0)
  const { t } = useLanguageStore();

  const buyImages: BuyImage[] = [
    { 
      image: buyImage, 
      step: '01', 
      name: t('presale.buyProcess.steps.1.title'), 
      description: t('presale.buyProcess.steps.1.description') 
    },
    { 
      image: buyImage, 
      step: '02', 
      name: t('presale.buyProcess.steps.2.title'), 
      description: t('presale.buyProcess.steps.2.description') 
    },
    { 
      image: buyImage, 
      step: '03', 
      name: t('presale.buyProcess.steps.3.title'), 
      description: t('presale.buyProcess.steps.3.description') 
    },
    { 
      image: buyImage, 
      step: '04', 
      name: t('presale.buyProcess.steps.4.title'), 
      description: t('presale.buyProcess.steps.4.description') 
    },
  ]

  const handleSlide = (plus?: boolean) => {
    if (plus) {
      setActiveSlide(activeSlide === buyImages.length - 1 ? buyImages.length - 1 : activeSlide + 1)
      return
    }
    setActiveSlide(activeSlide === 0 ? 0 : activeSlide - 1)
  }

  const item = buyImages[activeSlide]

  return (
    <section className="relative max-w-90 xl:max-w-screen-2xl m-auto" >
      <div className="text-center">
        <h1 className="text-2xl md:text-4xl font-bold mt-10">{t('presale.buyProcess.title')}</h1>
        <label>{t('presale.buyProcess.subtitle')}</label>
      </div>
      <div className="relative mt-8">
        <div className="m-auto w-full h-auto relative ">
          <img src={item.image.src} alt="buy" className="w-full h-auto" />
          <h1 className="unbounded absolute text-[8px] leading-[0.9] lg:text-xl top-0 left-0">{t('presale.buyProcess.step')} {item.step}</h1>
          <h3 className="unbounded absolute bottom-0 left-0 text-xs md:text-2xl lg:text-3xl xl:text-5xl max-w-65" dangerouslySetInnerHTML={{ __html: item.name }} />
          <div className="unbounded absolute bottom-2 right-2 w-30 bg-white p-4 rounded-lg hidden lg:block">
            <p className="text-[11px] text-black" dangerouslySetInnerHTML={{ __html: item.description }} />
            <div className="flex justify-between mt-6">
              <Button action={() => handleSlide()} additionalClassName="bg-purpleColor text-xs" text={t('presale.buyProcess.buttons.previous')} />
              <Button action={() => handleSlide(true)} additionalClassName="bg-purpleColor text-xs" text={t('presale.buyProcess.buttons.next')} />
            </div>
          </div>
        </div>
        <div className="unbounded w-full bg-white p-4 rounded-lg lg:hidden mt-10">
          <p className="text-[11px] text-black" dangerouslySetInnerHTML={{ __html: item.description }} />
          <div className="flex justify-between mt-6">
            <Button action={() => handleSlide()} additionalClassName="bg-purpleColor text-xs" text={t('presale.buyProcess.buttons.previous')} />
            <Button action={() => handleSlide(true)} additionalClassName="bg-purpleColor text-xs" text={t('presale.buyProcess.buttons.next')} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default BuyProcess;