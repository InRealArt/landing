import { bigTitleClassName } from "@/utils/classes";
import BG from "../../../public/images/presale/intro.png";
import Button from "../common/Button";
import { ArrowRight } from "lucide-react";

const Intro = () => {

  return (
    <section className="bg-cover m-auto bg-no-repeat bg-bottom h-screen w-full flex items-center justify-center" style={{ backgroundImage: ` url('${BG.src}')`}}>
      <div className="max-w-90 xl:max-w-screen-xl m-auto gap-12 flex flex-col mt-32 md:flex-row md:justify-between md:mt-auto">
      <div className="md:w-6/12 bricolage-grotesque font-semibold">
          <h1 className="text-4xl md:text-7xl bricolage-grotesque mb-8">L’art n’a jamais été aussi disponible</h1>
          <h3 className="mb-8 inter text-lg">Acquérez des oeuvres rares physiques pouvant être liées avec des nft et leurs droits d’auteurs. Explorez le fractionnemment d’oeuvres et ouvrez votre portefeuille aux actifs du futur </h3>
          <Button link="/presale" text="Catalogue 2024" additionalClassName="bg-purpleColor mr-6" icon={<ArrowRight />} />
          <Button text="Lire notre white paper" additionalClassName="mt-4 md:mt-0" />
        </div>
      </div>
    </section>
  );
}

export default Intro;