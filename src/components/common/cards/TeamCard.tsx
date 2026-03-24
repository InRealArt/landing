'use client'

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
  additionalClassName,
  isSlider,
  onViewMore,
}: TeamCardProps) => {
  return (
    <div
      className={`member-card group cursor-pointer ${isSlider ? 'h-full' : 'h-auto'} ${additionalClassName ?? ''}`}
      onClick={onViewMore}
      role={onViewMore ? 'button' : undefined}
      tabIndex={onViewMore ? 0 : undefined}
      onKeyDown={onViewMore ? (e) => { if (e.key === 'Enter' || e.key === ' ') onViewMore() } : undefined}
    >
      {/* Portrait — container grayscale lifts on hover, image zooms */}
      <div
        className={`member-container relative overflow-hidden bg-[#f8f8f8] mb-5 ${
          isSlider ? 'aspect-[3/4] max-h-[480px]' : 'aspect-[3/4]'
        }`}
        style={{
          filter: 'grayscale(100%)',
          transition: 'filter 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <FirebaseImage
          src={image.src}
          alt={name}
          className="w-full h-full"
          imgClassName="member-image w-full h-full object-cover object-top"
          loading="lazy"
        />
      </div>

      {/* Identity — rôle doré, nom serif italic */}
      <span className="text-[8px] uppercase tracking-[0.3em] text-[#b89c72] font-bold montserrat block">
        {role}
      </span>
      <h3 className="serif text-xl italic mt-1 text-textColor">{name}</h3>
    </div>
  );
}

export default TeamCard;
