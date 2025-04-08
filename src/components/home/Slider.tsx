'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Autoplay, Pagination } from 'swiper/modules';
import { useEffect, useState } from 'react';

import ArtworkCard from "../common/cards/ArtworkCard";
import TeamCard from '../common/cards/TeamCard';

interface ArtworkCardInfos {
  name: string;
  image: {
    src: string;
  };
  slug?: string;
}

interface TeamCardInfos {
  name: string;
  image: {
    src: string;
  };
  role: string;
  socials: { link: string; icon: string; }[];
  slug?: string;
}
const Slider = ({ context, items, isReverse, additionnalClassName, onItemClick }: {
  context: 'artist' | 'artwork' | 'team',
  items: (ArtworkCardInfos | TeamCardInfos)[],
  isReverse?: boolean,
  additionnalClassName?: string,
  onItemClick?: (slug: string) => void
}) => {
  const [mounted, setMounted] = useState(false);

  // Assurer que le composant est monté côté client
  useEffect(() => {
    setMounted(true);
  }, []);

  const renderCard = ({ infos }: { infos: ArtworkCardInfos | TeamCardInfos }) => {
    const handleClick = () => {
      if (onItemClick && infos.slug) {
        onItemClick(infos.slug);
      }
    };

    switch (context) {
      case 'artist':
      case 'artwork':
        return <div onClick={handleClick} className={onItemClick ? 'cursor-pointer' : ''}>
          <ArtworkCard name={infos.name} image={infos.image} />
        </div>
      case 'team':
        return <TeamCard name={infos.name} image={infos.image} role={(infos as TeamCardInfos).role} socials={(infos as TeamCardInfos).socials} isSlider={true} />
      default:
        return null;
    }
  }

  // Si le composant n'est pas encore monté, ne pas afficher le slider
  if (!mounted) {
    return <div className="h-40"></div>;
  }

  // Log pour déboguer
  console.log(`Slider ${context} items:`, items);
  console.log(`Slider modules:`, [Autoplay, Pagination]);

  return (
    <section className={`${additionnalClassName} mt-12`}>
      <Swiper
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
          reverseDirection: isReverse
        }}
        modules={[Autoplay, Pagination]}
        spaceBetween={10}
        slidesPerView={2}
        speed={800}
        scrollbar={{ draggable: true }}
        initialSlide={Math.floor(items.length / 2)}
        centeredSlidesBounds
        centeredSlides
        loop={true}
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
          <SwiperSlide key={`${context}-slide-${index}`}>
            {renderCard({ infos: item })}
          </SwiperSlide>
        ))}
      </Swiper>
    </section >
  );
}

export default Slider;