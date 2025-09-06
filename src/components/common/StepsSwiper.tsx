'use client'

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation } from 'swiper/modules';

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

  const goToNext = () => {
    if (swiperRef.current && activeSlide < steps.length - 1) {
      swiperRef.current.slideNext();
    }
  };

  const goToPrev = () => {
    if (swiperRef.current && activeSlide > 0) {
      swiperRef.current.slidePrev();
    }
  };

  return (
    <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-20">
      <h2 className="text-2xl md:text-4xl bricolage-grotesque font-medium mb-10">{title}</h2>
      
      <div className="relative">
        <Swiper
          modules={[Navigation]}
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
                  <h3 className="text-6xl md:text-8xl bricolage-grotesque text-textColor">{step.number}</h3>
                  <h4 className="text-xl md:text-2xl bricolage-grotesque font-medium text-textColor">{step.title}</h4>
                  <p className="text-sm md:text-base text-textColor leading-relaxed">{step.description}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Flèche précédente - positionnée à gauche au centre vertical */}
        <button
          onClick={goToPrev}
          disabled={activeSlide === 0}
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
            activeSlide === 0
              ? 'border-gray-400 text-grayText cursor-not-allowed'
              : 'border-white text-textColor hover:bg-backgroundColor hover:text-textColor'
          }`}
          aria-label="Étape précédente"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>

        {/* Flèche suivante - positionnée à droite au centre vertical */}
        <button
          onClick={goToNext}
          disabled={activeSlide === steps.length - 1}
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
            activeSlide === steps.length - 1
              ? 'border-gray-400 text-grayText cursor-not-allowed'
              : 'border-white text-textColor hover:bg-backgroundColor hover:text-textColor'
          }`}
          aria-label="Étape suivante"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>

        {/* Indicateur de position */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <span className="text-textColor text-sm bg-backgroundColor/50 px-3 py-1 rounded-full">
            {activeSlide + 1} / {steps.length}
          </span>
        </div>
      </div>
    </section>
  );
} 