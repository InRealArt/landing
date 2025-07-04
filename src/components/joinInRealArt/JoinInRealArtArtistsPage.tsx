import FAQ from "@/components/common/FAQ/FAQ";
import ArtistJoinHero from "./ArtistJoinHero";
import ArtistOpportunities from "./ArtistOpportunities";
import ArtistTestimonialsWrapper from "./ArtistTestimonialsWrapper";
import ArtistsSection from "./ArtistsSection";
import HowToJoinUs from "@/components/common/HowToJoinUs";

export default function JoinInRealArtArtistsPage() {
  return (
    <div className="min-h-screen text-white">
      <ArtistJoinHero />
      
      <ArtistsSection />
      
      <ArtistOpportunities />
      
      <ArtistTestimonialsWrapper />

      <HowToJoinUs />
      
    </div>
  );
} 