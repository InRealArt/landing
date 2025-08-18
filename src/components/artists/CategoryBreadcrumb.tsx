'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import { useLanguageStore } from '@/store/languageStore'

interface CategoryBreadcrumbProps {
  categoryName: string
}

export default function CategoryBreadcrumb({ categoryName }: CategoryBreadcrumbProps) {
  const { t } = useLanguageStore()

  return (
    <nav className="flex items-center space-x-2 text-sm text-white/60 mb-8">
      <Link
        href="/"
        className="flex items-center hover:text-white transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      <ChevronRight className="w-4 h-4" />
      
      <Link
        href="/artists"
        className="hover:text-white transition-colors"
      >
        {t('artists.title') || 'Artistes'}
      </Link>
      
      <ChevronRight className="w-4 h-4" />
      
      <Link
        href="/artists"
        className="hover:text-white transition-colors"
      >
        {t('artists.categories.title') || 'Catégories'}
      </Link>
      
      <ChevronRight className="w-4 h-4" />
      
      <span className="text-white font-medium">
        {categoryName}
      </span>
    </nav>
  )
}
