import type { FeaturedArtwork } from '@/types/featured-item'

type Props = {
  item: FeaturedArtwork
}

export default function ArtworkSlide({ item }: Props) {
  return (
    <article className="group flex flex-col h-full">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-backgroundGrey">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.title}
            fetchPriority="high"
            loading="eager"
            decoding="sync"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 bg-backgroundGrey" aria-hidden="true" />
        )}
      </div>

      {/* Content (mobile only) */}
      <div className="lg:hidden flex flex-col gap-3 p-6 flex-1">
        <p className="text-[10px] uppercase tracking-[0.35em] text-gold-accent montserrat">
          Œuvre à découvrir
        </p>
        <h3 className="serif text-2xl font-light text-textColor">
          {item.title}
        </h3>
        {item.price && (
          <p className="text-sm text-grayText">
            {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            }).format(item.price)}
          </p>
        )}
        <a
          href="#"
          className="inline-block mt-auto px-4 py-2 bg-gold-accent text-backgroundColor font-medium text-xs montserrat hover:bg-opacity-90 transition-all"
        >
          Voir l'œuvre
        </a>
      </div>
    </article>
  )
}
