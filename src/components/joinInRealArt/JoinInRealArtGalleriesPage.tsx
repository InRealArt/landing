import JoinIraHero from "./JoinIraHero";
import JoinIraOpportunities from "./JoinIraOpportunities";
import ArtistTestimonialsWrapper from "./GalleryTestimonialsWrapper";
import ArtistsSection from "./ArtistsSection";
import HowToJoinUs from "@/components/common/HowToJoinUs";
import GalleriesSection from "./GalleriesSection";
import GalleryTestimonialsWrapper from "./GalleryTestimonialsWrapper";

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
  ]

  return (
    <div className="min-h-screen text-white">
      <JoinIraHero 
        title="joinInRealArt.galleries.hero.title"
        subtitle="joinInRealArt.galleries.hero.subtitle"
        buttonText="joinInRealArt.galleries.hero.button"
        buttonUrl="#howToJoinUs"
      />
      
      <GalleriesSection />
      
      <JoinIraOpportunities 
        titleKey="joinInRealArt.galleries.opportunities.title"
        buttonTextKey="joinInRealArt.galleries.opportunities.button"
        opportunities={galleriesOpportunities}
        buttonUrl="#howToJoinUs"
      />
      
      <GalleryTestimonialsWrapper />

      <HowToJoinUs 
        title="joinInRealArt.galleries.howToJoin.title"
        buttonText="joinInRealArt.galleries.howToJoin.button"
        steps={galleriesHowToJoinSteps}
        useModal={true}
        modalTitleKey="joinInRealArt.galleries.contact.title"
        modalMessageKey="joinInRealArt.galleries.contact.message"
      />
      
    </div>
  );
} 