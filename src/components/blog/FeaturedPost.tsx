'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';
import { BlogPost } from '@/types/blog';

export default function FeaturedPost() {
  const { t } = useLanguageStore();

  // Featured post data
  const featuredPost: BlogPost = {
    id: '1',
    date: '22 July 2024',
    readTime: '4 min',
    title: 'How Remote work drastically Improved my Design Skills',
    description: 'Remote work has drastically improved my design skills by giving me the freedom to experiment, focus, and learn at my own pace. Without the daily commute and office distractions, I found more time for deep, uninterrupted work, allowing me to refine my design techniques and creativity. Collaborating with a global team challenged me',
    tags: ['Design', 'Product', 'Frameworks'],
    imageUrl: '/images/blog-main.png'
  };

  return (
    <section className="mx-auto px-4 max-w-screen-xl">
      <div className="mb-16">
        <h2 className="text-xl font-medium italic mb-8">{t('blog.recentPosts')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
          <div className="relative h-[440px]">
            <Image
              className='rounded-lg'
              src={featuredPost.imageUrl}
              alt={featuredPost.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          <div className="p-8 flex flex-col justify-center rounded-lg bg-white">
            <div className="flex items-center gap-2 text-sm mb-3">
              <span>{featuredPost.date}</span>
              <span>•</span>
              <span>{featuredPost.readTime}</span>
            </div>

            <h3 className="text-2xl font-bold mb-3">{featuredPost.title}</h3>

            <p className="mb-6">{featuredPost.description}</p>

            <div className="flex gap-2 mb-6">
              {featuredPost.tags.map((tag, index) => (
                <span key={index} className="px-4 py-1 border rounded-full text-sm">
                  {t(`blog.tags.${tag.toLowerCase()}`)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 