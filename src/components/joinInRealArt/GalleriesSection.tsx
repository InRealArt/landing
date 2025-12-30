import ArtistSlider from "@/components/home/ArtistSlider";
import GalleriesSectionTitle from "./GalleriesSectionTitle";

export default function GalleriesSection() {
  return (
    <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4 py-16">
      <GalleriesSectionTitle />
      <ArtistSlider isGallery={true} />
    </div>
  );
} 