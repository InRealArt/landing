import BioSlider from "@/components/common/slider/BioSlider";
import teamMember from "../../../public/images/team-member.png";
import TeamCard from "@/components/common/cards/TeamCard";

export default function Team() {
  const teamImages = [
    { socials: [], image: teamMember, name: 'Timothée Roy', role: 'Porteur du projet', intro: "Passionné par l&apos;art et les hommes, je m&apos;inspire de la perfection artistique pour m&apos;améliorer sans cesse, poursuivant inlassablement mes objectifs avec un esprit autodidacte.", description: "Enrichi par mes expériences en finance et passionné par l&apos;art, je rêve de créer un projet innovant et inclusif pour tous. Mon parcours m&apos;inspire à mêler expertise financière et expression artistique, dans la quête d&apos;un avenir meilleur et partagé." },
    { socials: [], image: teamMember, name: 'Gilles Bruno', role: 'CTO', intro: "Passionné par l&apos;art et les hommes, je m&apos;inspire de la perfection artistique pour m&apos;améliorer sans cesse, poursuivant inlassablement mes objectifs avec un esprit autodidacte.", description: "Enrichi par mes expériences en finance et passionné par l&apos;art, je rêve de créer un projet innovant et inclusif pour tous. Mon parcours m&apos;inspire à mêler expertise financière et expression artistique, dans la quête d&apos;un avenir meilleur et partagé." },
    { socials: [], image: teamMember, name: 'Nino Lamoureux', role: 'CTO', intro: "Passionné par l&apos;art et les hommes, je m&apos;inspire de la perfection artistique pour m&apos;améliorer sans cesse, poursuivant inlassablement mes objectifs avec un esprit autodidacte.", description: "Enrichi par mes expériences en finance et passionné par l&apos;art, je rêve de créer un projet innovant et inclusif pour tous. Mon parcours m&apos;inspire à mêler expertise financière et expression artistique, dans la quête d&apos;un avenir meilleur et partagé." },
  ]

  return (
    <>
      <div className="relative max-w-90 xl:max-w-screen-xl m-auto mt-headerSize">
        <BioSlider items={teamImages} title="Découvrez notre équipe" />
        <div className="mt-20">
          <h1 className='text-2xl lg:text-6xl bricolage-grotesque font-medium mb-6'>Rencontrez toute l&apos;équipe</h1>
          <div className="flex flex-wrap gap-4">
            {teamImages.map((item) =>
              <TeamCard key={item.name} {...item} additionalClassName="w-full lg:w-cardLarge" />
            )}
          </div>
        </div>
        
      </div>
    </>
  );
}
