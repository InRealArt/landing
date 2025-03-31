'use client'

import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";

export default function CustomerStories() {
  const stories = [
    {
      title: "Accès simplifié aux investissements en art grâce à la fractionnalisation des œuvres d'art",
      benefits: [
        "Accès à l'art de grande valeur",
        "Liquidité de l'investissement",
        "Suivi et transparence",
        "Rendement potentiel"
      ],
      link: "/usecase/investment"
    },
    {
      title: "Accès simplifié aux investissements en art grâce à la fractionnalisation des œuvres d'art",
      benefits: [
        "Accès à l'art de grande valeur",
        "Liquidité de l'investissement",
        "Suivi et transparence",
        "Rendement potentiel"
      ],
      link: "/usecase/investment-2"
    }
  ];

  return (
    <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-32">
      <h2 className="text-3xl md:text-5xl bricolage-grotesque font-medium mb-4">
        Recent customers stories
      </h2>
      <p className="text-md md:text-lg inter text-gray-300 mb-10">
        Explorez une collection unique de toiles physiques et de sculpture rare, de leurs copies numériques (NFT), accompagnées de leurs droits d&apos;auteur.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stories.map((story, index) => (
          <div key={index} className="bg-cardBackground rounded-lg p-8 border border-white/20">
            <h3 className="text-xl bricolage-grotesque font-medium mb-6">{story.title}</h3>
            <ul className="mb-6">
              {story.benefits.map((benefit, bIndex) => (
                <li key={bIndex} className="flex items-center mb-2">
                  <span className="w-1 h-1 bg-purpleColor rounded-full mr-2"></span>
                  <span className="text-sm inter">{benefit}</span>
                </li>
              ))}
            </ul>
            <Button 
              text="Voir le Use Case" 
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