'use client'

import { bigTitleClassName } from "@/utils/classes";
import BG from "../../../public/images/presale/intro.png";
import Button from "../common/Button";
import { ArrowRight } from "lucide-react";
import { useLanguageStore } from '@/store/languageStore';

const Intro = () => {
  const { t } = useLanguageStore();

  return (
    <section className="bg-cover m-auto bg-no-repeat bg-bottom h-screen w-full flex items-center justify-center" style={{ backgroundImage: ` url('${BG.src}')`}}>
      <div className="max-w-90 xl:max-w-screen-xl m-auto gap-12 flex flex-col mt-32 md:flex-row md:justify-between md:mt-auto">
      <div className="md:w-6/12 bricolage-grotesque font-semibold">
          <h1 className="text-4xl md:text-7xl bricolage-grotesque mb-8">{t('presale.intro.title')}</h1>
          <h3 className="mb-8 inter text-lg">{t('presale.intro.subtitle')}</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <Button link="/presale" text={t('presale.intro.buttons.catalog')} additionalClassName="bg-purpleColor mr-6" icon={<ArrowRight />} />
            <Button 
              text={t('presale.intro.buttons.whitepaper')} 
              additionalClassName="mt-4 md:mt-0 opacity-50 cursor-not-allowed" 
              disabled={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Intro;