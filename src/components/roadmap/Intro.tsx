import { bigTitleClassName } from "@/utils/classes";
import BG from "../../../public/images/presale/intro.png";
import Button from "../common/Button";
import { ArrowRight } from "lucide-react";

const Intro = () => {

  return (
    <section className="bg-cover m-auto bg-no-repeat bg-bottom h-screen w-full flex items-center justify-center" style={{ backgroundImage: ` url('${BG.src}')`}}>
      <div className="max-w-90 xl:max-w-screen-xl m-auto gap-12 flex flex-col mt-32 md:flex-row md:justify-between md:mt-auto">
      <div className="md:w-6/12 bricolage-grotesque font-semibold">
          <h1 className="text-4xl md:text-7xl bricolage-grotesque mb-8">Les grandes étapes</h1>
          <h3 className="mb-8 inter text-lg">L’art c’est ouvert à de nouvelle horizon avec les RWA et aujourd’hui nous souhaitons partager ces œuvres au monde entier </h3>
          <Button link="/presale" text="Voir la markteplace" additionalClassName="bg-purpleColor mr-6" icon={<ArrowRight />} />
          <Button text="Lire notre white paper" additionalClassName="mt-4 md:mt-0" />
        </div>
      </div>
    </section>
  );
}

export default Intro;