import Intro from "@/components/presale/Intro";
import artworkImage from "../../../public/images/artwork.png";
import Explore from "@/components/home/Explore";
import ArtworkCard from "@/components/common/cards/ArtworkCardOrder";
import Button from "@/components/common/Button";
import BuyProcess from "@/components/presale/BuyProcess";

export default function Presale() {
  const artworkImages = [
    { image: artworkImage, name: "Artist 1", price: 10000 },
    { image: artworkImage, name: "Artist 2", price: 10000 },
    { image: artworkImage, name: "Artist 3", price: 10000 },
    { image: artworkImage, name: "Artist 4", price: 10000 },
    { image: artworkImage, name: "Artist 5", price: 10000 },
    { image: artworkImage, name: "Artist 6", price: 10000 },
    { image: artworkImage, name: "Artist 7", price: 10000 },
    { image: artworkImage, name: "Artist 8", price: 10000 },
    { image: artworkImage, name: "Artist 9", price: 10000 },
    { image: artworkImage, name: "Artist 10", price: 10000 },
  ]


  return (
    <>
      <Intro />
      <div className="relative max-w-90 xl:max-w-screen-xl m-auto">
        <div className="flex justify-between mb-6">
          <h1 className="text-2xl md:text-4xl font-bold mt-10">Presales on demand</h1>
          <Button additionalClassName="mt-10" text="Voir tout" />
        </div>
        <div className="flex flex-wrap gap-4">
          {artworkImages.map((item) => <ArtworkCard key={item.name} {...item} />)}
        </div>
        <BuyProcess />

      </div>
    </>
  );
}
