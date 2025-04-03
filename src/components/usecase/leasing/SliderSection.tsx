import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { sliderItems } from "@/data/leasing";

export default function SliderSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef<any>(null);

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl bricolage-grotesque font-medium mb-12">
          Combinez leasing, NFT et droits d&quot;auteur
        </h2>
        
        <p className="text-sm inter text-gray-300 mb-10 max-w-3xl">
          Les secteurs de l&quot;art et de la technologie sont en constante évolution. C&quot;est pourquoi InRealArt vous propose un modèle d&quot;optimisation innovant, combinant leasing, NFT, smart contract et blockchain pour répondre à vos besoins.
        </p>
        
        <Swiper
          modules={[Pagination]}
          ref={swiperRef}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          onSlideChange={(swiper) =>
            setActiveSlide(
              swiper.isEnd ? sliderItems.length - 1 : swiper.activeIndex
            )
          }
          slidesPerView={1}
          centeredSlidesBounds
          centeredSlides
          className="w-full"
        >
          {sliderItems.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="w-full rounded-lg p-10 md:p-16 bg-gradient-to-r from-[#1E1E1E] via-[#2E287A] to-[#1E1E1E] h-full">
                <div className="max-w-3xl mx-auto text-center flex flex-col gap-10 h-full">
                  <h3 className="text-6xl md:text-8xl bricolage-grotesque text-white">{item.id}</h3>
                  <h4 className="text-xl md:text-2xl bricolage-grotesque font-medium text-white">{item.title}</h4>
                  <p className="text-sm md:text-base inter text-white leading-relaxed">{item.description}</p>
                  <div className="flex mt-auto justify-between">
                    {sliderItems.map((_, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => swiperRef.current?.slideTo(idx)} 
                        className={`${activeSlide === idx ? '!bg-white' : ''} h-1.5 w-1/4 bg-black/20 cursor-pointer`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
} 