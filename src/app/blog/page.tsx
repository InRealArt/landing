'use client'

import Hero from '@/components/blog/Hero';
import BlogCategories from '@/components/blog/BlogCategories';
import FeaturedPost from '@/components/blog/FeaturedPost';
import OthersPosts from '@/components/blog/OthersPosts';
import { generateCollectionJsonLd } from '@/utils/metadata'

export default function BlogPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: generateCollectionJsonLd(
            'Blog InRealArt',
            'Articles et actualités sur l\'art tokenisé, l\'investissement artistique et la blockchain',
            [] // This would be populated with actual blog post data
          )
        }}
      />
      
      <main className="min-h-screen pt-headerSize text-textColor">
        <Hero />
        <BlogCategories />
        <FeaturedPost />
        {/* <WeeklyPosts /> */}
        <OthersPosts />
      </main>
    </>
  );
} 