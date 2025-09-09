'use client'

import { useTheme } from '@/contexts/ThemeContext'
import OptimizedBackgroundImage from "@/components/common/OptimizedBackgroundImage"
import HeroText from "@/components/common/HeroText"

interface HeroProps {
  backgroundImage: string
  alt?: string
  title: string
  subtitle: string
  titleClassName?: string
  subtitleClassName?: string
  className?: string
  contentAlignment?: 'center' | 'end' | 'start' | 'end-center' | 'start-center'
  contentContainerClassName?: string
}

export default function Hero({
  backgroundImage,
  alt = '',
  title,
  subtitle,
  titleClassName = "text-xl sm:text-2xl md:text-3xl lg:text-5xl xl:text-6xl mb-2 sm:mb-3 md:mb-4 leading-tight",
  subtitleClassName = "text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl leading-relaxed",
  className = "relative w-screen h-96 md:h-[550px] overflow-hidden ml-[calc(-50vw+50%)]",
  contentAlignment = 'center',
  contentContainerClassName = "max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12"
}: HeroProps) {
  const { theme } = useTheme()
  
  return (
    <section className={className}>
      <OptimizedBackgroundImage
        src={backgroundImage}
        alt={alt}
        width={1920}
        height={1080}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Dégradé du bas vers le background - plus transparent pour voir l'image */}
      <div className={`absolute inset-0 bg-gradient-to-t ${theme === 'light'
          ? 'bg-gradient-to-t from-white/80 via-white/20 to-transparent'
          : 'bg-gradient-to-t from-[rgb(19,19,19,0.8)] via-[rgb(19,19,19,0.3)] to-transparent'
        }`} />

      {/* Contenu du hero */}
      <div className={`absolute inset-0 z-20 flex ${
        contentAlignment === 'end-center' ? 'items-end sm:items-center' :
        contentAlignment === 'start-center' ? 'items-start sm:items-center' :
        `items-${contentAlignment}`
      }`}>
        <div className={contentContainerClassName}>
          <HeroText
            title={title}
            subtitle={subtitle}
            titleClassName={titleClassName}
            subtitleClassName={subtitleClassName}
          />
        </div>
      </div>
    </section>
  )
}
