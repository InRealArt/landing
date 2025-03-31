'use client'

import BG from "../../../public/images/intro-background.png";
import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";

export default function Header() {
  const caseStudies = [
    {
      title: "Fractionnement des œuvres d'art",
      link: "/usecase/fractionnement"
    },
    {
      title: "Une marketplace Exclusive",
      link: "/usecase/marketplace"
    },
    {
      title: "Fractionnement des œuvres d'art",
      link: "/usecase/fractionnement-2"
    },
    {
      title: "Une marketplace Exclusive",
      link: "/usecase/marketplace-2"
    }
  ];

  return (
    <section className="bg-cover bg-no-repeat bg-top py-20 w-full pt-headerSize" style={{ backgroundImage: `url('${BG.src}')`}}>
      <div className="max-w-90 xl:max-w-screen-xl m-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl bricolage-grotesque font-medium mb-4">
            Case studies
          </h1>
          <p className="text-lg md:text-xl inter text-gray-300">
            Une plateforme conçue pour les artistes, par des passionnés d'art.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {caseStudies.map((caseStudy, index) => (
            <div key={index} className="bg-cardBackground rounded-lg p-8 border border-white/20">
              <h3 className="text-xl bricolage-grotesque font-medium mb-6">{caseStudy.title}</h3>
              <Button 
                text="Voir le Use Case" 
                additionalClassName="bg-purpleColor w-full justify-center" 
                icon={<ArrowRight />} 
                link={caseStudy.link}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 