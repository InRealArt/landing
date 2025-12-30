'use client'

import { useLanguageStore } from "@/store/languageStore";

export default function GalleriesSectionTitle() {
  const { t } = useLanguageStore();

  return (
    <h2 className="bricolage-grotesque text-3xl md:text-6xl mb-3 text-textColor">
      {t('joinInRealArt.galleries.title')}
    </h2>
  );
}

