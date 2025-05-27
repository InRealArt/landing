'use client'

import Hero from '@/components/blog/Hero';
import BlogCategories from '@/components/blog/BlogCategories';
import FeaturedPost from '@/components/blog/FeaturedPost';
import WeeklyPosts from '@/components/blog/WeeklyMostReadPosts';
import OthersPosts from '@/components/blog/OthersPosts';

export default function BlogPage() {
  return (
    <main className="min-h-screen pt-headerSize text-white">
      <Hero />
      <BlogCategories />
      <FeaturedPost />
      {/* <WeeklyPosts /> */}
      <OthersPosts />
    </main>
  );
} 