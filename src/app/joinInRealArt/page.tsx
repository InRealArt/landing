'use client'

import { JoinInRealArtHero, DescriptionsBlock, JoinNewsletterSection } from "@/components/joinInRealArt";
import JoinInRealArtFAQ from "@/components/joinInRealArt/JoinInRealArtFAQ";

export default function UseCase() {
  return (
    <>
      <JoinInRealArtHero />
      <DescriptionsBlock />
      {/* <CustomerStories /> */}
      {/* <ReadyToStart /> */}
      <JoinInRealArtFAQ />
      <JoinNewsletterSection />
    </>
  );
}
