'use client'

import { ReactNode } from 'react'
import TranslatedText from '@/components/common/TranslatedText'

interface HeroTextProps {
  title: string
  subtitle?: string
  children?: ReactNode
  className?: string
  titleClassName?: string
  subtitleClassName?: string
}

export default function HeroText({
  title,
  subtitle,
  children,
  className = '',
  titleClassName = '',
  subtitleClassName = ''
}: HeroTextProps) {
  return (
    <div className={`hero-text-container ${className}`}>
      <TranslatedText
        content={title}
        as="h1"
        className={`hero-title ${titleClassName}`}
        allowHtml={true}
      />
      {subtitle && (
        <TranslatedText
          content={subtitle}
          as="p"
          className={`hero-subtitle ${subtitleClassName}`}
          allowHtml={true}
        />
      )}
      {children}
    </div>
  )
}
