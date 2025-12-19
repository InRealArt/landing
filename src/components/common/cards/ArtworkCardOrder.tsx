'use client'

import { useLanguageStore } from '@/store/languageStore';
import Link from "next/link";
import { stringToSlug } from "@/utils/functions";
import SoldStatusBadge from '@/components/common/SoldStatusBadge';

interface ArtworkCardOrderProps {
  image: {
    src: string;
  };
  name: string;
  price: number | null;
  artistName: string;
  isSold?: boolean;
}

const ArtworkCardOrder = ({ image, name, artistName, price, isSold = false }: ArtworkCardOrderProps) => {
  const { t } = useLanguageStore();
  // Convert the name to a slug for the URL
  const slug = stringToSlug(name);

  return (
    <div className="p-6 border border-gray-300 rounded-lg bg-cardBackground flex flex-col h-full">
      <Link href={`/artwork/${slug}`} className="block flex-1 relative">
        <div className="bg-contain bg-center m-auto bg-no-repeat h-72 md:h-80 w-full rounded-lg relative" style={{ backgroundImage: ` url('${image.src}')` }}>
          <SoldStatusBadge isSold={isSold} />
        </div>
        <div className="mt-4">
          <p className="text-textColor font-medium text-lg">{name}</p>
          <p className="text-textColor text-sm opacity-80">{artistName}</p>
          {price && (
            <p className="text-textColor text-sm opacity-80">{price}€</p>
          )}
        </div>
      </Link>
      
      <div className="mt-4 flex justify-end">
        <Link href={`/artwork/${slug}`} className="px-4 py-2 bg-cardBackground hover:bg-gray-600 border border-gray-500 rounded-lg text-textColor text-sm transition-colors duration-200 bricolage-grotesque">
          {t('presale.artworks.button.seeDetail')}
        </Link>
      </div>
    </div>
  );
}

export default ArtworkCardOrder;