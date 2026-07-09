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
    <section className="py-32 px-10 bg-[var(--canvas-bg)]">
      <div className="max-w-screen-2xl mx-auto">
        <div className="border-b border-[var(--border-light)] pb-12 mb-16">
          <span className="section-number">Processus</span>
          <h2 className="text-5xl md:text-7xl serif italic leading-tight">{title}</h2>
        </div>

        <div className="relative">
          <Swiper
            modules={[Navigation]}
            ref={swiperRef}
            onSwiper={(swiper) => { swiperRef.current = swiper; }}
            onSlideChange={(swiper) =>
              setActiveSlide(swiper.isEnd ? steps.length - 1 : swiper.activeIndex)
            }
            slidesPerView={1}
            centeredSlidesBounds
            centeredSlides
            className="w-full"
          >
            {steps.map((step, index) => (
              <SwiperSlide key={index}>
                <div className="w-full border border-[var(--border-light)] p-12 md:p-20 bg-[var(--soft-gray)]">
                  <div className="max-w-3xl mx-auto text-center flex flex-col gap-8">
                    <span className="serif text-7xl md:text-9xl italic text-[var(--gold-accent)]">{step.number}</span>
                    <h4 className="serif italic text-2xl md:text-3xl text-[var(--ink-black)]">{step.title}</h4>
                    <p className="text-sm text-[var(--gray-text)] leading-loose uppercase tracking-[0.15em] max-w-lg mx-auto">{step.description}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Flèche précédente */}
          <button
            onClick={goToPrev}
            disabled={activeSlide === 0}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 border transition-all duration-500 ${
              activeSlide === 0
                ? 'border-[var(--border-light)] text-[var(--border-light)] cursor-not-allowed'
                : 'border-[var(--ink-black)] text-[var(--ink-black)] hover:bg-[var(--ink-black)] hover:text-white'
            }`}
            aria-label="Étape précédente"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>

          {/* Flèche suivante */}
          <button
            onClick={goToNext}
            disabled={activeSlide === steps.length - 1}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 border transition-all duration-500 ${
              activeSlide === steps.length - 1
                ? 'border-[var(--border-light)] text-[var(--border-light)] cursor-not-allowed'
                : 'border-[var(--ink-black)] text-[var(--ink-black)] hover:bg-[var(--ink-black)] hover:text-white'
            }`}
            aria-label="Étape suivante"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>

          {/* Indicateur de position */}
          <div className="flex justify-center mt-8 gap-3">
            {steps.map((_, i) => (
              <span
                key={i}
                className={`block h-px transition-all duration-500 ${
                  i === activeSlide ? 'w-8 bg-[var(--ink-black)]' : 'w-4 bg-[var(--border-light)]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 