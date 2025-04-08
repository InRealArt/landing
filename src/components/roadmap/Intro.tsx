'use client'
import BG from "../../../public/images/presale/intro.png";
import Button from "../common/Button";
import { ArrowRight } from "lucide-react";
import { useLanguageStore } from '@/store/languageStore';

const Intro = () => {
  const { t } = useLanguageStore();

  return (
    <section className="bg-cover m-auto bg-no-repeat bg-bottom h-screen w-full " style={{ backgroundImage: ` url('${BG.src}')` }}>
        <div className="max-w-90 xl:max-w-screen-xl m-auto flex flex-col justify-center h-screen items-start bricolage-grotesque font-semibold">
          <h1 className="text-4xl md:text-7xl bricolage-grotesque mb-8">{t('roadmap.intro.title')}</h1>
          <h3 className="mb-8 inter text-lg">{t('roadmap.intro.subtitle')}</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <Button link="/presale" text={t('roadmap.intro.buttons.marketplace')} additionalClassName="bg-purpleColor mr-6" icon={<ArrowRight />} />
            <Button 
              text={t('roadmap.intro.buttons.whitepaper')} 
              additionalClassName="mt-4 md:mt-0 opacity-50 cursor-not-allowed" 
              disabled={true}
            />
          </div>
        </div>
    </section>
  );
}

export default Intro;