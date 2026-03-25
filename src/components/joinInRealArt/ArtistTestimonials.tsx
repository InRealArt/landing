'use client'

import { useLanguageStore } from '@/store/languageStore';
import TranslatedText from '@/components/common/TranslatedText';
import OptimizedBackgroundImage from '../common/OptimizedBackgroundImage';

interface TestimonialItem {
  text?: string;
  textKey?: string;
  classementIcac?: string;
  urlImageArtiste: string;
  name: string;
  role?: string;
}

// Composant pour un témoignage individuel avec gestion du HTML sanitisé
function TestimonialCard({ testimonial }: { testimonial: TestimonialItem }) {
  return (
    <div className="p-6 lg:p-8 rounded-xl bg-cardBackground h-full flex flex-col">
      {testimonial.textKey ? (
        <TranslatedText
          translationKey={testimonial.textKey}
          as="p"
          className="text-grayText text-sm lg:text-base leading-relaxed mb-6 flex-1 italic"
          allowHtml={false}
        />
      ) : (
        <TranslatedText
          content={testimonial.text}
          as="p"
          className="text-grayText text-sm lg:text-base leading-relaxed mb-6 flex-1"
          allowHtml={true}
        />
      )}
      <div className="flex items-center gap-3 mt-auto">
        <OptimizedBackgroundImage
          src={testimonial.urlImageArtiste}
          alt={testimonial.name}
          width={48}
          height={48}
          className="rounded-lg object-cover w-12 h-12 flex-shrink-0"
        />
        <div className="flex-1">
          <p className="text-textColor text-sm font-medium bricolage-grotesque">
            {testimonial.name}
          </p>
          {testimonial.role && (
            <p className="text-gold-accent text-xs mt-1 uppercase tracking-widest">
              {testimonial.role}
            </p>
          )}
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
  sectionLabelKey?: string;
  className?: string;
}

export default function ArtistTestimonials({
  testimonials,
  title,
  titleKey = 'joinInRealArt.artists.testimonials.title',
  sectionLabelKey,
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
    <section className={`w-full bg-backgroundGrey border-y border-borderColor py-24 lg:py-32 ${className}`}>
      <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4">
        <div className="mb-16 text-center">
          {sectionLabelKey && (
            <span className="block text-[10px] uppercase tracking-[0.5em] text-grayText mb-4">
              {t(sectionLabelKey)}
            </span>
          )}
          {title ? (
            <h2 className="text-5xl md:text-6xl serif italic text-textColor">
              {title}
            </h2>
          ) : (
            <TranslatedText
              translationKey={titleKey}
              as="h2"
              className="text-5xl md:text-6xl serif italic text-textColor"
              allowHtml={false}
            />
          )}
        </div>

        <div className={`grid ${getGridClasses(testimonials.length)} gap-6`}>
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
} 