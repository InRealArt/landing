'use client'

import Link from "next/link";
import { stringToSlug } from "@/utils/functions";
import OptimizedContentImage from "../OptimizedContentImage";
import FirebaseBackgroundImage from "../FirebaseBackgroundImage";
import FirebaseImageLoader from "../FirebaseImageLoader";
import { useFirebaseImage } from "@/hooks/useFirebaseImage";

interface ArtworkCardProps {
  image: {
    src: string;
  };
  name: string;
  type?: 'artist' | 'artwork';
}

const ArtworkCard = ({ image, name, type = 'artwork' }: ArtworkCardProps) => {
  // Convert the name to a slug for the URL
  const slug = stringToSlug(name);
  const { src: imgSrc, status, onLoad, onError } = useFirebaseImage(image.src)

  if (type === 'artist') {
    return (
      <Link href={`/artists/${slug}`} className="group block cursor-pointer">
        {/* Artist Card - Gallery Style */}
        <div className="aspect-[3/4] overflow-hidden mb-8 bg-soft-gray grayscale group-hover:grayscale-0 transition-all duration-1000">
          <FirebaseBackgroundImage
            src={image.src}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center">
          <h4 className="text-sm uppercase tracking-[0.3em] font-medium text-textColor">{name}</h4>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/artwork/${slug}`} className="block">
      {/* Artwork Card - Gallery Style */}
      <div className="artwork-image aspect-[4/5] mb-6">
        <div className="relative h-full w-full overflow-hidden">
          {status === 'retrying' && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <FirebaseImageLoader />
            </div>
          )}
          <OptimizedContentImage
            src={imgSrc}
            alt={name}
            className="object-cover w-full h-full"
            width={400}
            height={500}
            priority={false}
            onLoad={onLoad}
            onError={onError}
          />
        </div>
      </div>
      <div className="flex flex-col space-y-1">
        <h3 className="serif text-2xl italic text-textColor overflow-hidden text-ellipsis">{name}</h3>
      </div>
    </Link>
  );
}

export default ArtworkCard;