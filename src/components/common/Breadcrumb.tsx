import Link from 'next/link'
import { useLanguageStore } from '@/store/languageStore'

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
  icon?: React.ReactNode
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  showIcons?: boolean
}

// Icônes SVG
const HomeIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
  </svg>
)

const BlogIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
)

const ChevronIcon = () => (
  <svg 
    className="w-4 h-4 text-gray-400" 
    fill="currentColor" 
    viewBox="0 0 20 20"
    aria-hidden="true"
  >
    <path 
      fillRule="evenodd" 
      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
      clipRule="evenodd" 
    />
  </svg>
)

export default function Breadcrumb({ items, className = '', showIcons = false }: BreadcrumbProps) {
  return (
    <nav className={`text-sm ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <div className="mr-2">
                <ChevronIcon />
              </div>
            )}
            
            {item.href && !item.current ? (
              <Link 
                href={item.href} 
                className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
              >
                {showIcons && item.icon && <span>{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            ) : (
              <div 
                className={`${item.current ? 'text-white' : 'text-gray-400'} flex items-center space-x-1`}
                title={item.current ? item.label : undefined}
                aria-current={item.current ? 'page' : undefined}
              >
                {showIcons && item.icon && <span>{item.icon}</span>}
                <span className="truncate max-w-[15rem] md:max-w-[35rem]">{item.label}</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Composant spécialisé pour les articles de blog
interface BlogBreadcrumbProps {
  postTitle: string
  className?: string
  showIcons?: boolean
}

export function BlogBreadcrumb({ postTitle, className, showIcons = false }: BlogBreadcrumbProps) {
  const { t } = useLanguageStore()
  
  const items: BreadcrumbItem[] = [
    { 
      label: t('nav.home'), 
      href: '/', 
      icon: showIcons ? <HomeIcon /> : undefined 
    },
    { 
      label: 'Blog', 
      href: '/blog',
      icon: showIcons ? <BlogIcon /> : undefined
    },
    { 
      label: postTitle, 
      current: true 
    }
  ]

  return <Breadcrumb items={items} className={className} showIcons={showIcons} />
} 