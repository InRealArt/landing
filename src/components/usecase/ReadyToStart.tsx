'use client'

import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";

export default function ReadyToStart() {
  const galleries = [
    {
      title: "Mais c'est aussi une galerie d'art ouverte à tous",
      description: "Au-delà du de l'aspect tradition InRealArt c'est aussi le moyen d'acquérir des fractions d'œuvres d'art, de vous proposer des artistes et oeuvres de notre éco-système.",
      link: "/usecase/gallery"
    },
    {
      title: "Mais c'est aussi une galerie d'art ouverte à tous",
      description: "Au-delà du de l'aspect tradition InRealArt c'est aussi le moyen d'acquérir des fractions d'œuvres d'art, de vous proposer des artistes et oeuvres de notre éco-système.",
      link: "/usecase/gallery-2"
    },
    {
      title: "Mais c'est aussi une galerie d'art ouverte à tous",
      description: "Au-delà du de l'aspect tradition InRealArt c'est aussi le moyen d'acquérir des fractions d'œuvres d'art, de vous proposer des artistes et oeuvres de notre éco-système.",
      link: "/usecase/gallery-3"
    }
  ];

  return (
    <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-32 mb-20">
      <h2 className="text-3xl md:text-5xl bricolage-grotesque font-medium mb-4">
        Ready to give a go ?
      </h2>
      <p className="text-md md:text-lg inter text-gray-300 mb-10">
        Explorez une collection unique de toiles physiques et de sculpture rare, de leurs copies numériques (NFT), accompagnées de leurs droits d'auteur.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {galleries.map((gallery, index) => (
          <div key={index} className="bg-cardBackground rounded-lg p-8 border border-white/20">
            <h3 className="text-xl bricolage-grotesque font-medium mb-4">{gallery.title}</h3>
            <p className="text-sm inter mb-6">{gallery.description}</p>
            <Button 
              text="Voir le Use Case" 
              additionalClassName="bg-purpleColor w-full justify-center" 
              icon={<ArrowRight />} 
              link={gallery.link}
            />
          </div>
        ))}
      </div>
    </section>
  );
} 