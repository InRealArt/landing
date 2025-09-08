'use client'

import { ReactNode } from 'react'

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
      <h1 className={`hero-title ${titleClassName}`}>
        {title}
      </h1>
      {subtitle && (
        <p className={`hero-subtitle ${subtitleClassName}`}>
          {subtitle}
        </p>
      )}
      {children}
    </div>
  )
}
