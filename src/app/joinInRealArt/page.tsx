'use client'

import { JoinInRealArtHero, DescriptionsBlock, JoinNewsletterSection } from "@/components/joinInRealArt";
import JoinInRealArtFAQ from "@/components/joinInRealArt/JoinInRealArtFAQ";
import GalleriesCallout from "@/components/joinInRealArt/GalleriesCallout";

export default function UseCase() {
  return (
    <>
      <JoinInRealArtHero />
      <DescriptionsBlock />
      {/* <CustomerStories /> */}
      {/* <ReadyToStart /> */}
      <GalleriesCallout />
      <JoinInRealArtFAQ />
      <JoinNewsletterSection />
    </>
  );
}
