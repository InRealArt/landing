import GalleriesHero from "./GalleriesHero";
import JoinIraOpportunities from "./JoinIraOpportunities";
import GalleryTestimonialsWrapper from "./GalleryTestimonialsWrapper";
import GalleriesContactSection from "./GalleriesContactSection";
import HowToJoinUs from "@/components/common/HowToJoinUs";

export default function JoinInRealArtGalleriesPage() {
  const galleriesOpportunities = [
    {
      key: 'support',
      titleKey: 'joinInRealArt.galleries.opportunities.support.title',
      descriptionKey: 'joinInRealArt.galleries.opportunities.support.description'
    },
    {
      key: 'technology',
      titleKey: 'joinInRealArt.galleries.opportunities.technology.title',
      descriptionKey: 'joinInRealArt.galleries.opportunities.technology.description'
    },
    {
      key: 'rights',
      titleKey: 'joinInRealArt.galleries.opportunities.rights.title',
      descriptionKey: 'joinInRealArt.galleries.opportunities.rights.description'
    },
    {
      key: 'brand',
      titleKey: 'joinInRealArt.galleries.opportunities.brand.title',
      descriptionKey: 'joinInRealArt.galleries.opportunities.brand.description'
    }
  ];

  const galleriesHowToJoinSteps = [
    {
      number: '01',
      title: 'joinInRealArt.galleries.howToJoin.steps.1.title',
      description: ''
    },
    {
      number: '02',
      title: 'joinInRealArt.galleries.howToJoin.steps.2.title',
      description: ''
    },
    {
      number: '03',
      title: 'joinInRealArt.galleries.howToJoin.steps.3.title',
      description: ''
    }
  ];

  return (
    <div className="min-h-screen text-textColor">
      <GalleriesHero />

      <JoinIraOpportunities
        titleKey="joinInRealArt.galleries.opportunities.title"
        buttonTextKey="joinInRealArt.galleries.opportunities.button"
        opportunities={galleriesOpportunities}
        buttonUrl="#howToJoinUs"
        darkBackground={true}
      />

      <GalleryTestimonialsWrapper />

      <GalleriesContactSection />

     
    </div>
  );
}
