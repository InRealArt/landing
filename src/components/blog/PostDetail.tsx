'use client'

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';
import { BlogPostDetail } from '@/types/blog';
import Button from '../common/Button';

interface PostDetailProps {
  post: BlogPostDetail;
}

export default function PostDetail({ post }: PostDetailProps) {
  const { t } = useLanguageStore();

  return (
    <div className="max-w-screen-lg mx-auto p-8">
      {/* Back button */}
      <div className="mb-8">
        <Button text={t('buttons.back')} additionalClassName="bg-purpleColor" icon={<ArrowLeft />} link="/blog" />
      </div>

      {/* Post header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime}</span>
        </div>

        <h1 className="text-4xl font-bold mb-6 bricolage-grotesque">{post.title}</h1>

        <div className="flex gap-2 mb-8">
          {post.tags.map((tag, index) => (
            <span key={index} className="px-4 py-1 border border-gray-700 rounded-full text-sm">
              {t(`blog.tags.${tag.toLowerCase()}`)}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
            {post.author.charAt(0)}
          </div>
          <div>
            <div className="font-medium">{post.author}</div>
            <div className="text-sm text-gray-400">{post.authorRole}</div>
          </div>
        </div>
      </div>

      {/* Featured image */}
      <div className="relative h-[400px] mb-12">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-lg"
          priority
        />
      </div>

      {/* Post content */}
      <div
        className="prose prose-invert max-w-none inter"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
} 