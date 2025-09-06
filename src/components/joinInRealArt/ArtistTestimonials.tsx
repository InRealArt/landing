'use client'

import { useLanguageStore } from '@/store/languageStore';
import OptimizedImage from '@/components/common/OptimizedImage';
import TranslatedText from '@/components/common/TranslatedText';

interface TestimonialItem {
  text: string;
  classementIcac?: string;
  urlImageArtiste: string;
  nomArtiste: string;
  prenomArtiste: string;
}

// Composant pour un témoignage individuel avec gestion du HTML sanitisé
function TestimonialCard({ testimonial }: { testimonial: TestimonialItem }) {
  return (
    <div className="p-6 lg:p-8 rounded-xl bg-cardBackground h-full flex flex-col">
      <TranslatedText 
        content={testimonial.text}
        as="p"
        className="text-grayText text-sm lg:text-base leading-relaxed mb-6 flex-1"
        allowHtml={true}
      />
      <div className="flex items-center gap-3 mt-auto">
        <OptimizedImage 
          src={testimonial.urlImageArtiste} 
          alt={`${testimonial.prenomArtiste} ${testimonial.nomArtiste}`} 
          width={48} 
          height={48} 
          className="rounded-lg object-cover w-12 h-12 flex-shrink-0" 
        />
        <div className="flex-1">
          <p className="text-textColor font-medium bricolage-grotesque">
            {testimonial.nomArtiste}
            {testimonial.prenomArtiste && (
              <>
                <br />
                {testimonial.prenomArtiste}
              </>
            )}
          </p>
          {testimonial.classementIcac && (
            <p className="text-grayText text-xs mt-1">
              Classement ICAC: {testimonial.classementIcac}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface ArtistTestimonialsProps {
  testimonials: TestimonialItem[];
  title?: string;
  titleKey?: string;
  className?: string;
}

export default function ArtistTestimonials({ 
  testimonials,
  title,
  titleKey = 'joinInRealArt.artists.testimonials.title',
  className = ''
}: ArtistTestimonialsProps) {
  const { t } = useLanguageStore();

  // Calculer les classes de grid en fonction du nombre de témoignages
  const getGridClasses = (count: number) => {
    if (count === 1) return 'grid-cols-1 max-w-md mx-auto'
    if (count === 2) return 'grid-cols-1 md:grid-cols-2'
    if (count === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    if (count === 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    // Pour 5 ou plus, on utilise un maximum de 3 colonnes sur desktop
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }

  return (
    <section className={`w-full max-w-90 xl:max-w-screen-xl m-auto mt-36 mb-20 ${className}`}>
      <div className="mb-12">
        {title ? (
          <h1 className="text-4xl md:text-5xl lg:text-6xl bricolage-grotesque font-medium text-textColor mb-6 text-center">
            {title}
          </h1>
        ) : (
          <TranslatedText 
            translationKey={titleKey}
            as="h1"
            className="text-4xl md:text-5xl lg:text-6xl bricolage-grotesque font-medium text-textColor mb-6 text-center"
            allowHtml={true}
          />
        )}
      </div>
      
      <div className={`grid ${getGridClasses(testimonials.length)} gap-6`}>
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
} 