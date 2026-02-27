'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';
import { BlogPost } from '@/types/blog';
import { useTheme } from '@/contexts/ThemeContext';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const { t } = useLanguageStore();

  // Fonction pour obtenir le nom du tag avec fallback
  const getTagName = (tag: string) => {
    const translationKey = `blog.tags.${tag.toLowerCase()}`
    const translatedTag = t(translationKey)
    
    // Si la traduction retourne la clé (pas de traduction trouvée), utiliser le tag original
    return translatedTag === translationKey ? tag : translatedTag
  }

  const { theme } = useTheme();

  const color = theme === 'light' ? 'black' : 'white';
  return (
    <Link
      href={`/blog/${post.id}`}
      className="group block bg-cardBackground rounded-lg overflow-hidden border border-white/10
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] hover:border-white/20
        active:translate-y-0 active:scale-[0.98] active:shadow-none active:duration-75"
    >
      <div className="relative h-[300px] overflow-hidden">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-contain transition-transform duration-500 ease-out group-hover:scale-105 group-active:scale-100"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 4).map((tag, index) => (
            <span key={index} className={`px-3 py-1 bg-transparent rounded-full text-xs text-${color} border border-${color}`}>
              {getTagName(tag)}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-[#4F4F4F] mb-3">
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>

        <h3 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>

        <p className="text-sm line-clamp-4">{post.description}</p>
      </div>
    </Link>
  );
} 