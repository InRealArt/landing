'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { BlogPost } from '@/types/blog';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const { t } = useTranslation();

  // Catégorie principale = premier tag disponible
  const primaryTag = post.tags[0] ?? null;
  const tagKey = primaryTag ? `blog.tags.${primaryTag.toLowerCase()}` : null;
  const tagLabel = tagKey
    ? (t(tagKey) === tagKey ? primaryTag : t(tagKey))
    : null;

  return (
    <Link
      href={`/blog/${post.id}`}
      data-anim="blog-card"
      className="group block p-6 bg-[var(--canvas-bg)] shadow-[0_1px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:bg-[var(--soft-gray)] transition-all duration-500"
    >
      <div className="flex gap-6">
        {/* Image portrait gauche — 1/3 largeur, ratio 3/4, grayscale */}
        <div className="w-1/3 shrink-0 relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 17vw, 12vw"
          />
        </div>

        {/* Contenu droite */}
        <div className="w-2/3 flex flex-col justify-between">
          <div>
            <h3 className="unbounded text-base font-bold leading-snug mb-2 text-[var(--ink-black)]">
              {post.title}
            </h3>

            {tagLabel && (
              <p className="text-xs uppercase text-[#b89c72] font-bold mb-3 tracking-tighter">
                {tagLabel}
              </p>
            )}

            <p className="text-xs text-[var(--gray-text)] leading-relaxed line-clamp-4">
              {post.description}
            </p>
          </div>

          <div className="mt-4">
            <span className="inline-block border-b border-[var(--ink-black)] text-[0.7rem] uppercase tracking-[0.15em] font-semibold text-[var(--ink-black)] transition-colors duration-300 group-hover:text-[#b89c72] group-hover:border-[#b89c72]">
              {t('blog.readMore')}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
} 