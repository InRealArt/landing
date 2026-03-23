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
      data-anim="blog-card"
      className="group block bg-[var(--canvas-bg)] border border-[var(--border-light)] overflow-hidden hover:bg-[var(--soft-gray)] transition-colors duration-500"
    >
      <div className="h-[260px] overflow-hidden border-b border-[var(--border-light)]">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 border border-[var(--border-light)] text-[9px] uppercase tracking-[0.15em] text-[var(--gray-text)] bg-transparent"
            >
              {getTagName(tag)}
            </span>
          ))}
        </div>

        <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--gray-text)] mb-3">
          <span>{post.date}</span>
          <span className="mx-2 text-[var(--gold-accent)]">—</span>
          <span>{post.readTime}</span>
        </div>

        <h3 className="serif italic text-xl leading-snug mb-3 text-[var(--ink-black)]">{post.title}</h3>

        <p className="text-[12px] text-[var(--gray-text)] leading-loose line-clamp-3">{post.description}</p>
      </div>
    </Link>
  );
} 