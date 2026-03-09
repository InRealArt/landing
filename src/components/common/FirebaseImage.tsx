'use client'

import { useFirebaseImage } from '@/hooks/useFirebaseImage'
import FirebaseImageLoader from './FirebaseImageLoader'

interface FirebaseImageProps {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  loading?: 'lazy' | 'eager'
}

export default function FirebaseImage({
  src,
  alt,
  className,
  imgClassName,
  loading = 'lazy',
}: FirebaseImageProps) {
  const { src: imgSrc, status, onLoad, onError } = useFirebaseImage(src)

  return (
    <div className={`relative ${className ?? ''}`} style={{ isolation: 'isolate' }}>
      {status === 'retrying' && <FirebaseImageLoader />}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imgSrc}
        alt={alt}
        loading={loading}
        onLoad={onLoad}
        onError={onError}
        className={imgClassName ?? 'absolute inset-0 w-full h-full object-contain p-4 transition-opacity duration-500'}
        style={{ opacity: status === 'ready' ? 1 : 0 }}
      />
    </div>
  )
}
