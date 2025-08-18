import { ReactNode } from 'react'

interface ArtistCategoryLayoutProps {
  children: ReactNode
}

export default function ArtistCategoryLayout({ children }: ArtistCategoryLayoutProps) {
  return <>{children}</>
}
