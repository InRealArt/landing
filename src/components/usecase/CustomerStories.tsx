'use client'

import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";
import { useLanguageStore } from '@/store/languageStore';

interface Story {
  title: string;
  description: string;
  benefits: string[];
  link: string;
}

export default function CustomerStories() {
  const { t } = useLanguageStore();

  // Define features explicitly
  const investorFeatures = [
    t('usecase.items.investor.features.0'),
    t('usecase.items.investor.features.1'),
    t('usecase.items.investor.features.2'),
    t('usecase.items.investor.features.3')
  ];

  const galleryFeatures = [
    t('usecase.items.gallery.features.0'),
    t('usecase.items.gallery.features.1'),
    t('usecase.items.gallery.features.2'),
    t('usecase.items.gallery.features.3')
  ];

  const stories: Story[] = [
    {
      title: t('usecase.items.investor.title'),
      description: t('usecase.items.investor.description'),
      benefits: investorFeatures,
      link: "/usecase/leasing"
    },
    {
      title: "Services Financiers pour l'Art",
      description: "Accédez à des solutions de financement flexibles basées sur vos œuvres d'art, sans avoir à les vendre.",
      benefits: [
        "Prêts garantis par des œuvres d'art",
        "Alternatives aux prêts bancaires traditionnels",
        "Évaluation professionnelle des actifs artistiques",
        "Solutions personnalisées pour les besoins spécifiques"
      ],
      link: "/usecase/lending"
    },
    {
      title: t('usecase.items.gallery.title'),
      description: t('usecase.items.gallery.description'),
      benefits: galleryFeatures,
      link: "/usecase/companies"
    }
  ];

  return (
    <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-32">
      <h2 className="text-3xl md:text-5xl bricolage-grotesque font-medium mb-4">
        Nos Solutions
      </h2>
      <p className="text-base md:text-lg inter text-gray-300 mb-10">
        Découvrez comment InRealArt transforme le marché de l'art à travers des solutions innovantes
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stories.map((story, index) => (
          <div key={index} className="bg-cardBackground rounded-lg p-8 border border-white/20">
            <h3 className="text-xl bricolage-grotesque font-medium mb-4">{story.title}</h3>
            <p className="text-sm text-gray-300 mb-6">{story.description}</p>
            <ul className="mb-6">
              {story.benefits.map((benefit: string, bIndex: number) => (
                <li key={bIndex} className="flex items-start mb-2">
                  <span className="w-1 h-1 bg-purpleColor rounded-full mr-2 mt-2"></span>
                  <span className="text-sm inter">{benefit}</span>
                </li>
              ))}
            </ul>
            <Button 
              text={t('buttons.readMore')} 
              additionalClassName="bg-purpleColor w-full justify-center" 
              icon={<ArrowRight />} 
              link={story.link}
            />
          </div>
        ))}
      </div>
    </section>
  );
} 