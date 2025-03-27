import Image from "next/image";
import Button from "../common/Button";
import { ArrowRight } from 'lucide-react';

export default function Explore() {
  const items = [
    { name: "Very Rare", label: "Forte de +80 années d’expérience cumulée, notre équipe commerciale sélectionne avec soin moins de 100 œuvres de top artistes.", description: "Ici, chaque œuvre, qu'elle soit physique ou numérique, est soigneusement sélectionnée pour son caractère unique.Pour les collectionneurs aguerris comme pour les novices, la possibilité d'acquérir des œuvres aussi rares est un privilège qui permet de se démarquer tout en enrichissant une collection de manière significative" },
    { name: "Une Marketplace unique", label: "Notre marketplace se distingue par sa singularité et son innovation, en intégrant harmonieusement des œuvres physiques, des NFTs, et des droits d'auteur fractionnés. ", description: "Grâce à l'utilisation de la blockchain, nous garantissons la transparence et la sécurité des transactions, tout en permettant une traçabilité claire de chaque pièce. Cette combinaison novatrice offre aux collectionneurs un accès inédit à des œuvres diversifiées et exclusives, tout en offrant la possibilité d'acquérir des droits d'auteur et de participer à un marché artistique de pointe" },
    { name: "Opportunité d’investissement", label: "L'art est plus qu'une simple passion, c'est aussi une opportunité d'investissement. ", description: "Notre marketplace vous offre la possibilité de diversifier votre portefeuille en acquérant des œuvres d'art physiques et numériques, ainsi que des droits d'auteur. Grâce à la rareté des pièces proposées, chaque acquisition a le potentiel d'augmenter en valeur avec le temps. Que vous soyez un collectionneur débutant ou averti, vous avez ici la chance de faire partie d'un marché dynamique où chaque œuvre peut devenir une source de valorisation à long terme" },
  ]
  return (
    <section className="w-full mt-36">
      <div className="max-w-90 xl:max-w-screen-xl m-auto">
        <h1 className="text-lg lg:text-xl bricolage-grotesque flex gap-4 ">
          <Image src={`/icons/Logo-purple.png`} alt='IRA-LOGO' width="33" height="33" />
          Avec InRealArt
        </h1>
        <label className="text-2xl lg:text-5xl block bricolage-grotesque !leading-snug">Explorez une <span className="text-purpleColor">collection unique</span> de <span className="text-purpleColor">toiles physiques</span> et de <span className="text-purpleColor">sculptures</span> <span className="opacity-50 hover:opacity-100">rares, de leurs copies numériques (NFT), accompagnées de leurs droits d'auteur.</span></label>
      </div>
      <Image className="max-w-full md:max-w-screen-image m-auto w-full mt-6" src={`/images/explore.png`} alt='IRA-IMAGE' width="1440" height="450" />

      <div className="max-w-90 xl:max-w-screen-xl m-auto flex flex-col gap-4 ">
        {items.map((item, index) => {
          const reverseClassName = index % 2 !== 0 ? 'md:flex-row-reverse' : '';
          return (
            <div key={index} className={`w-full flex flex-col md:flex-row gap-6 md:gap-20 mt-28 items-center ${reverseClassName}`}>
              <div className="basis-1/2">
                <h1 className="text-2xl lg:text-5xl bricolage-grotesque">{item.name} </h1>
                <label className="my-4 block bricolage-grotesque">{item.label}</label>
              </div>
              <div className="basis-1/2">
                <label className="my-4 block bricolage-grotesque">{item.description}</label>
                <Button text="Pre-sales" additionalClassName="bg-purpleColor" icon={<ArrowRight />} center />
                <Button text="Lire notre whitepaper" additionalClassName="mt-4 md:ml-4 md:mt-0" />
              </div>
            </div>
          )
        })}
      </div>
      <Image className="max-w-full md:max-w-screen-image m-auto w-full mt-16 md:mt-32" src={`/images/explore-1.png`} alt='IRA-IMAGE' width="1440" height="450" />
    </section>
  );
}
