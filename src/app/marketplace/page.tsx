'use client'
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Button from "@/components/common/Button";
import artworkImage from "../../../public/images/artwork.png";
import marketplaceImage from "../../../public/images/marketplace.png";
import prestigeImage from "../../../public/images/prestige.png";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { useRef, useState } from "react";

export default function Marketplace() {
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef<any>(null);

  const benefits = [
    {
      title: "Authenticité et Traçabilité intégrales",
      description: "Chaque œuvre est authentifiée des experts et certifiée sur la blockchain pour une transparence totale."
    },
    {
      title: "Exclusivité et Confiance",
      description: "La marketplace n'héberge que diverses œuvres vérifiées, chaque achat est une assurance de garantie authentiquement pour des œuvres de dernier cri."
    },
    {
      title: "Possibilité de Revente Sécurisée",
      description: "Grâce au NFT de propriété, la revente est simple, rapide et sécurisée, faisant la liaison d'authentifiée pour les acheteurs."
    },
    {
      title: "Achat de droits d'auteurs",
      description: "Possibilité d'achat de une part d'œuvre d'exception pour davantage de contrôle, avec une liquidité intégrée lors d'une acquisition future."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Sélection d'Œuvres Certifiées",
      description: "En partenariat avec des artistes et galeries de renommée mondiale, InRealArt propose une collection haut de gamme d'œuvres d'art. Celle-ci réunit des créations de grands noms de l'art contemporain, des talents émergents prometteurs ainsi que des œuvres de maîtres incontournables."
    },
    {
      number: "02",
      title: "Processus de Vérification",
      description: "Chaque œuvre est soumise à un processus rigoureux de vérification et d'authentification par nos experts."
    },
    {
      number: "03",
      title: "Tokenisation Sécurisée",
      description: "Les œuvres sont tokenisées sur la blockchain, créant un certificat de propriété numérique unique et inviolable."
    }
  ];

  return (
    <>
      <section className="bg-cover bg-no-repeat bg-top h-screen w-full flex items-center justify-center" style={{ backgroundImage: `url('${marketplaceImage.src}')` }}>
        <div className="max-w-90 xl:max-w-screen-xl m-auto ">
          <h1 className="text-5xl leading-[1.3] md:leading-[1] md:text-6xl bricolage-grotesque text-left font-medium mb-4">
            Accédez à une Marketplace Exclusive<br />
            pour les Collectionneurs d'Art et<br />
            Investisseurs de Prestige
          </h1>
        </div>
      </section>

      <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-20">
        <h2 className="text-2xl md:text-4xl bricolage-grotesque font-medium mb-10">Comment ça fonctionne</h2>
        <Swiper
          modules={[Pagination]}
          ref={swiperRef}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) =>
            setActiveSlide(
              swiper.isEnd ? steps.length - 1 : swiper.activeIndex
            )
          }
          slidesPerView={1}
          centeredSlidesBounds
          centeredSlides
          className="w-full"
        >
          {steps.map((step, index) => (
            <SwiperSlide key={index}>
              <div className="w-full rounded-lg p-10 md:p-16 bg-gradient-to-r from-[#1E1E1E] via-[#2E287A] to-[#1E1E1E]">
                <div className="max-w-3xl mx-auto text-center">
                  <h3 className="text-6xl md:text-8xl bricolage-grotesque text-white mb-4">{step.number}</h3>
                  <h4 className="text-xl md:text-2xl bricolage-grotesque font-medium text-white mb-6">{step.title}</h4>
                  <p className="text-sm md:text-base inter text-white leading-relaxed">{step.description}</p>
                  <div className="h-0.5 w-64 bg-white/20 mx-auto mt-10"></div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-20">
        <h2 className="text-2xl md:text-4xl bricolage-grotesque font-medium mb-10">Bénéfices</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-cardBackground rounded-lg p-8 border border-white/20">
              <h3 className="text-xl bricolage-grotesque font-medium mb-2">{benefit.title}</h3>
              <p className="text-sm inter">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-20">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="w-full md:w-1/2">
            <h3 className="text-lg md:text-xl bricolage-grotesque mb-2">Authenticité et Traçabilité Inégalées</h3>
            <h2 className="text-3xl md:text-5xl bricolage-grotesque font-medium mb-6">
              InRealArt : Un Marché de<br />
              Confiance pour l'Art de<br />
              Prestige
            </h2>
            <p className="inter text-sm md:text-base mb-8 text-gray-300 max-w-xl">
              InRealArt transforme le marché de l'art haut de gamme en offrant une marketplace où
              la transparence, l'authenticité et l'exclusivité sont au cœur de chaque transaction.
              Achetez, vendez, ou investissez dans des œuvres d'art avec une garantie de
              provenance et une sécurité sans compromis.
            </p>
            <Button 
              text="Consulter la FAQ" 
              additionalClassName="bg-purpleColor" 
              icon={<ArrowRight />} 
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
    </>
  );
} 