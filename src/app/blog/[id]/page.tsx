'use client'

import { useParams } from 'next/navigation';
import PostDetail from '@/components/blog/PostDetail';
import { useLanguageStore } from '@/store/languageStore';
import { BlogPost, BlogPostDetail } from '@/types/blog';
import { createArticle } from '@/components/blog/WeeklyPosts';

// Function to convert structured blog content to HTML
const formatPostContent = (post: BlogPost): string => {
  if (!post.content) return '';
  
  let html = `<h1 class="text-3xl md:text-4xl font-bold mb-8">${post.content.introduction}</h1>`;
  
  post.content.sections.forEach(section => {
    html += `<h2 class="text-2xl font-bold mt-10 mb-4">${section.title}</h2>`;
    html += `<p class="mb-6">${section.content}</p>`;
  });
  
  return html;
};

// Function to convert BlogPost to BlogPostDetail
const convertToPostDetail = (post: BlogPost): BlogPostDetail => {
  return {
    ...post,
    content: formatPostContent(post),
    author: 'InRealArt Team',
    authorRole: 'Art Investment Specialists'
  };
};

export default function BlogPostPage() {
  const { id } = useParams();
  const { t } = useLanguageStore();
  const postId = Array.isArray(id) ? id[0] : id;
  
  // Create our blog posts from translations
  const blogPosts: Record<string, BlogPostDetail> = {
    '1': convertToPostDetail(createArticle('1', 'companyArtInvestment', '/images/blog/company-art-investment.png', ['Art', 'Investment', 'Business'], t)),
    '2': convertToPostDetail(createArticle('2', 'artInvestmentStrategy', '/images/blog/art-investment-strategy.png', ['Art', 'Investment', 'Strategy'], t)),
    '3': convertToPostDetail(createArticle('3', 'artTokenization', '/images/blog/art-tokenization.png', ['Art', 'Blockchain', 'Tokenization'], t)),
    '4': convertToPostDetail(createArticle('4', 'beginnerArtInvestment', '/images/blog/beginner-art-investment.png', ['Art', 'Investment', 'Strategy'], t))
  };
  
  // Get the post by ID
  const post = blogPosts[postId as string];
  
  // Handle case where post is not found
  if (!post) {
    return (
      <main className="min-h-screen text-white pt-headerSize">
        <div className="max-w-screen-lg mx-auto p-8">
          <h1 className="text-3xl font-bold mb-8">Post not found</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-headerSize text-white">
      <PostDetail post={post} />
    </main>
  );
} 