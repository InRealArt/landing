import { Metadata } from 'next'
import Intro from "@/components/home/Intro";
import Statistics from "@/components/home/Statistics";
import Team from "@/components/common/Team";
import HowItWorks from "@/components/home/HowItWorks";
import Explore from "@/components/home/Explore";
import ArtistSlider from "@/components/home/ArtistSlider";
import ArtworkSlider from "@/components/home/ArtworkSlider";
import NewsletterInline from "@/components/common/NewsletterInline";
import { generateStaticMetadata, generateOrganizationJsonLd, generateWebSiteJsonLd, defaultMetadata } from '@/utils/metadata'

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

      <Intro />
      <Statistics />
      <HowItWorks />
      <Explore />
      <div className="relative bg-gradient max-w-screen-2xl m-auto mt-48">
        <ArtistSlider />
        <ArtworkSlider />
      </div>
      <Team />
      <NewsletterInline />
    </>
  );
}
