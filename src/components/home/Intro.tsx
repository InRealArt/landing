'use client'
import Image from "next/image";
import BG from "../../../public/images/intro-background.png";
import text43 from "../../../public/images/43.svg";
import text4 from "../../../public/images/4.svg";
import text3 from "../../../public/images/3.svg";
import textpourcent from "../../../public/images/%.svg";

// import text43 from "../../../public/images/43.png";


import Button from "../common/Button";
import { useLanguageStore } from '@/store/languageStore';

const Intro = () => {
  const { t } = useLanguageStore();

  return (
    <section className="bg-cover m-auto bg-no-repeat bg-bottom h-screen w-full flex items-center justify-center" style={{ backgroundImage: ` url('${BG.src}')` }}>
      <div className="max-w-90 xl:max-w-screen-xl m-auto md:mt-headerSize flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-7xl bricolage-grotesque font-medium max-w-4xl mb-12 md:mb-4">
          {t('home.intro.title')}
        </h1>

        <Image src={text43} alt="artist" />

        <div className="mt-12 md:mt-4">
          <p className="text-lg md:text-2xl mb-4 text-center bricolage-grotesque font-bold">{t('home.intro.subtitle')}</p>
          <Button
            text={t('buttons.readWhitepaper')}
            additionalClassName="border border-white text-white rounded-full py-3 px-8 opacity-50 cursor-not-allowed"
            center
            disabled={true}
          />
        </div>
      </div>
    </section>
  );
}

export default Intro;