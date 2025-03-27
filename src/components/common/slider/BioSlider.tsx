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
}

export default function BioSlider({ items, title, hasArtistName }: BioSliderProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const swiperRef = useRef<any>(null);
  const leftDisabled: boolean = activeSlide <= 0;
  const rightDisabled: boolean = activeSlide >= items.length - 1;

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
        onSlideChange={(swiper) =>
          setActiveSlide(
            swiper.isEnd ? items.length - 1 : swiperRef.current.activeIndex
          )
        }
        slidesPerView={1}
        centeredSlidesBounds
        centeredSlides
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <div className='w-full rounded-lg h-auto lg:h-[30rem] flex flex-col lg:flex-row bg-cardBackground'>
              <div className='bg-cover bg-no-repeat bg-center h-96 lg:h-full w-full lg:w-1/3  rounded-lg' style={{ backgroundImage: ` url('${item.image.src}')` }} />
              <div className='p-6 lg:px-20 lg:py-24 flex-1 flex flex-col gap-6'>
                <h1 className='inter font-bold text-md md:text-lg text-white'>"{item.intro}"</h1>
                <h2 className='inter text-md font-medium'>{item.description}</h2>
                <div>
                  <p className='inter font-bold text-md text-white mb-2'>{item.name}</p>
                  <p className='inter text-md font-medium'>{item.role}</p>
                </div>
                <div className='flex self-end'>
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
