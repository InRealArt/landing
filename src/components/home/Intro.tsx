import { bigTitleClassName } from "@/utils/classes";
import BG from "../../../public/images/intro-background.png";
import Button from "../common/Button";
import { ArrowRight } from "lucide-react";

const Intro = () => {

  return (
    <section className="bg-cover m-auto bg-no-repeat bg-top h-screen w-full flex items-center justify-center" style={{ backgroundImage: ` url('${BG.src}')`}}>
      <div className="max-w-90 xl:max-w-screen-xl m-auto gap-12 flex flex-col mt-32 md:flex-row md:justify-between md:mt-auto">
        <div className="md:w-6/12  bricolage-grotesque font-semibold">
          <label className="text-md md:text-2xl bricolage-grotesque">Co-propriétaires d’oeuvres rares et exclusives</label>
          <h1 className="text-4xl md:text-6xl">La Tokenisation de l’Art </h1>
        </div>
        <div className="md:w-6/12 mt-4 md:mt-0">
          <p className="mb-8 inter text-lg">Inreal Art est une Baas (Blockchain as a Service) qui génère des rendements via une galerie d’art en ligne, une marketplace et une communauté. Elle offre à chacun l'accès à la liquidité grâce aux Real World Assets issus d’artistes d’exception, de galeries et de collectionneurs renommés.</p>
          <Button link="/presale" text="Pre Sale" additionalClassName="bg-purpleColor mr-6" icon={<ArrowRight />} />
          <Button text="Lire notre white paper" additionalClassName="mt-4 md:mt-0"/>
        </div>
      </div>
    </section>
  );
}

export default Intro;