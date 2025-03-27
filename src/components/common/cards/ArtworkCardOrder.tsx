import { Ref } from "react";
import Button from "../Button";

interface ArtworkCardOrderProps {
  image: {
    src: string;
  };
  name: string;
  price: number;
}

const ArtworkCardOrder = ({ image, name, price }: ArtworkCardOrderProps) => {
  return (
    <div className="p-6 border rounded-lg bg-cardBackground w-full lg:w-cardLarge">
      <div className="bg-cover m-auto bg-no-repeat bg-top h-80 md:h-96 w-full rounded-lg" style={{ backgroundImage: ` url('${image.src}')` }} />
      <div className="flex justify-between">
        <p className="mt-4">{name}</p>
        <p className="mt-4 text-right"><b>Prix actuel</b> <br/> {price} €</p>
      </div>
      <Button additionalClassName="mt-6 w-full text-center justify-center bg-purpleColor" text="Voir tout" />
    </div>
  );
}

export default ArtworkCardOrder;