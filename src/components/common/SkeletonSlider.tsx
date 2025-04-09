'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'
import { Autoplay, Pagination } from 'swiper/modules'
import TeamCardSkeleton from './cards/TeamCardSkeleton'

const SkeletonSlider = ({ context, additionnalClassName }: {
  context: 'artist' | 'artwork' | 'team',
  additionnalClassName?: string
}) => {
  // Créer un tableau de 4 éléments pour simuler le chargement
  const skeletonItems = Array(4).fill(null)

  const renderSkeletonCard = () => {
    switch (context) {
      case 'team':
        return <TeamCardSkeleton isSlider={true} />
      case 'artist':
      case 'artwork':
      default:
        // On pourrait créer d'autres types de skeleton si nécessaire
        return <div className="bg-gray-300 animate-pulse h-80 rounded-lg"></div>
    }
  }

  return (
    <section className={`${additionnalClassName} mt-12`}>
      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={10}
        slidesPerView={2}
        speed={800}
        centeredSlidesBounds
        centeredSlides
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
        {skeletonItems.map((_, index) => (
          <SwiperSlide key={`${context}-skeleton-slide-${index}`}>
            {renderSkeletonCard()}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}

export default SkeletonSlider 