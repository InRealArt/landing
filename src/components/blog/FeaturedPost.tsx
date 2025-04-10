'use client'

import Image from 'next/image';
import Link from 'next/link';
import { useLanguageStore } from '@/store/languageStore';
import { BlogPost } from '@/types/blog';
import { createArticle } from './WeeklyPosts';

export default function FeaturedPost() {
  const { t } = useLanguageStore();

  // Use the first article from weekly posts
  const featuredPost: BlogPost = createArticle(
    '1',
    'companyArtInvestment',
    '/images/blog/company-art-investment.png',
    ['Art', 'Investment', 'Business'],
    t
  );

  return (
    <section className="mx-auto px-4 max-w-screen-xl">
      <div className="mb-16">
        <h2 className="text-xl font-medium italic mb-8">{t('blog.recentPosts')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-black">
          <Link href={`/blog/${featuredPost.id}`} className="relative h-[440px] cursor-pointer overflow-hidden rounded-lg transition-transform hover:scale-[1.02] duration-300">
            <Image
              className='rounded-lg'
              src={featuredPost.imageUrl}
              alt={featuredPost.title}
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
          </Link>
          <Link href={`/blog/${featuredPost.id}`} className="p-8 flex flex-col justify-center rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors duration-300">
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
          </Link>
        </div>
      </div>
    </section>
  );
} 