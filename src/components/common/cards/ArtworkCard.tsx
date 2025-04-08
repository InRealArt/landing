import { Ref } from "react";
import Link from "next/link";
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
      <div className="bg-cover m-auto bg-no-repeat bg-top h-52 md:h-80 w-full rounded-lg" style={{ backgroundImage: ` url('${image.src}')` }} />
      <p className="mt-4">{name}</p>
    </Link>
  );
}

export default ArtworkCard;