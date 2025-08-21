'use client'

import { Ref } from "react";
import Button from "../Button";
import { useLanguageStore } from '@/store/languageStore';
import Link from "next/link";
import { stringToSlug } from "@/utils/functions";

interface ArtworkCardOrderProps {
  image: {
    src: string;
  };
  name: string;
  price: number | null;
  artistName: string;
}

const ArtworkCardOrder = ({ image, name, artistName, price }: ArtworkCardOrderProps) => {
  const { t } = useLanguageStore();
  // Convert the name to a slug for the URL
  const slug = stringToSlug(name);

  return (
    <div className="p-6 border border-gray-300 rounded-lg bg-cardBackground w-full relative">
      <Link href={`/artwork/${slug}`} className="block">
        <div className="bg-contain bg-center m-auto bg-no-repeat h-80 md:h-96 w-full rounded-lg" style={{ backgroundImage: ` url('${image.src}')` }} />
        <div className="mt-4">
          <p className="text-white font-medium text-lg">{name}</p>
          <p className="text-white text-sm opacity-80">{artistName}</p>
          {price && (
            <p className="text-white text-sm opacity-80">{price}€</p>
          )}
        </div>
      </Link>
      
      <Link href={`/artwork/${slug}`} className="absolute bottom-6 right-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-500 rounded-lg text-white text-sm transition-colors duration-200 bricolage-grotesque">
        {t('presale.artworks.button.seeDetail')}
      </Link>
    </div>
  );
}

export default ArtworkCardOrder;