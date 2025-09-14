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
    <Link href={`/blog/${post.id}`} className="bg-cardBackground rounded-lg overflow-hidden border border-white-800">
      <div className="relative h-[300px]">
        <Image 
          src={post.imageUrl} 
          alt={post.title}
          fill
          className="object-cover object-top"
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