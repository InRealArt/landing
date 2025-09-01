'use client'

import BG from "../../../public/images/presale/hero_presale.webp";
import { useLanguageStore } from '@/store/languageStore';

const Intro = () => {
  const { t } = useLanguageStore();

  return (
    <section className="relative w-full h-96 md:h-[550px] overflow-hidden">
      {/* Image de fond */}
      <div className="absolute inset-0">
        <img
          src={BG.src}
          alt="Background presale"
          className="w-full h-full object-cover"
        />
        
        {/* Dégradé du bas vers le background RGB(19, 19, 19) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[rgb(19,19,19)] via-[rgb(19,19,19,0.8)] to-transparent" />
      </div>

      {/* Contenu du hero */}
      <div className="relative z-10 flex items-center h-full">
        <div className="max-w-90 xl:max-w-screen-xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:justify-between gap-12">
            <div className="md:w-6/12 bricolage-grotesque font-semibold">
              <h1 className="text-4xl md:text-7xl bricolage-grotesque mb-8 text-white">{t('presale.intro.title')}</h1>
              <h3 className="mb-8 inter text-lg text-white/90">{t('presale.intro.subtitle')}</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Intro;