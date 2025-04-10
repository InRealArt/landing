import { Ref } from "react";
import Link from "next/link";
import Image from "next/image";
import { stringToSlug } from "@/utils/functions";

interface ArtworkCardProps {
  image: {
    src: string;
  };
  name: string;
}

const ArtworkCard = ({ image, name }: ArtworkCardProps) => {
  // Convert the name to a slug for the URL
  const slug = stringToSlug(name);
  
  return (
    <Link href={`/artwork/${slug}`} className="p-2 border rounded-lg bg-cardBackground block">
      <div className="relative h-52 md:h-80 w-full rounded-lg overflow-hidden flex items-center justify-center">
        <img 
          src={image.src} 
          alt={name} 
          className="object-contain max-h-full max-w-full h-auto"
        />
      </div>
      <p className="mt-4 h-6 overflow-hidden text-ellipsis whitespace-nowrap">{name}</p>
    </Link>
  );
}

export default ArtworkCard;