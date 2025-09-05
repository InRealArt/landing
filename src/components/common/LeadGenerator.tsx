'use client'

import React from 'react'
import OptimizedContentImage from './OptimizedContentImage'
import Button from './Button'
import TranslatedText from './TranslatedText'
import { 
  ThumbsUp, 
  CheckCircle, 
  TrendingUp, 
  Zap, 
  Award, 
  Target, 
  Heart,
  Users,
  Sparkles,
  Badge
} from 'lucide-react'

// Enum des icônes disponibles pour attirer les leads
export enum LeadIconType {
  THUMBS_UP = 'thumbs-up',
  CHECK_CIRCLE = 'check-circle',
  TRENDING_UP = 'trending-up',
  ZAP = 'zap',
  AWARD = 'award',
  TARGET = 'target',
  HEART = 'heart',
  USERS = 'users',
  SPARKLES = 'sparkles',
  BADGE = 'badge'
}

// Mapping des icônes
const iconMap = {
  [LeadIconType.THUMBS_UP]: ThumbsUp,
  [LeadIconType.CHECK_CIRCLE]: CheckCircle,
  [LeadIconType.TRENDING_UP]: TrendingUp,
  [LeadIconType.ZAP]: Zap,
  [LeadIconType.AWARD]: Award,
  [LeadIconType.TARGET]: Target,
  [LeadIconType.HEART]: Heart,
  [LeadIconType.USERS]: Users,
  [LeadIconType.SPARKLES]: Sparkles,
  [LeadIconType.BADGE]: Badge
}

interface LeadGeneratorProps {
  image?: string
  imageWidth?: number
  imageHeight?: number
  title?: string
  description?: string
  className?: string
  titleKey?: string
  descriptionKey?: string
  buttonTextKey?: string
  buttonLink?: string
  onCtaClick?: () => void
  iconType?: LeadIconType
  iconColor?: string
}

const LeadGenerator = ({
  image,
  imageWidth = 80,
  imageHeight = 80,
  title,
  description,
  className = '',
  titleKey,
  descriptionKey,
  buttonTextKey = 'leadGenerator.cta',
  buttonLink,
  onCtaClick,
  iconType = LeadIconType.THUMBS_UP,
  iconColor = 'text-green-400',
}: LeadGeneratorProps) => {
  // Récupération de l'icône selon le type choisi
  const IconComponent = iconMap[iconType]

  return (
    <div className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 md:p-8 mx-auto max-w-2xl relative ${className}`}>
      {/* Image en haut à gauche - Style TrustPilot */}
      {image && (
        <div className="absolute top-3 left-3 z-20 w-12 h-12">
          <OptimizedContentImage
            src={image}
            alt={title || (titleKey ? titleKey : 'Lead Generator')}
            width={48}
            height={48}
            className="w-full h-full object-cover rounded-full border-2 border-white/30 shadow-lg"
            priority={false}
            quality={90}
          />
        </div>
      )}

      {/* Contenu textuel */}
      <div className={`text-center md:text-left ${image ? 'pt-16 pl-16' : ''} pr-20 pb-20`}>
        <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 bricolage-grotesque">
          {title ? (
            title
          ) : titleKey ? (
            <TranslatedText 
              translationKey={titleKey}
              as="span"
            />
          ) : (
            <TranslatedText 
              translationKey="leadGenerator.defaultTitle"
              as="span"
              allowHtml={true}
            />
          )}
        </h2>
        <p className="text-white/80 text-sm md:text-base leading-relaxed">
          {description ? (
            description
          ) : descriptionKey ? (
            <TranslatedText 
              translationKey={descriptionKey}
              as="span"
              allowHtml={true}
            />
          ) : (
            <TranslatedText 
              translationKey="leadGenerator.defaultDescription"
              as="span"
              allowHtml={true}
            />
          )}
        </p>
        
        {/* Call to Action - Optionnel */}
        {(buttonLink || onCtaClick) && (
          <div className="flex justify-center md:justify-start mt-4">
            <Button
              text={buttonTextKey || 'Action'}
              additionalClassName="bg-purple-600 hover:bg-purple-700 text-white border-purple-600 hover:border-purple-700 transition-all duration-300 rounded-full px-6 py-2 text-sm font-medium"
              link={buttonLink}
              action={onCtaClick}
            />
          </div>
        )}
      </div>

      {/* Indicateur d'attraction (icône paramétrable) - En bas à droite */}
      <div className="absolute bottom-4 right-4 flex flex-col items-center">
        <div className="mb-1 p-1.5 bg-white/20 rounded-full">
          <IconComponent 
            className={`w-5 h-5 ${iconColor}`}
          />
        </div>
        <span className="text-white/70 text-xs font-medium">
          <TranslatedText 
            translationKey="leadGenerator.trustIndicator"
            as="span"
            allowHtml={true}
          />
        </span>
      </div>
    </div>
  )
}

export default LeadGenerator
