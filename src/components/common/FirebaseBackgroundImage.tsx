'use client'

import { useFirebaseImage } from '@/hooks/useFirebaseImage'
import FirebaseImageLoader from './FirebaseImageLoader'
import { CSSProperties, ReactNode } from 'react'

interface FirebaseBackgroundImageProps {
  src: string
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

export default function FirebaseBackgroundImage({
  src,
  className,
  style,
  children,
}: FirebaseBackgroundImageProps) {
  const { src: imgSrc, status, onLoad, onError } = useFirebaseImage(src)

  return (
    <div className={`relative ${className ?? ''}`}>
      {status === 'retrying' && <FirebaseImageLoader />}

      {/* Image invisible utilisée uniquement pour déclencher onLoad/onError */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt=""
        aria-hidden="true"
        onLoad={onLoad}
        onError={onError}
        className="absolute w-0 h-0 opacity-0 pointer-events-none"
      />

      {/* Fond réel affiché uniquement quand l'image est prête */}
      <div
        className="absolute inset-0 transition-opacity duration-500 bg-cover bg-no-repeat bg-top"
        style={{
          ...style,
          backgroundImage: status === 'ready' ? `url('${imgSrc}')` : 'none',
          opacity: status === 'ready' ? 1 : 0,
        }}
        aria-hidden="true"
      />

      {/* Contenu enfant toujours visible par-dessus */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
