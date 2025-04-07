import Intro from "@/components/home/Intro";
import Statistics from "@/components/home/Statistics";
import Team from "@/components/common/Team";
import HowItWorks from "@/components/home/HowItWorks";
import Explore from "@/components/home/Explore";
import ArtistSlider from "@/components/home/ArtistSlider";
import ArtworkSlider from "@/components/home/ArtworkSlider";

export default function Home() {
  return (
    <>
      <Intro />
      <div className="relative bg-gradient max-w-screen-2xl m-auto">
        <ArtistSlider />
        <ArtworkSlider />
      </div>
      <Statistics />
      <Team />
      <HowItWorks />
      <Explore />
    </>
  );
}
