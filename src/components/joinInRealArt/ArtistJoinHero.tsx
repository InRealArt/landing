'use client'

import { useLanguageStore } from '@/store/languageStore';
import { ArrowRight } from 'lucide-react';
import BG from "../../../public/images/intro-background.png";
import Button from "@/components/common/Button";

// Composant Hero pour la page des artistes
export default function ArtistJoinHero() {
  const { t } = useLanguageStore();

  const urlForm = 'https://docs.google.com/forms/d/1RxKNtLG2XZ7BB2CpzGI4yJZCjSJ3cSXwOHQKgwVC4gA/viewform?edit_requested=true#responses'

  return (
    <section className="bg-cover m-auto bg-no-repeat bg-bottom h-[80vh] w-full flex items-end justify-center pb-16" style={{ backgroundImage: ` url('${BG.src}')` }}>
      <div className="max-w-90 xl:max-w-screen-xl m-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
        {/* Texte principal à gauche */}
        <div className="flex-1 text-center md:text-left pt-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl bricolage-grotesque font-medium text-white mb-4">
            {t('joinInRealArt.artists.hero.title')}
          </h1>
        </div>
        
        {/* Texte secondaire et bouton à droite */}
        <div className="flex-none md:max-w-md text-center md:text-left">
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl">
            {t('joinInRealArt.artists.hero.subtitle')}
          </p>
          <Button 
            text={t('joinInRealArt.artists.hero.button')} 
            additionalClassName="bg-purpleColor hidden lg:flex w-fit" 
            icon={<ArrowRight />} 
            center 
            link={urlForm}
            target="_blank"
          />
        </div>
      </div>
    </section>
  );
} 