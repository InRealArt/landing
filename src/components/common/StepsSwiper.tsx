'use client'

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

interface Step {
  number: string;
  title: string;
  description: string;
}

interface StepsSwiperProps {
  title: string;
  steps: Step[];
}

export default function StepsSwiper({ title, steps }: StepsSwiperProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef<any>(null);

  return (
    <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-20">
      <h2 className="text-2xl md:text-4xl bricolage-grotesque font-medium mb-10">{title}</h2>
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
            <div className="w-full rounded-lg p-10 md:p-16 bg-gradient-to-r from-[#1E1E1E] via-[#2E287A] to-[#1E1E1E] h-full">
              <div className="max-w-3xl mx-auto text-center flex flex-col gap-10 h-full">
                <h3 className="text-6xl md:text-8xl bricolage-grotesque text-white">{step.number}</h3>
                <h4 className="text-xl md:text-2xl bricolage-grotesque font-medium text-white">{step.title}</h4>
                <p className="text-sm md:text-base inter text-white leading-relaxed">{step.description}</p>
                <div className="flex mt-auto justify-between">
                  {steps.map((_, idx) => (
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
    </section>
  );
} 