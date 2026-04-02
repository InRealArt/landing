'use client'

import Link from 'next/link'
import OptimizedContentImage from '@/components/common/OptimizedContentImage'
import { useTranslation } from '@/hooks/useTranslation'

interface CardData {
  tag: string
  titleBefore: string
  titleItalic: string
  titleAfter: string
  description: string
  cta: string
  image: string
  imageAlt: string
  link: string
  featured: boolean
}

export default function DescriptionsBlock() {
  const { t } = useTranslation()

  const cards: CardData[] = [
    {
      tag: t('joinInRealArt.cards.artists.tag'),
      titleBefore: t('joinInRealArt.cards.artists.title') + ' ',
      titleItalic: t('joinInRealArt.cards.artists.titleItalic'),
      titleAfter: ' ' + t('joinInRealArt.cards.artists.titleSuffix'),
      description: t('joinInRealArt.cards.artists.description'),
      cta: t('joinInRealArt.cards.artists.cta'),
      image: '/images/joinInRealArt/hero_joinInRealArt.webp',
      imageAlt: t('joinInRealArt.cards.artists.titleItalic'),
      link: '/joinInRealArt/artists',
      featured: false,
    },
    {
      tag: 'Partenariat galeries',
      titleBefore: 'Vous êtes une ',
      titleItalic: 'galerie',
      titleAfter: '',
      description:
        'InRealArt vous soutient dans la réalisation de vos projets créatifs les plus audacieux, en collaboration avec des artistes de renom. Que vous souhaitiez valoriser votre espace ou dénicher l\u2019œuvre idéale pour un client, nous sommes à vos côtés pour concrétiser vos aspirations.',
      cta: 'Découvrir l\u2019offre galeries',
      image: '/images/joinInRealArt/joinInRealArt_desc3.webp',
      imageAlt: 'galerie',
      link: '/joinInRealArt/galleries',
      featured: false,
    },
  ]

  return (
    <section className="pb-16 md:pb-24 lg:pb-40 px-4 sm:px-6 lg:px-10">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {cards.map((card) => (
            <JoinCard key={card.link + card.tag} card={card} />
          ))}
        </div>
      </div>
    </section>
  )
}

function JoinCard({ card }: { card: CardData }) {
  const { featured } = card

  return (
    <div
      className={[
        'group flex flex-col justify-between transition-all duration-500 p-6 sm:p-8 lg:p-10 xl:p-12',
        featured
          ? 'bg-black text-white border border-black'
          : 'bg-cardBackground border border-[#eeeeee] hover:-translate-y-1 hover:border-[#b89c72]',
      ].join(' ')}
    >
      <div>
        {/* Tag */}
        <span className="text-[#b89c72] text-[9px] uppercase tracking-[0.4em] mb-8 block font-[family-name:var(--font-montserrat)]">
          {card.tag}
        </span>

        {/* Image — no explicit width/height: OptimizedContentImage uses fill mode */}
        <div className="aspect-[4/3] mb-10 overflow-hidden bg-gray-50 relative">
          <OptimizedContentImage
            src={card.image}
            alt={card.imageAlt}
            className="object-cover transition-transform duration-[1500ms] group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            isDecorative={false}
          />
        </div>

        {/* Title */}
        <h2
          className={[
            'text-2xl sm:text-3xl lg:text-3xl xl:text-4xl mb-6 font-[family-name:var(--font-cormorant)] font-light',
            featured ? 'text-white' : 'text-textColor',
          ].join(' ')}
        >
          {card.titleBefore}
          <span className="italic">{card.titleItalic}</span>
          {card.titleAfter}
        </h2>

        {/* Description */}
        <p
          className={[
            'text-[13px] leading-relaxed font-light mb-12 font-[family-name:var(--font-montserrat)]',
            featured ? 'text-gray-400' : 'text-grayText',
          ].join(' ')}
        >
          {card.description}
        </p>
      </div>

      {/* CTA */}
      <Link
        href={card.link}
        className={[
          'text-[10px] uppercase tracking-[0.3em] border-b pb-1 inline-block self-start transition-all duration-300 min-h-[44px] flex items-end',
          featured
            ? 'text-[#b89c72] border-[#b89c72] hover:text-white hover:border-white'
            : 'text-textColor border-textColor hover:text-[#b89c72] hover:border-[#b89c72]',
        ].join(' ')}
      >
        {card.cta} →
      </Link>
    </div>
  )
}
