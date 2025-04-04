'use client'

import Hero from '@/components/blog/Hero';
import FeaturedPost from '@/components/blog/FeaturedPost';
import WeeklyPosts from '@/components/blog/WeeklyPosts';

export default function BlogPage() {
  return (
    <main className="min-h-screen pt-headerSize text-white">
      <Hero />
      <FeaturedPost />
      <WeeklyPosts />
    </main>
  );
} 