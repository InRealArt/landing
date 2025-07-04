import FAQ from "@/components/common/FAQ/FAQ";
import JoinIraHero from "./JoinIraHero";
import JoinIraOpportunities from "./JoinIraOpportunities";
import ArtistTestimonialsWrapper from "./ArtistTestimonialsWrapper";
import ArtistsSection from "./ArtistsSection";
import HowToJoinUs from "@/components/common/HowToJoinUs";

export default function JoinInRealArtArtistsPage() {
  const artistsOpportunities = [
    {
      key: 'support',
      titleKey: 'joinInRealArt.artists.opportunities.support.title',
      descriptionKey: 'joinInRealArt.artists.opportunities.support.description'
    },
    {
      key: 'technology',
      titleKey: 'joinInRealArt.artists.opportunities.technology.title',
      descriptionKey: 'joinInRealArt.artists.opportunities.technology.description'
    },
    {
      key: 'rights',
      titleKey: 'joinInRealArt.artists.opportunities.rights.title',
      descriptionKey: 'joinInRealArt.artists.opportunities.rights.description'
    }
  ];

  const urlForm = 'https://docs.google.com/forms/d/1RxKNtLG2XZ7BB2CpzGI4yJZCjSJ3cSXwOHQKgwVC4gA/viewform?edit_requested=true#responses'

  const artistsHowToJoinSteps = [
    {
      number: '01',
      title: 'joinInRealArt.artists.howToJoin.steps.1.title',
      description: ''
    },
    {
      number: '02',
      title: 'joinInRealArt.artists.howToJoin.steps.2.title',
      description: ''
    },
    {
      number: '03',
      title: 'joinInRealArt.artists.howToJoin.steps.3.title',
      description: ''
    }
  ]
  return (
    <div className="min-h-screen text-white">
      <JoinIraHero 
        title="joinInRealArt.artists.hero.title"
        subtitle="joinInRealArt.artists.hero.subtitle"
        buttonText="joinInRealArt.artists.hero.button"
        buttonUrl={urlForm}
      />
      
      <ArtistsSection />
      
      <JoinIraOpportunities 
        titleKey="joinInRealArt.artists.opportunities.title"
        buttonTextKey="joinInRealArt.artists.opportunities.button"
        opportunities={artistsOpportunities}
        buttonUrl={urlForm}
      />
      
      <ArtistTestimonialsWrapper />

      <HowToJoinUs 
        title="joinInRealArt.artists.howToJoin.title"
        buttonText="joinInRealArt.artists.howToJoin.button"
        buttonUrl={urlForm}
        steps={artistsHowToJoinSteps}
      />
      
    </div>
  );
} 