'use client'

import Hero from '@/components/blog/Hero';
import BlogCategories from '@/components/blog/BlogCategories';
import FeaturedPost from '@/components/blog/FeaturedPost';
import OthersPosts from '@/components/blog/OthersPosts';
import BlogAnimations from '@/components/blog/BlogAnimations';
import type { SeoPost } from '@/types/seoPost'

interface Category {
  id: number
  name: string
  color: string | null
  url: string | null
}

interface Props {
  initialFeaturedPost: SeoPost | null
  initialCategories: Category[]
}

export default function BlogPageClient({ initialFeaturedPost, initialCategories }: Props) {
  return (
    <main className="min-h-screen bg-[var(--canvas-bg)] text-[var(--ink-black)] pt-headerSize">
      <BlogAnimations />
      <Hero />
      <BlogCategories initialCategories={initialCategories} />
      <FeaturedPost initialPost={initialFeaturedPost} />
      <OthersPosts />
    </main>
  );
}
