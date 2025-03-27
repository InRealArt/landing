'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Pagination } from 'swiper/modules';

import ArtworkCard from "../common/cards/ArtworkCard";
import TeamCard from '../common/cards/TeamCard';

interface ArtworkCardInfos {
  name: string;
  image: {
    src: string;
  };
}

interface TeamCardInfos {
  name: string;
  image: {
    src: string;
  };
  role: string;
  socials: { link: string; icon: string; }[];
}
const Slider = ({ context, items, isReverse, additionnalClassName }: {
  context: 'artist' | 'artwork' | 'team',
  items: (ArtworkCardInfos | TeamCardInfos)[],
  isReverse?: boolean,
  additionnalClassName?: string
}) => {

  const renderCard = ({ infos }: { infos: ArtworkCardInfos | TeamCardInfos }) => {
    switch (context) {
      case 'artist':
      case 'artwork':
        return <ArtworkCard name={infos.name} image={infos.image} />
      case 'team':
        return <TeamCard name={infos.name} image={infos.image} role={(infos as TeamCardInfos).role} socials={(infos as TeamCardInfos).socials} />
      default:
        return null;
    }
  }

  return (
    <section className={`${additionnalClassName} mt-12`}>
      <Swiper
        autoplay={{ delay: 2000, reverseDirection: isReverse }}
        modules={[Autoplay, Pagination]}
        spaceBetween={10}
        slidesPerView={2}
        scrollbar={{ draggable: true }}
        initialSlide={Math.floor(items.length / 2)}
        centeredSlidesBounds
        centeredSlides
        loop
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
          1023: {
            slidesPerView: 3,
          },
          1279: {
            slidesPerView: 4,
          },
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            {renderCard({ infos: item })}
          </SwiperSlide>
        ))}
      </Swiper>
    </section >
  );
}

export default Slider;