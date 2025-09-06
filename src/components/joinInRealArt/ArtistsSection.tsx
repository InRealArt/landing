'use client'

import ArtistSlider from "@/components/home/ArtistSlider";
import { useLanguageStore } from "@/store/languageStore";

export default function ArtistsSection() {
  const { t } = useLanguageStore();

  return (
    <div className="max-w-90 xl:max-w-screen-xl mx-auto px-4 py-16">
      <h2 className="bricolage-grotesque text-3xl md:text-6xl mb-3 text-textColor">
        {t('artists.title')}
      </h2>
      <ArtistSlider isGallery={false} />
    </div>
  );
} 