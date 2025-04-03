'use client'
import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';
import { MoveLeft, MoveRight } from 'lucide-react';

interface TeamInfos {
  name: string;
  intro: string;
  description: string;
  role: string;
  image: { src: string };
}

interface BioSliderProps {
  title: string;
  items: TeamInfos[];
  hasArtistName?: boolean;
  onSlideChange?: (index: number) => void;
}

export default function BioSlider({ items, title, hasArtistName, onSlideChange }: BioSliderProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef<any>(null);
  const leftDisabled: boolean = activeSlide <= 0;
  const rightDisabled: boolean = activeSlide >= items.length - 1;

  const handleSlideChange = (index: number) => {
    setActiveSlide(index);
    if (onSlideChange) {
      onSlideChange(index);
    }
  };

  return (
    <>
      <h1 className='text-2xl lg:text-6xl bricolage-grotesque font-medium mb-6'>{title} {hasArtistName ? `${items[activeSlide].name} ?` : ''}</h1>
      <Swiper
        // autoplay={{ delay: 7000 }}
        modules={[Autoplay, Pagination]}
        ref={swiperRef}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        onSlideChange={(swiper) => {
          const index = swiper.isEnd ? items.length - 1 : swiper.activeIndex;
          handleSlideChange(index);
        }}
        slidesPerView={1}
        centeredSlidesBounds
        centeredSlides
      >
        {items.map(({intro, description, name, role, image}, index) => (
          <SwiperSlide key={index}>
            <div className='w-full rounded-lg h-full flex flex-col lg:flex-row bg-cardBackground'>
              <div className='bg-cover bg-no-repeat bg-center h-96 lg:h-auto w-full lg:w-2/5 rounded-l-lg' style={{ backgroundImage: ` url('${image.src}')` }} />
              <div className='p-6 lg:px-20 lg:pt-20 lg:pb-6 flex-1 flex flex-col gap-6'>
                {intro && <h1 className='inter font-bold text-base md:text-lg text-white'>&ldquo;{intro}&rdquo;</h1>}
                <h2 className='inter text-xs font-medium md:text-base'>{description}</h2>
                <div>
                  <p className='inter font-bold text-base text-white mb-2'>{name}</p>
                  <p className='inter text-base font-medium'>{role}</p>
                </div>
                <div className='flex self-end mt-auto'>
                  <MoveLeft className={`cursor-pointer w-14 h-14 mr-4 ${leftDisabled ? 'pointer-events-none text-[#a7a7a7]' : ''}`} onClick={() => swiperRef.current.slidePrev()} />
                  <MoveRight className={`cursor-pointer w-14 h-14 ${rightDisabled ? 'pointer-events-none text-[#a7a7a7]' : ''}`} onClick={() => swiperRef.current.slideNext()} />
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
