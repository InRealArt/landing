'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';
import { BlogPost } from '@/types/blog';

interface BlogPostCardProps {
  post: BlogPost;
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  const { t } = useLanguageStore();

  return (
    <Link href={`/blog/${post.id}`} className="bg-cardBackground rounded-lg overflow-hidden border border-white-800">
      <div className="relative h-[240px]">
        <Image 
          src={post.imageUrl} 
          alt={post.title}
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-transparent rounded-full text-xs text-[#828282] border border-[#828282]">
              {t(`blog.tags.${tag.toLowerCase()}`)}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-[#4F4F4F] mb-3">
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>
        
        <h3 className="text-xl font-bold mb-3">{post.title}</h3>
        
        <p className="text-sm">{post.description}</p>
      </div>
    </Link>
  );
} 