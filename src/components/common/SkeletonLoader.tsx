'use client'

import { ReactNode } from 'react'

// Animation de skeleton personnalisée
const shimmerAnimation = 'animate-shimmer'

// Styles CSS pour l'animation shimmer personnalisée
const shimmerStyles = `
  @keyframes shimmer {
    0% {
      background-position: -200px 0;
    }
    100% {
      background-position: calc(200px + 100%) 0;
    }
  }
  
  .animate-shimmer {
    background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
    background-size: 200px 100%;
    animation: shimmer 1.5s infinite;
  }
`

interface SkeletonLoaderProps {
  children: ReactNode
  className?: string
}

// Composant de base pour les skeletons
export function SkeletonBox({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '' 
}: { 
  width?: string
  height?: string
  className?: string 
}) {
  return (
    <div 
      className={`${width} ${height} bg-gray-600 rounded ${shimmerAnimation} ${className}`} 
    />
  )
}

// Composant de skeleton pour les cartes
export function SkeletonCard({ 
  children, 
  className = '' 
}: SkeletonLoaderProps) {
  return (
    <div className={`bg-gray-700/50 rounded-lg p-4 ${className}`}>
      {children}
    </div>
  )
}

// Composant de skeleton pour les images
export function SkeletonImage({ 
  width = 'w-full', 
  height = 'h-48', 
  className = '' 
}: { 
  width?: string
  height?: string
  className?: string 
}) {
  return (
    <div 
      className={`${width} ${height} bg-gray-600 rounded-lg ${shimmerAnimation} ${className}`} 
    />
  )
}

// Composant de skeleton pour les textes
export function SkeletonText({ 
  lines = 1, 
  className = '' 
}: { 
  lines?: number
  className?: string 
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonBox 
          key={index}
          width={index === lines - 1 ? 'w-3/4' : 'w-full'}
        />
      ))}
    </div>
  )
}

// Composant de skeleton pour les boutons
export function SkeletonButton({ 
  width = 'w-24', 
  height = 'h-10', 
  className = '' 
}: { 
  width?: string
  height?: string
  className?: string 
}) {
  return (
    <div 
      className={`${width} ${height} bg-gray-600 rounded ${shimmerAnimation} ${className}`} 
    />
  )
}

// Composant de skeleton pour les avatars
export function SkeletonAvatar({ 
  size = 'w-12 h-12', 
  className = '' 
}: { 
  size?: string
  className?: string 
}) {
  return (
    <div 
      className={`${size} bg-gray-600 rounded-full ${shimmerAnimation} ${className}`} 
    />
  )
}

// Composant principal de skeleton avec styles
export default function SkeletonLoader({ 
  children, 
  className = '' 
}: SkeletonLoaderProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: shimmerStyles }} />
      <div className={className}>
        {children}
      </div>
    </>
  )
}
