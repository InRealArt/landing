'use client'

import Link from "next/link";
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

const TeamCard = ({
  image,
  name,
  role,
  intro,
  socials,
  additionalClassName,
  isSlider,
  onViewMore,
}: TeamCardProps) => {
  const { t } = useLanguageStore()

  return (
    <div
      className={`group cursor-pointer ${isSlider ? 'h-full' : 'h-auto'} ${additionalClassName ?? ''}`}
      onClick={onViewMore}
      role={onViewMore ? 'button' : undefined}
      tabIndex={onViewMore ? 0 : undefined}
      onKeyDown={onViewMore ? (e) => { if (e.key === 'Enter' || e.key === ' ') onViewMore() } : undefined}
    >
      {/* Portrait — grayscale lifts to full colour on hover */}
      <div
        className={`overflow-hidden bg-[#f8f8f8] grayscale group-hover:grayscale-0 transition-all duration-1000 ${
          isSlider ? 'aspect-[3/4] max-h-[480px]' : 'aspect-[3/4]'
        }`}
      >
        <FirebaseImage
          src={image.src}
          alt={name}
          className="w-full h-full"
          imgClassName="w-full h-full object-cover object-top transition-transform duration-[1200ms] cubic-bezier(0.16,1,0.3,1) group-hover:scale-[1.03]"
          loading="lazy"
        />
      </div>

      {/* Identity block */}
      <div className="text-center mt-6">
        {/* Gold rule */}
        <span className="w-8 h-px bg-[#b89c72] block mx-auto mb-5" />

        <p className="text-sm uppercase tracking-[0.3em] font-medium text-textColor montserrat">{name}</p>
        <p className="text-[10px] text-grayText uppercase tracking-widest mt-2 italic serif">{role}</p>

        {intro && (
          <p className="mt-4 text-[11px] text-grayText leading-loose montserrat line-clamp-3">{intro}</p>
        )}

        {/* View more link */}
        {onViewMore && (
          <span className="mt-5 inline-block text-[9px] uppercase tracking-[0.35em] border-b border-textColor/40 pb-px text-textColor/70 hover:text-textColor hover:border-textColor transition-colors montserrat">
            {t('team.viewMore')} →
          </span>
        )}
      </div>

      {/* Social icons */}
      {socials.length > 0 && (
        <div className="flex justify-center mt-5 gap-4">
          {socials.map((social, index) => (
            <Link
              key={index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label="social link"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={social.icon}
                alt="social"
                className="w-4 h-4 opacity-40 hover:opacity-100 transition-opacity"
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default TeamCard;
