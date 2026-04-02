'use client'

import { useTranslation } from '@/hooks/useTranslation';
import OptimizedImage from '@/components/common/OptimizedImage';
import Button from '@/components/common/Button';
import { Phone } from 'lucide-react';
import { EXTERNAL_URLS } from '@/constants/constants';

export default function ForWho() {
  const { t } = useTranslation();
  
  // Get the translation strings directly
  const whyChooseTitle = t('lending.whyChoose.title');
  const forWhoTitle = t('lending.forWho.title');
  
  // Get the items arrays
  const whyChooseItems = [
    t('lending.whyChoose.items.0'),
    t('lending.whyChoose.items.1'),
    t('lending.whyChoose.items.2')
  ];
  
  const forWhoItems = [
    t('lending.forWho.items.0'),
    t('lending.forWho.items.1'),
    t('lending.forWho.items.2')
  ];

  return (
    <section className="py-32 px-10 bg-[var(--canvas-bg)] border-t border-[var(--border-light)]">
      <div className="max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">

          {/* Text column */}
          <div data-anim="lending-forwho-text">
            <span className="section-number">Profils</span>
            <h2 className="text-5xl md:text-6xl serif italic leading-tight mb-8 text-[var(--gold-accent)]">
              {whyChooseTitle}
            </h2>
            <ul className="divide-y divide-[var(--border-light)] mb-14">
              {whyChooseItems.map((item, index) => (
                <li key={index} className="flex items-start gap-6 py-4">
                  <span className="serif italic text-xl text-[var(--gold-accent)] shrink-0">—</span>
                  <p className="text-[12px] text-[var(--gray-text)] leading-loose">{item}</p>
                </li>
              ))}
            </ul>

            <h2 className="text-5xl md:text-6xl serif italic leading-tight mb-8">
              {forWhoTitle}
            </h2>
            <ul className="divide-y divide-[var(--border-light)] mb-10">
              {forWhoItems.map((item, index) => (
                <li key={index} className="flex items-start gap-6 py-4">
                  <span className="serif italic text-xl text-[var(--gold-accent)] shrink-0">—</span>
                  <p className="text-[12px] text-[var(--gray-text)] leading-loose">{item}</p>
                </li>
              ))}
            </ul>

            <Button
              text={t('contact.scheduleMeeting')}
              additionalClassName="bg-purpleColor"
              icon={<Phone size={12} />}
              target="_blank"
              link={EXTERNAL_URLS.CALENDLY_MEETING}
              data-umami-event="calendly-lending-forwho-click"
            />
          </div>

          {/* Image column */}
          <div data-anim="lending-forwho-img" className="border border-[var(--border-light)] overflow-hidden md:sticky md:top-32">
            <OptimizedImage
              src="/images/usecase/lending/aberwrach.webp"
              alt="Pour qui ?"
              className="w-full [&_img]:w-full [&_img]:h-auto [&_img]:object-cover"
              width={500}
              height={530}
            />
          </div>

        </div>
      </div>
    </section>
  );
} 