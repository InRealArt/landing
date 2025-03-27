import Image from "next/image";
import Slider from "@/components/home/Slider";
import teamImage from "../../../public/images/team.png";
import Button from "../common/Button";
import { ArrowRight } from 'lucide-react';

export default function Team() {
  const teamImages = [
    { image: teamImage, name: "Team people 1", role: 'Directeur Artistique', socials: [] },
    { image: teamImage, name: "Team people 2", role: 'Directeur Artistique', socials: [] },
    { image: teamImage, name: "Team people 3", role: 'Directeur Artistique', socials: [] },
    { image: teamImage, name: "Team people 4", role: 'Directeur Artistique', socials: [] },
    { image: teamImage, name: "Team people 1", role: 'Directeur Artistique', socials: [] },
    { image: teamImage, name: "Team people 2", role: 'Directeur Artistique', socials: [] },
    { image: teamImage, name: "Team people 3", role: 'Directeur Artistique', socials: [] },
    { image: teamImage, name: "Team people 4", role: 'Directeur Artistique', socials: [] },
  ]
  return (
    <section className="mt-36 max-w-screen-2xl m-auto">
      <div className="max-w-90 xl:max-w-screen-xl md:flex justify-between w-full m-auto items-center">
        <h1 className="bricolage-grotesque text-4xl md:text-5xl">Découvrez les membres de l’équipe</h1>
        <Button text="L'équipe" additionalClassName="bg-purpleColor mr-6 mt-6 md:mt-0" icon={<ArrowRight />} />
      </div>
      <Slider context="team" items={teamImages} additionnalClassName="relative bg-gradient" />
    </section>
  );
}
