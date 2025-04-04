'use client'

import { Ref } from "react";
import Button from "../Button";
import { useLanguageStore } from '@/store/languageStore';

interface ArtworkCardOrderProps {
  image: {
    src: string;
  };
  name: string;
  price: number;
}

const ArtworkCardOrder = ({ image, name, price }: ArtworkCardOrderProps) => {
  const { t } = useLanguageStore();

  return (
    <div className="p-6 border rounded-lg bg-cardBackground w-full lg:w-cardLarge">
      <div className="bg-cover m-auto bg-no-repeat bg-top h-80 md:h-96 w-full rounded-lg" style={{ backgroundImage: ` url('${image.src}')` }} />
      <div className="flex justify-between">
        <p className="mt-4">{name}</p>
      </div>
      <Button additionalClassName="mt-6 w-full text-center justify-center bg-purpleColor" text={t('buttons.readMore')} />
    </div>
  );
}

export default ArtworkCardOrder;