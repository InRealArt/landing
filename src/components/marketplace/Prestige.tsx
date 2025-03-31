'use client'

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";
import prestigeImage from "../../../public/images/prestige.png";

export default function Prestige() {
  return (
    <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-20">
      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="w-full md:w-1/2">
          <h3 className="text-lg md:text-xl bricolage-grotesque mb-2">Authenticité et Traçabilité Inégalées</h3>
          <h2 className="text-3xl md:text-5xl bricolage-grotesque font-medium mb-6">
            InRealArt : Un Marché de<br />
            Confiance pour l&apos;Art de<br />
            Prestige
          </h2>
          <p className="inter text-sm md:text-base mb-8 text-gray-300 max-w-xl">
            InRealArt transforme le marché de l&apos;art haut de gamme en offrant une marketplace où
            la transparence, l&apos;authenticité et l&apos;exclusivité sont au cœur de chaque transaction.
            Achetez, vendez, ou investissez dans des œuvres d&apos;art avec une garantie de
            provenance et une sécurité sans compromis.
          </p>
          <Button
            text="Consulter la FAQ"
            additionalClassName="bg-purpleColor"
            icon={<ArrowRight />}
            link='/faq'
          />
        </div>
        <div className="w-full md:w-1/2">
          <div className="rounded-3xl">
            <Image
              src={prestigeImage}
              alt="Art de Prestige"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
} 