import Image from "next/image";
import Intro from "@/components/home/Intro";
import Slider from "@/components/home/Slider";
import artistImage from "../../public/images/artist.png";
import teamImage from "../../public/images/team.png";
import artworkImage from "../../public/images/artwork.png";
import Statistics from "@/components/home/Statistics";
import Team from "@/components/home/Team";
import HowItWorks from "@/components/home/HowItWorks";
import Explore from "@/components/home/Explore";

export default function Home() {

  const artistImages = [
    { image: artistImage, name: "Artist 1" },
    { image: artistImage, name: "Artist 2" },
    { image: artistImage, name: "Artist 3" },
    { image: artistImage, name: "Artist 4" },
    { image: artistImage, name: "Artist 1" },
    { image: artistImage, name: "Artist 2" },
    { image: artistImage, name: "Artist 3" },
    { image: artistImage, name: "Artist 4" },
  ]

  const artworkImages = [
    { image: artworkImage, name: "Artwork 1" },
    { image: artworkImage, name: "Artwork 2" },
    { image: artworkImage, name: "Artwork 3" },
    { image: artworkImage, name: "Artwork 4" },
    { image: artworkImage, name: "Artwork 1" },
    { image: artworkImage, name: "Artwork 2" },
    { image: artworkImage, name: "Artwork 3" },
    { image: artworkImage, name: "Artwork 4" },
  ]

  return (
    <>
      <Intro />
      <div className="relative bg-gradient max-w-screen-2xl m-auto">
        <Slider context="artist" items={artistImages} />
        <Slider context="artwork" items={artworkImages} isReverse />
      </div>
      <Statistics />
      <Team />
      <HowItWorks />
      <Explore />
    </>
  );
}
