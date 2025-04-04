'use client'

import { useParams } from 'next/navigation';
import PostDetail from '@/components/blog/PostDetail';
import { useLanguageStore } from '@/store/languageStore';
import { BlogPostDetail } from '@/types/blog';

// Sample blog posts data - in a real app, this would come from an API or database
const blogPosts: Record<string, BlogPostDetail> = {
  '1': {
    id: '1',
    date: '22 July 2024',
    readTime: '4 min',
    title: 'How Remote work drastically Improved my Design Skills',
    description: 'Remote work has drastically improved my design skills by giving me the freedom to experiment, focus, and learn at my own pace.',
    content: `
      <p>Remote work has drastically improved my design skills by giving me the freedom to experiment, focus, and learn at my own pace. Without the daily commute and office distractions, I found more time for deep, uninterrupted work, allowing me to refine my design techniques and creativity. Collaborating with a global team challenged me to communicate more effectively and exposed me to diverse perspectives and approaches to design.</p>
      <p>The flexibility of remote work allowed me to structure my day around my creative peaks, working when I'm most inspired rather than confined to traditional office hours. I've been able to take more online courses, participate in design communities, and build a tailored workspace that enhances my productivity. The results have been transformative - my portfolio has expanded, my technical skills have improved, and I've developed a more distinct design style.</p>
      <p>Additionally, the distance from immediate supervisory oversight encouraged me to become more self-directed and proactive about seeking feedback. I've learned to articulate my design decisions more clearly and to trust my instincts. Remote work hasn't just changed where I work; it's fundamentally improved how I work as a designer.</p>
    `,
    tags: ['Design', 'Product', 'Frameworks'],
    imageUrl: '/images/blog-main.png',
    author: 'Sarah Johnson',
    authorRole: 'Senior Designer'
  },
  '2': {
    id: '2',
    date: '22 July 2024',
    readTime: '4 min',
    title: 'Our SaaS Product Just Launched!',
    description: 'Remote work has drastically improved my design skills by giving me the freedom to experiment, focus, and learn at my own pace.',
    content: `
      <p>Remote work has drastically improved my design skills by giving me the freedom to experiment, focus, and learn at my own pace. Without the daily commute and office distractions, I found more time for deep, uninterrupted work, allowing me to refine my design techniques and creativity. Collaborating with a global team challenged me to communicate more effectively and exposed me to diverse perspectives and approaches to design.</p>
      <p>The flexibility of remote work allowed me to structure my day around my creative peaks, working when I'm most inspired rather than confined to traditional office hours. I've been able to take more online courses, participate in design communities, and build a tailored workspace that enhances my productivity. The results have been transformative - my portfolio has expanded, my technical skills have improved, and I've developed a more distinct design style.</p>
    `,
    tags: ['Design', 'Product'],
    imageUrl: '/images/blog-second.png',
    author: 'Alex Thompson',
    authorRole: 'Product Manager'
  }
};

export default function BlogPostPage() {
  const { id } = useParams();
  const { t } = useLanguageStore();
  const postId = Array.isArray(id) ? id[0] : id;
  
  // In a real app, you would fetch the post from an API or database
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