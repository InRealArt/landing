'use client'
import OptimizedContentImage from '../common/OptimizedContentImage';
import OptimizedBackgroundImage from '../common/OptimizedBackgroundImage';
import text43 from "../../../public/images/43.svg";
import text4 from "../../../public/images/4.svg";
import text3 from "../../../public/images/3.svg";
import textpourcent from "../../../public/images/%.svg";
import schema from "../../../public/images/schema.png";

// import text43 from "../../../public/images/43.png";

import Button from "../common/Button";
import { useLanguageStore } from '@/store/languageStore';

const Intro = () => {
  const { t } = useLanguageStore();

  return (
    <OptimizedBackgroundImage
      src="/images/intro-background.png"
      alt="Arrière-plan de la section d'introduction"
      width={1920}
      height={1080}
      className="bg-cover m-auto bg-no-repeat bg-bottom w-full flex items-center justify-center mt-headerSize md:mt-0"
      overlay={false}
    >
      <div className="max-w-90 xl:max-w-screen-xl m-auto md:mt-headerSize flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-7xl bricolage-grotesque font-medium max-w-4xl mb-4">
          {t('home.intro.title')}
        </h1>

        <OptimizedContentImage 
          className="my-8 md:my-12" 
          src={schema.src} 
          alt="Schéma explicatif" 
          width={800}
          height={600}
          priority={true}
          quality={90}
        />

        <div className="mt-12 md:mt-4">
          <Button
            text={t('buttons.readWhitepaper')}
            additionalClassName="border border-white text-white rounded-full py-3 px-8"
            center
            link="manifest"
          />
        </div>
      </div>
    </OptimizedBackgroundImage>
  );
}

export default Intro;