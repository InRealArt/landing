import { Ref } from "react";

interface ArtworkCardProps {
  image: {
    src: string;
  };
  name: string;
}

const ArtworkCard = ({ image, name }: ArtworkCardProps) => {
  return (
    <div className="p-2 border rounded-lg bg-cardBackground">
      <div className="bg-cover m-auto bg-no-repeat bg-top h-52 md:h-80 w-full rounded-lg" style={{ backgroundImage: ` url('${image.src}')` }} />
      <p className="mt-4">{name}</p>
    </div>
  );
}

export default ArtworkCard;