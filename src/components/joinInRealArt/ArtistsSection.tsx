import ArtistSlider from "@/components/home/ArtistSlider";
import ArtistsSectionTitle from "./ArtistsSectionTitle";

export default function ArtistsSection() {
  return (
    <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4 py-16">
      <ArtistsSectionTitle />
      <ArtistSlider isGallery={false} />
    </div>
  );
} 