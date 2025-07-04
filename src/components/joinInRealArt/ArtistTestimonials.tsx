'use client'

import { useLanguageStore } from '@/store/languageStore';
import Image from 'next/image';
import { ArtistData } from '@/actions/artistActions';

interface ArtistTestimonialsProps {
  artists: ArtistData[]
}

export default function ArtistTestimonials({ artists }: ArtistTestimonialsProps) {
  const { t } = useLanguageStore();

  // Mapper les artistes aux testimonials
  const getTestimonialKey = (artist: ArtistData): string => {
    const fullName = `${artist.name} ${artist.surname}`.toLowerCase();
    if (fullName.includes('marc') && fullName.includes('peltzer')) return 'artist1';
    if (fullName.includes('nadine') && (fullName.includes('leprince') || fullName.includes('le prince'))) return 'artist2';
    if (fullName.includes('ekaterina')) return 'artist3';
    return 'artist1'; // fallback
  };

  const testimonials = artists.map(artist => {
    const key = getTestimonialKey(artist);
    return {
      key,
      name: artist.name,
      surname: artist.surname,
      image: artist.imageUrl,
      testimonial: t(`joinInRealArt.artists.testimonials.${key}.text`)
    };
  });

  // S'assurer que nous avons les 3 témoignages dans le bon ordre
  const orderedTestimonials = [
    {
      key: 'artist1',
      name: 'Marc',
      surname: 'Peltzer',
      image: '/images/team-member.png',
      testimonial: t('joinInRealArt.artists.testimonials.artist1.text')
    },
    {
      key: 'artist2',
      name: 'Nadine',
      surname: 'LePrince',
      image: '/images/team-member.png',
      testimonial: t('joinInRealArt.artists.testimonials.artist2.text')
    },
    {
      key: 'artist3',
      name: 'Ekaterina',
      surname: '',
      image: '/images/team-member.png',
      testimonial: t('joinInRealArt.artists.testimonials.artist3.text')
    }
  ];

  // Créer un tableau ordonné en utilisant les données des artistes quand disponibles
  const finalTestimonials = orderedTestimonials.map(defaultTestimonial => {
    const artistData = testimonials.find(t => t.key === defaultTestimonial.key);
    return artistData || defaultTestimonial;
  });

  return (
    <section className="w-full max-w-90 xl:max-w-screen-xl m-auto mt-36 mb-20">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl lg:text-6xl bricolage-grotesque font-medium text-white mb-6 text-center">
          {t('joinInRealArt.artists.testimonials.title')}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {finalTestimonials.map((testimonial, index) => (
          <div key={testimonial.key} className="p-6 lg:p-8 rounded-xl bg-cardBackground h-full flex flex-col">
            <p className="text-gray-300 text-sm lg:text-base leading-relaxed mb-6 flex-1">
              {testimonial.testimonial}
            </p>
            <div className="flex items-center gap-3 mt-auto">
              <Image 
                src={testimonial.image} 
                alt={testimonial.name} 
                width={48} 
                height={48} 
                className="rounded-lg object-cover w-12 h-12 flex-shrink-0" 
              />
              <div>
                <p className="text-white font-medium bricolage-grotesque">
                  {testimonial.surname}
                  {testimonial.name && (
                    <>
                      <br />
                      {testimonial.name}
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 