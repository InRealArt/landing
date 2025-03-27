import BioSlider from "@/components/common/slider/BioSlider";
import teamMember from "../../../public/images/artist-slider.png";
import artworkImage from "../../../public/images/artwork.png";
import ArtworkCard from "@/components/common/cards/ArtworkCardOrder";
import Button from "@/components/common/Button";
import { ArrowRight } from "lucide-react";

export default function Artists() {
  const teamImages = [
    { image: teamMember, name: 'Boucheix François', role: 'Mouvement Artistique', intro: "Passionné par l'art et les hommes, je m'inspire de la perfection artistique pour m'améliorer sans cesse, poursuivant inlassablement mes objectifs avec un esprit autodidacte", description: "Enrichi par mes expériences en finance et passionné par l'art, je rêve de créer un projet innovant et inclusif pour tous. Mon parcours m'inspire à mêler expertise financière et expression artistique, dans la quête d&apos;un avenir meilleur et partagé." },
    { image: teamMember, name: 'Gilles Bruno', role: 'CTO', intro: "Passionné par l'art et les hommes, je m'inspire de la perfection artistique pour m'améliorer sans cesse, poursuivant inlassablement mes objectifs avec un esprit autodidacte", description: "Enrichi par mes expériences en finance et passionné par l'art, je rêve de créer un projet innovant et inclusif pour tous. Mon parcours m'inspire à mêler expertise financière et expression artistique, dans la quête d&apos;un avenir meilleur et partagé." },
    { image: teamMember, name: 'Nino Lamoureux', role: 'CTO', intro: "Passionné par l'art et les hommes, je m'inspire de la perfection artistique pour m'améliorer sans cesse, poursuivant inlassablement mes objectifs avec un esprit autodidacte", description: "Enrichi par mes expériences en finance et passionné par l'art, je rêve de créer un projet innovant et inclusif pour tous. Mon parcours m'inspire à mêler expertise financière et expression artistique, dans la quête d&apos;un avenir meilleur et partagé." },
  ]

  const artworkImages = [
    { image: artworkImage, name: "Artist 1", price: 10000 },
    { image: artworkImage, name: "Artist 2", price: 10000 },
    { image: artworkImage, name: "Artist 3", price: 10000 },
    { image: artworkImage, name: "Artist 4", price: 10000 },
    { image: artworkImage, name: "Artist 5", price: 10000 },
    { image: artworkImage, name: "Artist 6", price: 10000 },
  ]

  return (
    <>
      <section className="relative max-w-90 xl:max-w-screen-xl m-auto mt-headerSize">
        <BioSlider items={teamImages} title="Qui est" hasArtistName />
        <div className="mt-20">
          <h1 className='text-2xl lg:text-6xl bricolage-grotesque font-medium mb-6'>Découvrez les œuvres de notre artiste</h1>
          <div className="flex flex-wrap gap-4 ">
            {artworkImages.map((item) => <ArtworkCard key={item.name} {...item} />)}
          </div>
        </div>

        <section className="flex flex-col md:flex-row justify-between gap-10 md:gap-20 items-center mt-32">
          <div className="flex-1">
            <h1 className="bricolage-grotesque text-6xl mb-3">Le mot de <br />l&apos;expert(e)</h1>
            <p className="bricolage-grotesque text-md">Forte de +80 années d&apos;expérience cumulée, notre équipe commerciale sélectionne avec soin moins de 100 œuvres de top artistes.</p>
          </div>
          <div className="flex-1">
            <p className="bricolage-grotesque text-md mb-5">Ici, chaque œuvre, qu&apos;elle soit physique ou numérique, est soigneusement sélectionnée pour son caractère unique.
              Pour les collectionneurs aguerris comme pour les novices, la possibilité d&apos;acquérir des œuvres aussi rares est un privilège qui permet de se démarquer tout en enrichissant une collection de manière significative</p>
            <Button text="Voir la marketplace" additionalClassName="bg-purpleColor" icon={<ArrowRight />} />
          </div>
        </section>
      </section>
    </>
  );
}
