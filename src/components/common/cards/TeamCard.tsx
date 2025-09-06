import Link from "next/link";
import { useState } from "react";
import { useLanguageStore } from "@/store/languageStore";

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

const TeamCard = ({ image, name, role, intro, description, socials, additionalClassName, isSlider, onViewMore }: TeamCardProps) => {
  const { t } = useLanguageStore()
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Fonction pour tronquer le texte
  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }
  
  // Déterminer si on doit afficher le bouton "Plus"
  const shouldShowMoreButton = description && description.length > 120
  const displayDescription = shouldShowMoreButton && !isExpanded 
    ? truncateText(description, 120) 
    : description
  return (
    <div className={`p-4 border rounded-lg bg-cardBackground bg-center ${isSlider ? 'h-full' : 'h-auto'}  ${additionalClassName ?? ''}`}>
      <div className={`bg-cover m-auto bg-no-repeat bg-top  w-full rounded-lg ${isSlider ? 'h-48 md:h-80' : 'h-80'}`} style={{ backgroundImage: ` url('${image.src}')` }} />
      <p className="mt-4 text-2xl font-semibold">{name}</p>
      <p className="mt-2 inter">{role}</p>
      {intro && (
        <p className="mt-2 text-sm text-gray-600">{intro}</p>
      )}
      {description && (
        <div className="mt-2">
          <p className="text-sm leading-relaxed">{displayDescription}</p>
          {shouldShowMoreButton && (
            <div className="mt-2 flex gap-2">
              {!isExpanded ? (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-purpleColor hover:text-purpleColor/80 text-sm font-medium transition-colors"
                >
                  {t('team.viewMore')}
                </button>
              ) : (
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-purpleColor hover:text-purpleColor/80 text-sm font-medium transition-colors"
                >
                  {t('team.viewLess')}
                </button>
              )}
              {/* {onViewMore && (
                <button
                  onClick={onViewMore}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors ml-2"
                >
                  {t('team.viewFullProfile')}
                </button>
              )} */}
            </div>
          )}
        </div>
      )}
      <div className="flex mt-4 gap-3">
        {socials.map((social, index) => (
          <Link key={index} href={social.link} target="_blank" rel="noopener noreferrer">
            <img src={social.icon} alt="social" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TeamCard;