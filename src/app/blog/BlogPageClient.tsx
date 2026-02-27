'use client'

import Hero from '@/components/blog/Hero';
import BlogCategories from '@/components/blog/BlogCategories';
import FeaturedPost from '@/components/blog/FeaturedPost';
import OthersPosts from '@/components/blog/OthersPosts';

export default function BlogPageClient() {
  return (
    <main className="min-h-screen pt-headerSizeMobile md:pt-headerSize text-textColor">
      <Hero />
      <BlogCategories />
      <FeaturedPost />
      {/* <WeeklyPosts /> */}
      <OthersPosts />
    </main>
  );
}
