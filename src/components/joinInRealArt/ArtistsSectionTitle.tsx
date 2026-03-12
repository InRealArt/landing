'use client'

import { useLanguageStore } from "@/store/languageStore";

export default function ArtistsSectionTitle() {
  const { t } = useLanguageStore();

  return (
    <h2 className="text-5xl md:text-7xl serif italic leading-tight mb-3 text-textColor">
      {t('artists.title')}
    </h2>
  );
}

