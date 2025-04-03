import Image from "next/image";
import BG from "../../../public/images/intro-background.png";
import text43 from "../../../public/images/43.svg";
import text4 from "../../../public/images/4.svg";
import text3 from "../../../public/images/3.svg";
import textpourcent from "../../../public/images/%.svg";

// import text43 from "../../../public/images/43.png";

import Button from "../common/Button";

const Intro = () => {
  return (
    <section className="bg-cover m-auto bg-no-repeat bg-top h-screen w-full flex items-center justify-center" style={{ backgroundImage: ` url('${BG.src}')` }}>
      <div className="max-w-90 xl:max-w-screen-xl m-auto md:mt-headerSize flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-7xl bricolage-grotesque font-medium max-w-4xl mb-12 md:mb-4">
          La Tokenisation de l&apos;Art<br />
          accessible pour tous
        </h1>

        {/* <div className="relative">
          <div className="text-[180px] md:text-[320px] bricolage-grotesque font-medium text-transparent leading-none stroke">
            43%
          </div>
        </div> */}
        <Image src={text43} alt="artist" />


        <div className="mt-12 md:mt-4">
          <p className="text-lg md:text-2xl mb-4 text-center bricolage-grotesque font-bold">Oeuvres rares et exclusives</p>
          <Button
            text="Lire notre whitepapper"
            additionalClassName="border border-white text-white rounded-full py-3 px-8"
            center
          />
        </div>
      </div>
    </section>
  );
}

export default Intro;