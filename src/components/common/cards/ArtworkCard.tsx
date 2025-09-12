import Link from "next/link";
import { stringToSlug } from "@/utils/functions";
import OptimizedContentImage from "../OptimizedContentImage";

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
  
  return (
    <Link href={`/${type}/${slug}`} className="p-2 border rounded-lg bg-cardBackground block">
      {type === 'artist' ? (
        <div className="bg-cover m-auto bg-no-repeat bg-top h-96 md:h-[32rem] w-full rounded-lg" 
          style={{ backgroundImage: `url('${image.src}')` }} />
      ) : (
        <div className="relative h-96 md:h-[32rem] w-full rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
          <OptimizedContentImage
            src={image.src}
            alt={name}
            className="object-contain max-h-full max-w-full h-auto"
            width={320}
            height={320}
            priority={false}
          />
        </div>
      )}
      <p className="mt-4 h-6 bricolage-grotesque overflow-hidden text-ellipsis whitespace-nowrap font-medium">{name}</p>
    </Link>
  );
}

export default ArtworkCard;