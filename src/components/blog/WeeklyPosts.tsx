'use client'

import { useLanguageStore } from '@/store/languageStore';
import BlogPostCard from '@/components/common/BlogPostCard';
import { BlogPost } from '@/types/blog';

// Create article with translations
export const createArticle = (id: string, translationKey: string, imageUrl: string, tags: string[], t: any): BlogPost => {
  return {
    id,
    date: '22 July 2024',
    readTime: '8 min',
    title: t(`blog.articles.${translationKey}.title`),
    description: t(`blog.articles.${translationKey}.description`),
    content: {
      introduction: t(`blog.articles.${translationKey}.introduction`),
      sections: [
        {
          title: t(`blog.articles.${translationKey}.sections.0.title`),
          content: t(`blog.articles.${translationKey}.sections.0.content`)
        },
        {
          title: t(`blog.articles.${translationKey}.sections.1.title`),
          content: t(`blog.articles.${translationKey}.sections.1.content`)
        },
        {
          title: t(`blog.articles.${translationKey}.sections.2.title`),
          content: t(`blog.articles.${translationKey}.sections.2.content`)
        },
        {
          title: t(`blog.articles.${translationKey}.sections.3.title`),
          content: t(`blog.articles.${translationKey}.sections.3.content`)
        }
      ]
    },
    tags,
    imageUrl
  };
};

export default function WeeklyPosts() {
  const { t, language } = useLanguageStore();
  
  // Weekly posts data
  const weeklyPosts: BlogPost[] = [
    createArticle('2', 'artInvestmentStrategy', '/images/blog/art-investment-strategy.png', ['Art', 'Investment', 'Strategy'], t),
    createArticle('3', 'artTokenization', '/images/blog/art-tokenization.png', ['Art', 'Blockchain', 'Tokenization'], t),
    createArticle('4', 'beginnerArtInvestment', '/images/blog/beginner-art-investment.png', ['Art', 'Investment', 'Strategy'], t)
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