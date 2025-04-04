'use client'

import { useLanguageStore } from '@/store/languageStore';
import BlogPostCard from '@/components/common/BlogPostCard';
import { BlogPost } from '@/types/blog';

export default function WeeklyPosts() {
  const { t } = useLanguageStore();
  
  // Weekly posts data
  const weeklyPosts: BlogPost[] = [
    {
      id: '2',
      date: '22 July 2024',
      readTime: '4 min',
      title: 'Our SaaS Product Just Launched!',
      description: 'Remote work has drastically improved my design skills by giving me the freedom to experiment, focus, and learn at my own pace.',
      tags: ['Design', 'Product'],
      imageUrl: '/images/blog-second.png'
    },
    {
      id: '3',
      date: '22 July 2024',
      readTime: '4 min',
      title: 'Our SaaS Product Just Launched!',
      description: 'Remote work has drastically improved my design skills by giving me the freedom to experiment, focus, and learn at my own pace.',
      tags: ['Design', 'Product'],
      imageUrl: '/images/blog-second.png'
    },
    {
      id: '4',
      date: '22 July 2024',
      readTime: '4 min',
      title: 'Our SaaS Product Just Launched!',
      description: 'Remote work has drastically improved my design skills by giving me the freedom to experiment, focus, and learn at my own pace.',
      tags: ['Design', 'Product'],
      imageUrl: '/images/blog-second.png'
    }
  ];

  return (
    <section className="mx-auto px-4 max-w-screen-xl pb-20">
      <div>
        <h2 className="text-xl font-medium italic mb-8 flex items-center">
          {t('blog.weeklyRead')} <span className="ml-2">🔥</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {weeklyPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
} 