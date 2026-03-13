'use client'

import Link from "next/link";
import { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";
import FirebaseImage from "@/components/common/FirebaseImage";

interface TeamCardProps {
  image: {
    src: string;
  };
  name: string;
  role: string;
  intro?: string;
  description?: string;
  socials: { link: string; icon: string; }[];
  additionalClassName?: string;
  isSlider?: boolean;
  onViewMore?: () => void;
}

const TeamCard = ({ image, name, role, intro, description, socials, additionalClassName, isSlider, onViewMore: _onViewMore }: TeamCardProps) => {
  const { t } = useLanguageStore()
  const [isExpanded, setIsExpanded] = useState(false)

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const shouldShowMoreButton = description && description.length > 120
  const displayDescription = shouldShowMoreButton && !isExpanded
    ? truncateText(description, 120)
    : description

  return (
    <div className={`group cursor-pointer ${isSlider ? 'h-full' : 'h-auto'} ${additionalClassName ?? ''}`}>
      {/* Image container — grayscale lifts to full color on hover */}
      <div className={`overflow-hidden bg-cardBackground grayscale group-hover:grayscale-0 transition-all duration-1000 ${isSlider ? 'aspect-[3/4] max-h-[480px]' : 'aspect-[3/4]'}`}>
        <FirebaseImage
          src={image.src}
          alt={name}
          className="w-full h-full"
          imgClassName="w-full h-full object-cover object-top"
          loading="lazy"
        />
      </div>

      {/* Gold rule */}
      <div className="flex justify-center mt-6">
        <span className="w-8 h-px bg-[#b89c72] block" />
      </div>

      {/* Identity block */}
      <div className="text-center mt-4">
        <p className="text-sm uppercase tracking-[0.3em] font-medium text-textColor">{name}</p>
        <p className="text-[10px] text-grayText uppercase tracking-widest mt-2 italic bricolage-grotesque">{role}</p>

        {intro && (
          <p className="mt-3 text-[11px] text-grayText leading-loose">{intro}</p>
        )}

        {description && (
          <div className="mt-3">
            <p className="text-[11px] text-grayText leading-loose">{displayDescription}</p>
            {shouldShowMoreButton && (
              <button
                onClick={() => setIsExpanded(prev => !prev)}
                className="mt-2 text-[10px] uppercase tracking-[0.2em] text-gold-accent hover:opacity-70 transition-opacity"
              >
                {isExpanded ? t('team.viewLess') : t('team.viewMore')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Social icons */}
      {socials.length > 0 && (
        <div className="flex justify-center mt-4 gap-4">
          {socials.map((social, index) => (
            <Link key={index} href={social.link} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={social.icon} alt="social" className="w-4 h-4 opacity-50 hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeamCard;
