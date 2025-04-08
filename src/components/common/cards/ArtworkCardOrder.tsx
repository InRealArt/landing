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
  price: number;
}

const ArtworkCardOrder = ({ image, name }: ArtworkCardOrderProps) => {
  const { t } = useLanguageStore();
  // Convert the name to a slug for the URL
  const slug = stringToSlug(name);

  return (
    <Link href={`/artwork/${slug}`} className="p-6 border rounded-lg bg-cardBackground w-full lg:w-cardLarge block">
      <div className="bg-cover m-auto bg-no-repeat bg-top h-80 md:h-96 w-full rounded-lg" style={{ backgroundImage: ` url('${image.src}')` }} />
      <div className="flex justify-between">
        <p className="mt-4">{name}</p>
      </div>
      <Button additionalClassName="mt-6 w-full text-center justify-center bg-purpleColor" text={t('buttons.readMore')} />
    </Link>
  );
}

export default ArtworkCardOrder;