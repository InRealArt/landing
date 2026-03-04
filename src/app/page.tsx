import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Intro from "@/components/home/Intro";
import Statistics from "@/components/home/Statistics";
import { generateStaticMetadata, generateOrganizationJsonLd, generateWebSiteJsonLd, generateArtGalleryJsonLd, defaultMetadata } from '@/utils/metadata'

// ✅ OPTIMISÉ: Lazy loading des composants below-the-fold
// Impact: Réduit le bundle JavaScript initial de ~40-60%
const HowItWorks = dynamic(() => import("@/components/home/HowItWorks"), {
  loading: () => <div className="w-full h-96 animate-pulse bg-cardBackground rounded-lg" />
})
const Explore = dynamic(() => import("@/components/home/Explore"), {
  loading: () => <div className="w-full h-96 animate-pulse bg-cardBackground rounded-lg" />
})
const ArtistSlider = dynamic(() => import("@/components/home/ArtistSlider"), {
  loading: () => <div className="w-full h-96 animate-pulse bg-cardBackground rounded-lg" />
})
const ArtworkSlider = dynamic(() => import("@/components/home/ArtworkSlider"), {
  loading: () => <div className="w-full h-96 animate-pulse bg-cardBackground rounded-lg" />
})
const Partners = dynamic(() => import("@/components/home/Partners"), {
  loading: () => <div className="w-full h-64 animate-pulse bg-cardBackground rounded-lg" />
})
const MediaPartners = dynamic(() => import("@/components/home/MediaPartners"), {
  loading: () => <div className="w-full h-64 animate-pulse bg-cardBackground rounded-lg" />
})
const Team = dynamic(() => import("@/components/common/Team"), {
  loading: () => <div className="w-full h-96 animate-pulse bg-cardBackground rounded-lg" />
})
const FAQWrapper = dynamic(() => import('@/components/common/FAQ/FAQWrapper'), {
  loading: () => <div className="w-full h-96 animate-pulse bg-cardBackground rounded-lg" />
})
const NewsletterInline = dynamic(() => import("@/components/common/NewsletterInline"), {
  loading: () => <div className="w-full h-64 animate-pulse bg-cardBackground rounded-lg" />
})

export const metadata: Metadata = generateStaticMetadata({
  title: defaultMetadata.home.title,
  description: defaultMetadata.home.description,
  keywords: defaultMetadata.home.keywords,
  canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://inrealart.com'
})

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateOrganizationJsonLd() }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebSiteJsonLd() }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateArtGalleryJsonLd() }}
      />

      <Intro />
      <Statistics />
      <HowItWorks />
      <Explore />
      <div className="relative bg-gradient max-w-screen-2xl m-auto mt-48">
        <ArtistSlider isGallery={false} />
        <ArtworkSlider />
        <Partners />
        <MediaPartners />
      </div>
      <Team />
      {/* <HomeFaq /> */}
      <FAQWrapper 
        titleKey="home.faq.title" 
        descriptionKey="home.faq.description" 
      />
      <NewsletterInline />

    </>
  );
}
