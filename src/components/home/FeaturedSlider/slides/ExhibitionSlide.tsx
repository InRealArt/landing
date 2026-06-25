import type { FeaturedExhibition } from '@/types/featured-item'

type Props = {
  item: FeaturedExhibition
}

export default function ExhibitionSlide({ item }: Props) {
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
          Exposition en avant
        </p>
        <h3 className="serif text-2xl font-light text-textColor">
          {item.title}
        </h3>
        {item.location && (
          <p className="text-sm text-grayText">{item.location}</p>
        )}
        <p className="text-xs text-grayText/60">
          {new Date(item.startDate).toLocaleDateString()} —{' '}
          {new Date(item.endDate).toLocaleDateString()}
        </p>
      </div>
    </article>
  )
}
