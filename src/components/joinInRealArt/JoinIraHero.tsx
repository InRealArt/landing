'use client'

import { useLanguageStore } from '@/store/languageStore';
import { ArrowRight } from 'lucide-react';
import BG from "../../../public/images/intro-background.png";
import Button from "@/components/common/Button";
import TranslatedText from "@/components/common/TranslatedText";

interface JoinIraHeroProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonUrl?: string;
}

// Composant Hero réutilisable pour les pages Join In Real Art
export default function JoinIraHero({ title, subtitle, buttonText, buttonUrl }: JoinIraHeroProps) {
  const { t } = useLanguageStore();
  
  return (
    <section className="bg-cover m-auto bg-no-repeat bg-bottom h-[80vh] w-full flex items-end justify-center pb-16" style={{ backgroundImage: ` url('${BG.src}')` }}>
      <div className="max-w-90 xl:max-w-screen-xl m-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
        {/* Texte principal à gauche */}
        <div className="flex-1 text-center md:text-left pt-8">
          <TranslatedText 
            translationKey={title}
            as="h1"
            className="text-4xl md:text-6xl lg:text-7xl bricolage-grotesque font-medium text-white mb-4"
            allowHtml={true}
          />
        </div>
        
        {/* Texte secondaire et bouton à droite */}
        <div className="flex-none md:max-w-md text-center md:text-left">
          <TranslatedText 
            translationKey={subtitle}
            as="p"
            className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl"
            allowHtml={true}
          />
          <Button 
            text={t(buttonText)} 
            additionalClassName="bg-purpleColor hidden lg:flex w-fit" 
            icon={<ArrowRight />} 
            center 
            link={buttonUrl}
            target={buttonUrl?.startsWith('#') ? '_self' : '_blank'}
          />
        </div>
      </div>
    </section>
  );
} 